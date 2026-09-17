import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PortalUser } from "@/lib/auth";

export type PortalStudent = {
  id: string;
  full_name: string;
  preferred_name: string | null;
  age: number | null;
  year_group: string | null;
  subjects: string[];
  learning_goals: string;
  accommodations: string;
  active: boolean;
};

export type PortalSession = {
  id: string;
  student_id: string;
  tutor_id: string;
  title: string;
  subject: string;
  starts_at: string;
  ends_at: string;
  status: string;
  attendance: string;
  meet_url: string | null;
  google_event_id: string | null;
  calendar_sync_status: string;
  board_locked: boolean;
  time_zone: string;
  student?: { full_name: string } | null;
  tutor?: { full_name: string } | null;
};

export type HomeworkItem = {
  id: string;
  student_id: string;
  title: string;
  instructions: string;
  due_at: string | null;
  resource_url: string | null;
  submission_url: string | null;
  submission_note: string;
  feedback: string;
  status: string;
  time_zone: string;
  student?: { full_name: string } | null;
};

export type Curriculum = {
  id: string;
  title: string;
  description: string;
  nodes?: Array<{ id: string; parent_id: string | null; node_type: string; title: string; description: string; sort_order: number }>;
};

export type ProgressItem = {
  student_id: string;
  curriculum_node_id: string;
  status: string;
  evidence: string;
  node?: { title: string; node_type: string; curriculum_id: string } | null;
};

export type PortalReport = {
  id: string;
  student_id: string;
  period: string;
  period_start: string;
  period_end: string;
  title: string;
  overview: string;
  achievements: string;
  focus_next: string;
  attendance_summary: string;
  homework_summary: string;
  status: string;
  student?: { full_name: string } | null;
};

export type PortalNotification = {
  id: string;
  title: string;
  body: string;
  link: string | null;
  read_at: string | null;
  emailed_at: string | null;
  created_at: string;
};

async function portalListQuery<T>(label: string, work: () => PromiseLike<{ data: unknown; error: { message?: string } | null }>): Promise<T[]> {
  try {
    const { data, error } = await work();
    if (error) {
      console.error(`[portal-data] ${label}:`, error.message);
      return [];
    }
    return Array.isArray(data) ? (data as T[]) : [];
  } catch (error) {
    console.error(`[portal-data] ${label}:`, error);
    return [];
  }
}

export async function getStudents(): Promise<PortalStudent[]> {
  const supabase = await createClient();
  return portalListQuery<PortalStudent>("student",
    () => supabase.from("students").select("id,full_name,preferred_name,age,year_group,subjects,learning_goals,accommodations,active").order("full_name"),
  );
}

export async function getSessions(): Promise<PortalSession[]> {
  const supabase = await createClient();
  return portalListQuery<PortalSession>("session",
    () => supabase.from("sessions").select("id,student_id,tutor_id,title,subject,starts_at,ends_at,status,attendance,meet_url,google_event_id,calendar_sync_status,board_locked,time_zone,student:students(full_name),tutor:profiles!sessions_tutor_id_fkey(full_name)").order("starts_at"),
  );
}

export async function getHomework(): Promise<HomeworkItem[]> {
  const supabase = await createClient();
  return portalListQuery<HomeworkItem>("homework",
    () => supabase.from("homework").select("id,student_id,title,instructions,due_at,resource_url,submission_url,submission_note,feedback,status,time_zone,student:students(full_name)").order("due_at"),
  );
}

export async function getCurricula(): Promise<Curriculum[]> {
  const supabase = await createClient();
  return portalListQuery<Curriculum>("curriculum",
    () => supabase.from("curricula").select("id,title,description,nodes:curriculum_nodes(id,parent_id,node_type,title,description,sort_order)").eq("active", true).order("title"),
  );
}

export async function getProgress(): Promise<ProgressItem[]> {
  const supabase = await createClient();
  return portalListQuery<ProgressItem>("progress",
    () => supabase.from("student_progress").select("student_id,curriculum_node_id,status,evidence,node:curriculum_nodes(title,node_type,curriculum_id)"),
  );
}

export async function getReports(): Promise<PortalReport[]> {
  const supabase = await createClient();
  return portalListQuery<PortalReport>("report",
    () => supabase.from("reports").select("id,student_id,period,period_start,period_end,title,overview,achievements,focus_next,attendance_summary,homework_summary,status,student:students(full_name)").order("period_end", { ascending: false }),
  );
}

export async function getNotifications(): Promise<PortalNotification[]> {
  const supabase = await createClient();
  return portalListQuery<PortalNotification>("notification",
    () => supabase.from("notifications").select("id,title,body,link,read_at,emailed_at,created_at").order("created_at", { ascending: false }).limit(50),
  );
}

export async function getPortalOverview(user: PortalUser) {
  const [students, sessions, homework, reports, progress, notifications] = await Promise.all([
    getStudents(), getSessions(), getHomework(), getReports(), getProgress(), getNotifications(),
  ]);
  const now = Date.now();
  const weekEnd = now + 7 * 24 * 60 * 60 * 1000;
  return {
    generatedAt: now,
    students,
    sessions,
    homework,
    reports,
    progress,
    notifications,
    stats: {
      students: students.length,
      upcomingSessions: sessions.filter((item) => new Date(item.starts_at).getTime() >= now && new Date(item.starts_at).getTime() <= weekEnd && item.status === "scheduled").length,
      homeworkDue: homework.filter((item) => item.status === "assigned").length,
      reportsDue: user.role === "parent" ? reports.filter((item) => item.status === "published").length : reports.filter((item) => item.status === "draft").length,
      unreadNotifications: notifications.filter((item) => !item.read_at).length,
    },
  };
}
