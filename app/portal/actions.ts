"use server";

import { revalidatePath } from "next/cache";
import { requirePortalRole } from "@/lib/auth";
import { DEFAULT_TIME_ZONE, localDateTimeToUtc } from "@/lib/date-time";
import { sendTransactionalEmail } from "@/lib/email";
import { createGoogleCalendarLesson } from "@/lib/google-calendar";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: boolean; message: string };

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function required(formData: FormData, keys: string[]) {
  for (const key of keys) if (!text(formData, key)) throw new Error(`${key.replaceAll("_", " ")} is required.`);
}

function resultError(error: unknown): ActionResult {
  return { ok: false, message: error instanceof Error ? error.message : "Something went wrong." };
}

type NotificationKind = "session" | "homework" | "report";

async function notifyStudentFamily(studentId: string, title: string, body: string, link: string, kind: NotificationKind) {
  const supabase = await createClient();
  const { data: links } = await supabase.from("parent_child_links").select("parent_id").eq("student_id", studentId);
  if (!links?.length) return;
  for (const item of links) {
    const [{ data: profile }, { data: preferences }] = await Promise.all([
      supabase.from("profiles").select("email").eq("id", item.parent_id).maybeSingle(),
      supabase.from("notification_preferences").select("session_reminders,homework_updates,report_updates,email_enabled").eq("user_id", item.parent_id).maybeSingle(),
    ]);
    const enabled = kind === "session" ? preferences?.session_reminders !== false : kind === "homework" ? preferences?.homework_updates !== false : preferences?.report_updates !== false;
    if (!enabled) continue;
    const emailEnabled = Boolean(profile?.email && preferences?.email_enabled !== false);
    const { data: notification } = await supabase.from("notifications").insert({ recipient_id: item.parent_id, title, body, link, channel: emailEnabled ? "both" : "in_app" }).select("id").single();
    if (emailEnabled && profile?.email && notification) {
      const sent = await sendTransactionalEmail({ to: profile.email, subject: title, body, link });
      await supabase.from("notifications").update(sent.sent ? { emailed_at: new Date().toISOString(), email_error: null } : { email_error: sent.error }).eq("id", notification.id);
    }
  }
}

export async function createStudent(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requirePortalRole(["tutor_admin"]);
    required(formData, ["full_name"]);
    const supabase = await createClient();
    const subjects = text(formData, "subjects").split(",").map((item) => item.trim()).filter(Boolean);
    const { error } = await supabase.from("students").insert({
      full_name: text(formData, "full_name"),
      preferred_name: text(formData, "preferred_name") || null,
      year_group: text(formData, "year_group") || null,
      age: Number(text(formData, "age")) || null,
      subjects,
      learning_goals: text(formData, "learning_goals"),
      accommodations: text(formData, "accommodations"),
      created_by: user.id,
    });
    if (error) throw error;
    revalidatePath("/portal/students");
    return { ok: true, message: "Student profile created." };
  } catch (error) { return resultError(error); }
}

export async function updateStudent(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["tutor_admin"]);
    required(formData, ["student_id", "full_name"]);
    const supabase = await createClient();
    const subjects = text(formData, "subjects").split(",").map((item) => item.trim()).filter(Boolean);
    const { error } = await supabase.from("students").update({
      full_name: text(formData, "full_name"),
      preferred_name: text(formData, "preferred_name") || null,
      year_group: text(formData, "year_group") || null,
      age: Number(text(formData, "age")) || null,
      subjects,
      learning_goals: text(formData, "learning_goals"),
      accommodations: text(formData, "accommodations"),
      active: text(formData, "active") === "yes",
    }).eq("id", text(formData, "student_id"));
    if (error) throw error;
    revalidatePath("/portal/students");
    revalidatePath("/portal");
    return { ok: true, message: "Student profile updated." };
  } catch (error) { return resultError(error); }
}

export async function createSession(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["student_id", "subject", "starts_at", "ends_at"]);
    const timeZone = text(formData, "time_zone") || DEFAULT_TIME_ZONE;
    const startsAt = localDateTimeToUtc(text(formData, "starts_at"), timeZone);
    const endsAt = localDateTimeToUtc(text(formData, "ends_at"), timeZone);
    if (!Number.isFinite(startsAt.getTime()) || !Number.isFinite(endsAt.getTime()) || endsAt <= startsAt) throw new Error("Choose a valid start and end time.");
    const supabase = await createClient();
    const studentId = text(formData, "student_id");
    const title = text(formData, "title") || `${text(formData, "subject")} lesson`;
    const { data: session, error } = await supabase.from("sessions").insert({ student_id: studentId, tutor_id: user.id, title, subject: text(formData, "subject"), starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString(), time_zone: timeZone }).select("id").single();
    if (error || !session) throw error || new Error("Session could not be created.");
    await supabase.from("lesson_boards").insert({ session_id: session.id, student_id: studentId, updated_by: user.id });
    const { data: familyLinks } = await supabase.from("parent_child_links").select("parent_id").eq("student_id", studentId);
    const parentIds = (familyLinks || []).map((item) => item.parent_id);
    const { data: familyProfiles } = parentIds.length ? await supabase.from("profiles").select("email").in("id", parentIds) : { data: [] as Array<{ email: string | null }> };
    const attendees = (familyProfiles || []).map((item) => item.email).filter((email): email is string => Boolean(email));
    try {
      const calendar = await createGoogleCalendarLesson({ userId: user.id, title, description: `EduVibe Hub ${text(formData, "subject")} session`, startsAt: startsAt.toISOString(), endsAt: endsAt.toISOString(), attendees });
      if (calendar.connected) await supabase.from("sessions").update({ google_event_id: calendar.eventId, meet_url: calendar.meetUrl, calendar_sync_status: "synced", calendar_sync_error: null }).eq("id", session.id);
      else await supabase.from("sessions").update({ calendar_sync_status: "not_connected" }).eq("id", session.id);
    } catch (calendarError) {
      await supabase.from("sessions").update({ calendar_sync_status: "failed", calendar_sync_error: calendarError instanceof Error ? calendarError.message : "Calendar sync failed." }).eq("id", session.id);
    }
    await notifyStudentFamily(studentId, "A lesson has been scheduled", `${title} is scheduled for ${startsAt.toLocaleString("en-NG", { timeZone })}.`, "/portal/sessions", "session");
    revalidatePath("/portal/sessions");
    return { ok: true, message: "Session scheduled. Google Meet is added automatically when Calendar is connected." };
  } catch (error) { return resultError(error); }
}

export async function updateAttendance(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["session_id", "attendance"]);
    const supabase = await createClient();
    const { error } = await supabase.from("sessions").update({ attendance: text(formData, "attendance"), status: text(formData, "status") || "completed" }).eq("id", text(formData, "session_id"));
    if (error) throw error;
    revalidatePath("/portal/sessions");
    return { ok: true, message: "Attendance updated." };
  } catch (error) { return resultError(error); }
}

export async function toggleBoardLock(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["session_id", "locked"]);
    const supabase = await createClient();
    const { error } = await supabase.from("sessions").update({ board_locked: text(formData, "locked") === "yes" }).eq("id", text(formData, "session_id"));
    if (error) throw error;
    revalidatePath("/portal/sessions");
    return { ok: true, message: text(formData, "locked") === "yes" ? "Student editing locked." : "Student editing enabled." };
  } catch (error) { return resultError(error); }
}

export async function saveLessonReview(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["session_id", "student_id"]);
    const supabase = await createClient();
    const publish = text(formData, "publish") === "yes";
    const base = { session_id: text(formData, "session_id"), student_id: text(formData, "student_id"), author_id: user.id };
    const { error } = await supabase.from("lesson_reviews").upsert({ ...base, summary: text(formData, "summary"), strengths: text(formData, "strengths"), focus_next: text(formData, "focus_next"), engagement: Number(text(formData, "engagement")) || null, published_at: publish ? new Date().toISOString() : null }, { onConflict: "session_id" });
    if (error) throw error;
    const { error: noteError } = await supabase.from("lesson_private_notes").upsert({ ...base, note: text(formData, "private_note") }, { onConflict: "session_id" });
    if (noteError) throw noteError;
    if (publish) await notifyStudentFamily(base.student_id, "New lesson review", text(formData, "summary") || "A new lesson review is ready.", "/portal/reports", "report");
    revalidatePath("/portal/sessions");
    revalidatePath("/portal/reports");
    return { ok: true, message: publish ? "Review published to the parent portal." : "Review saved as a staff draft." };
  } catch (error) { return resultError(error); }
}

export async function createHomework(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["student_id", "title"]);
    const supabase = await createClient();
    const studentId = text(formData, "student_id");
    const timeZone = text(formData, "time_zone") || DEFAULT_TIME_ZONE;
    const { error } = await supabase.from("homework").insert({ student_id: studentId, session_id: text(formData, "session_id") || null, assigned_by: user.id, title: text(formData, "title"), instructions: text(formData, "instructions"), due_at: text(formData, "due_at") ? localDateTimeToUtc(text(formData, "due_at"), timeZone).toISOString() : null, time_zone: timeZone, resource_url: text(formData, "resource_url") || null });
    if (error) throw error;
    await notifyStudentFamily(studentId, "New homework assigned", text(formData, "title"), "/portal/homework", "homework");
    revalidatePath("/portal/homework");
    return { ok: true, message: "Homework assigned and the family notified." };
  } catch (error) { return resultError(error); }
}

export async function submitHomework(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["child"]);
    required(formData, ["homework_id"]);
    const supabase = await createClient();
    const { error } = await supabase.from("homework").update({ submission_url: text(formData, "submission_url") || null, submission_note: text(formData, "submission_note"), status: "submitted", submitted_at: new Date().toISOString() }).eq("id", text(formData, "homework_id"));
    if (error) throw error;
    revalidatePath("/portal/homework");
    return { ok: true, message: "Homework submitted." };
  } catch (error) { return resultError(error); }
}

export async function reviewHomework(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["homework_id"]);
    const supabase = await createClient();
    const { error } = await supabase.from("homework").update({ feedback: text(formData, "feedback"), status: "reviewed", reviewed_at: new Date().toISOString() }).eq("id", text(formData, "homework_id"));
    if (error) throw error;
    revalidatePath("/portal/homework");
    return { ok: true, message: "Feedback saved." };
  } catch (error) { return resultError(error); }
}

export async function linkAccount(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["tutor_admin"]);
    required(formData, ["profile_id", "student_id", "role"]);
    const supabase = await createClient();
    const profileId = text(formData, "profile_id");
    const studentId = text(formData, "student_id");
    const role = text(formData, "role");
    const { data: account } = await supabase.from("profiles").select("role").eq("id", profileId).single();
    if (!account || account.role !== role) throw new Error("The selected account role does not match this relationship.");
    if (role === "parent") {
      const { error } = await supabase.from("parent_child_links").upsert({ parent_id: profileId, student_id: studentId, relationship: text(formData, "relationship") || "parent" });
      if (error) throw error;
    } else if (role === "partner_tutor") {
      const { error } = await supabase.from("tutor_assignments").upsert({ tutor_id: profileId, student_id: studentId, is_primary: text(formData, "is_primary") === "yes" });
      if (error) throw error;
    } else if (role === "child") {
      const { error } = await supabase.from("students").update({ child_profile_id: profileId }).eq("id", studentId);
      if (error) throw error;
    } else throw new Error("Choose a parent, partner tutor, or student account.");
    revalidatePath("/portal/access");
    return { ok: true, message: "Account linked to the student." };
  } catch (error) { return resultError(error); }
}

export async function createCurriculum(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["title"]);
    const supabase = await createClient();
    const { error } = await supabase.from("curricula").insert({ title: text(formData, "title"), description: text(formData, "description"), created_by: user.id });
    if (error) throw error;
    revalidatePath("/portal/curriculum");
    return { ok: true, message: "Learning path created. Add subjects, topics, skills, and milestones in any order you choose." };
  } catch (error) { return resultError(error); }
}

export async function addCurriculumNode(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["curriculum_id", "title", "node_type"]);
    const supabase = await createClient();
    const { error } = await supabase.from("curriculum_nodes").insert({ curriculum_id: text(formData, "curriculum_id"), parent_id: text(formData, "parent_id") || null, title: text(formData, "title"), description: text(formData, "description"), node_type: text(formData, "node_type"), sort_order: Number(text(formData, "sort_order")) || 0 });
    if (error) throw error;
    revalidatePath("/portal/curriculum");
    return { ok: true, message: "Learning-path item added." };
  } catch (error) { return resultError(error); }
}

export async function updateProgress(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["student_id", "curriculum_node_id", "status"]);
    const supabase = await createClient();
    const studentId = text(formData, "student_id");
    const curriculumNodeId = text(formData, "curriculum_node_id");
    const { data: node } = await supabase.from("curriculum_nodes").select("curriculum_id").eq("id", curriculumNodeId).single();
    if (!node) throw new Error("Learning-path item not found.");
    await supabase.from("student_curricula").upsert({ student_id: studentId, curriculum_id: node.curriculum_id, assigned_by: user.id }, { onConflict: "student_id,curriculum_id" });
    const { error } = await supabase.from("student_progress").upsert({ student_id: studentId, curriculum_node_id: curriculumNodeId, status: text(formData, "status"), evidence: text(formData, "evidence"), assessed_by: user.id, assessed_at: new Date().toISOString() }, { onConflict: "student_id,curriculum_node_id" });
    if (error) throw error;
    revalidatePath("/portal/curriculum");
    revalidatePath("/portal/reports");
    return { ok: true, message: "Progress evidence updated." };
  } catch (error) { return resultError(error); }
}

export async function createReport(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const user = await requirePortalRole(["tutor_admin", "partner_tutor"]);
    required(formData, ["student_id", "period", "period_start", "period_end", "title"]);
    const publish = text(formData, "publish") === "yes";
    const supabase = await createClient();
    const studentId = text(formData, "student_id");
    const { error } = await supabase.from("reports").insert({ student_id: studentId, period: text(formData, "period"), period_start: text(formData, "period_start"), period_end: text(formData, "period_end"), title: text(formData, "title"), overview: text(formData, "overview"), achievements: text(formData, "achievements"), focus_next: text(formData, "focus_next"), attendance_summary: text(formData, "attendance_summary"), homework_summary: text(formData, "homework_summary"), status: publish ? "published" : "draft", created_by: user.id, published_at: publish ? new Date().toISOString() : null });
    if (error) throw error;
    if (publish) await notifyStudentFamily(studentId, `${text(formData, "period")} progress report ready`, text(formData, "overview") || text(formData, "title"), "/portal/reports", "report");
    revalidatePath("/portal/reports");
    return { ok: true, message: publish ? "Report published and family notified." : "Report saved as a draft." };
  } catch (error) { return resultError(error); }
}

export async function markNotificationRead(_: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    await requirePortalRole(["tutor_admin", "partner_tutor", "parent", "child"]);
    required(formData, ["notification_id"]);
    const supabase = await createClient();
    const { error } = await supabase.from("notifications").update({ read_at: new Date().toISOString() }).eq("id", text(formData, "notification_id"));
    if (error) throw error;
    revalidatePath("/portal/notifications");
    return { ok: true, message: "Notification marked as read." };
  } catch (error) { return resultError(error); }
}
