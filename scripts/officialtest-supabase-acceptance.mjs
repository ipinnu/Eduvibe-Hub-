import { createHash } from "node:crypto";
import nextEnv from "@next/env";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

const { loadEnvConfig } = nextEnv;
loadEnvConfig(process.cwd());

const email = process.env.OFFICIALTEST_EMAIL;
const password = process.env.OFFICIALTEST_PASSWORD;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const appUrl = process.env.OFFICIALTEST_APP_URL || "http://localhost:3010";

if (!email || !password || !supabaseUrl || !supabaseKey) {
  throw new Error(
    "Set OFFICIALTEST_EMAIL, OFFICIALTEST_PASSWORD, NEXT_PUBLIC_SUPABASE_URL, and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
  );
}

const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
const runId = `officialtest-cli-${stamp}`;
const results = [];
const ids = {};
const cookieJar = new Map();

function record(area, operation, status, detail = "") {
  results.push({ area, operation, status, detail });
  const marker = status === "PASS" ? "PASS" : status === "SKIP" ? "SKIP" : "FAIL";
  console.log(`[${marker}] ${area} :: ${operation}${detail ? ` :: ${detail}` : ""}`);
}

async function check(area, operation, work) {
  try {
    const value = await work();
    record(area, operation, "PASS");
    return value;
  } catch (error) {
    record(area, operation, "FAIL", error instanceof Error ? error.message : String(error));
    return undefined;
  }
}

function skip(area, operation, detail) {
  record(area, operation, "SKIP", detail);
}

function unwrap(result, context) {
  if (result.error) throw new Error(`${context}: ${result.error.message}`);
  return result.data;
}

function expect(condition, message) {
  if (!condition) throw new Error(message);
}

function cookieHeader() {
  return [...cookieJar.entries()].map(([name, value]) => `${name}=${value}`).join("; ");
}

const supabase = createServerClient(supabaseUrl, supabaseKey, {
  cookies: {
    getAll() {
      return [...cookieJar.entries()].map(([name, value]) => ({ name, value }));
    },
    setAll(cookiesToSet) {
      for (const { name, value } of cookiesToSet) cookieJar.set(name, value);
    },
  },
});

const anonymous = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const auth = await check("auth", "sign in and create SSR cookies", async () => {
  const data = unwrap(await supabase.auth.signInWithPassword({ email, password }), "sign in");
  expect(data.user?.id, "Supabase returned no authenticated user.");
  expect(cookieJar.size > 0, "Supabase SSR did not write an auth cookie.");
  ids.userId = data.user.id;
  return data;
});

if (!auth) {
  console.log(JSON.stringify({ runId, results, ids }, null, 2));
  process.exitCode = 1;
} else {
  await check("auth", "read tutor-admin profile through RLS", async () => {
    const profile = unwrap(
      await supabase.from("profiles").select("id,email,role").eq("id", ids.userId).single(),
      "profile read",
    );
    expect(profile.role === "tutor_admin", `Expected tutor_admin, received ${profile.role}.`);
  });

  const tutor = await check("profiles", "find partner tutor for assignment", async () => {
    const rows = unwrap(
      await supabase.from("profiles").select("id,email,role").eq("role", "partner_tutor").limit(1),
      "partner tutor read",
    );
    expect(rows.length === 1, "No partner_tutor profile exists.");
    ids.tutorId = rows[0].id;
    return rows[0];
  });

  const student = await check("students", "insert complete officialtest learner", async () => {
    const row = unwrap(
      await supabase
        .from("students")
        .insert({
          full_name: `${runId} Student`,
          preferred_name: "officialtest",
          age: 12,
          year_group: "officialtest Year 7",
          subjects: ["officialtest Mathematics", "officialtest English"],
          learning_goals: "officialtest algebra fluency and reading comprehension",
          accommodations: "officialtest visual examples and short practice blocks",
          created_by: ids.userId,
        })
        .select("*")
        .single(),
      "student insert",
    );
    expect(row.full_name === `${runId} Student`, "Student readback did not match insert.");
    ids.studentId = row.id;
    return row;
  });

  if (student && tutor) {
    await check("tutor_assignments", "upsert primary tutor assignment", async () => {
      const row = unwrap(
        await supabase
          .from("tutor_assignments")
          .upsert({ tutor_id: tutor.id, student_id: student.id, is_primary: true })
          .select("*")
          .single(),
        "tutor assignment upsert",
      );
      expect(row.is_primary === true, "Primary tutor flag was not persisted.");
    });
  } else {
    skip("tutor_assignments", "upsert primary tutor assignment", "Missing student or partner tutor dependency.");
  }

  const session = student
    ? await check("sessions", "insert scheduled lesson", async () => {
        const startsAt = new Date(Date.now() + 48 * 60 * 60 * 1000);
        const endsAt = new Date(startsAt.getTime() + 60 * 60 * 1000);
        const row = unwrap(
          await supabase
            .from("sessions")
            .insert({
              student_id: student.id,
              tutor_id: ids.userId,
              title: `${runId} Algebra Foundations`,
              subject: "officialtest Mathematics",
              starts_at: startsAt.toISOString(),
              ends_at: endsAt.toISOString(),
              time_zone: "Africa/Lagos",
              calendar_sync_status: "not_connected",
            })
            .select("*")
            .single(),
          "session insert",
        );
        ids.sessionId = row.id;
        return row;
      })
    : undefined;

  if (session && student) {
    await check("sessions", "update attendance, status, and board lock", async () => {
      const row = unwrap(
        await supabase
          .from("sessions")
          .update({ attendance: "present", status: "completed", board_locked: true })
          .eq("id", session.id)
          .select("attendance,status,board_locked")
          .single(),
        "session update",
      );
      expect(row.attendance === "present" && row.status === "completed" && row.board_locked, "Session update mismatch.");
    });

    await check("lesson_boards", "insert and update collaborative board", async () => {
      unwrap(
        await supabase.from("lesson_boards").insert({
          session_id: session.id,
          student_id: student.id,
          updated_by: ids.userId,
          snapshot: { officialtest: runId, shapes: [] },
        }),
        "lesson board insert",
      );
      const row = unwrap(
        await supabase
          .from("lesson_boards")
          .update({ snapshot: { officialtest: runId, shapes: [{ id: "shape-1" }] }, revision: 1 })
          .eq("session_id", session.id)
          .select("snapshot,revision")
          .single(),
        "lesson board update",
      );
      expect(row.revision === 1 && row.snapshot?.officialtest === runId, "Lesson board readback mismatch.");
    });

    await check("lesson_reviews", "upsert published lesson review", async () => {
      const row = unwrap(
        await supabase
          .from("lesson_reviews")
          .upsert(
            {
              session_id: session.id,
              student_id: student.id,
              author_id: ids.userId,
              summary: `${runId} lesson summary`,
              strengths: "officialtest equation balancing",
              focus_next: "officialtest word problems",
              engagement: 5,
              published_at: new Date().toISOString(),
            },
            { onConflict: "session_id" },
          )
          .select("*")
          .single(),
        "lesson review upsert",
      );
      ids.reviewId = row.id;
      expect(row.engagement === 5, "Lesson review engagement did not persist.");
    });

    await check("lesson_private_notes", "upsert staff-only lesson note", async () => {
      const row = unwrap(
        await supabase
          .from("lesson_private_notes")
          .upsert(
            {
              session_id: session.id,
              student_id: student.id,
              author_id: ids.userId,
              note: `${runId} private staff note`,
            },
            { onConflict: "session_id" },
          )
          .select("note")
          .single(),
        "private note upsert",
      );
      expect(row.note.includes(runId), "Private note readback mismatch.");
    });
  }

  const homework = student
    ? await check("homework", "insert assignment", async () => {
        const row = unwrap(
          await supabase
            .from("homework")
            .insert({
              student_id: student.id,
              session_id: session?.id ?? null,
              assigned_by: ids.userId,
              title: `${runId} Algebra Practice`,
              instructions: "officialtest complete questions 1 to 10",
              due_at: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
              time_zone: "Africa/Lagos",
              resource_url: "https://example.invalid/officialtest-resource",
            })
            .select("*")
            .single(),
          "homework insert",
        );
        ids.homeworkId = row.id;
        return row;
      })
    : undefined;

  if (homework) {
    await check("homework", "accept submission fields and tutor review", async () => {
      unwrap(
        await supabase
          .from("homework")
          .update({
            submission_url: "https://example.invalid/officialtest-submission",
            submission_note: `${runId} submission note`,
            status: "submitted",
            submitted_at: new Date().toISOString(),
          })
          .eq("id", homework.id),
        "homework submission update",
      );
      const row = unwrap(
        await supabase
          .from("homework")
          .update({ feedback: `${runId} feedback`, status: "reviewed", reviewed_at: new Date().toISOString() })
          .eq("id", homework.id)
          .select("status,feedback,submission_url,submission_note")
          .single(),
        "homework review update",
      );
      expect(row.status === "reviewed" && row.submission_note.includes(runId), "Homework lifecycle readback mismatch.");
    });
  }

  const curriculum = await check("curricula", "insert learning path", async () => {
    const row = unwrap(
      await supabase
        .from("curricula")
        .insert({ title: `${runId} Mathematics Path`, description: "officialtest curriculum", created_by: ids.userId })
        .select("*")
        .single(),
      "curriculum insert",
    );
    ids.curriculumId = row.id;
    return row;
  });

  const node = curriculum
    ? await check("curriculum_nodes", "insert curriculum skill node", async () => {
        const row = unwrap(
          await supabase
            .from("curriculum_nodes")
            .insert({
              curriculum_id: curriculum.id,
              node_type: "skill",
              title: `${runId} Solve linear equations`,
              description: "officialtest evidence skill",
              sort_order: 1,
            })
            .select("*")
            .single(),
          "curriculum node insert",
        );
        ids.curriculumNodeId = row.id;
        return row;
      })
    : undefined;

  if (student && curriculum && node) {
    await check("student_curricula", "assign curriculum to student", async () => {
      const row = unwrap(
        await supabase
          .from("student_curricula")
          .upsert(
            { student_id: student.id, curriculum_id: curriculum.id, assigned_by: ids.userId },
            { onConflict: "student_id,curriculum_id" },
          )
          .select("*")
          .single(),
        "student curriculum upsert",
      );
      expect(row.student_id === student.id, "Student curriculum assignment mismatch.");
    });

    await check("student_progress", "upsert assessed progress", async () => {
      const row = unwrap(
        await supabase
          .from("student_progress")
          .upsert(
            {
              student_id: student.id,
              curriculum_node_id: node.id,
              status: "confident",
              evidence: `${runId} solved 9 of 10 equations`,
              assessed_by: ids.userId,
              assessed_at: new Date().toISOString(),
            },
            { onConflict: "student_id,curriculum_node_id" },
          )
          .select("*")
          .single(),
        "student progress upsert",
      );
      expect(row.evidence.includes(runId), "Progress evidence readback mismatch.");
    });
  }

  if (student) {
    await check("reports", "insert published progress report", async () => {
      const row = unwrap(
        await supabase
          .from("reports")
          .insert({
            student_id: student.id,
            period: "weekly",
            period_start: "2026-08-10",
            period_end: "2026-08-16",
            title: `${runId} Progress Report`,
            overview: "officialtest steady progress",
            achievements: "officialtest algebra achievement",
            focus_next: "officialtest multi-step problems",
            attendance_summary: "officialtest present",
            homework_summary: "officialtest completed",
            status: "published",
            created_by: ids.userId,
            published_at: new Date().toISOString(),
          })
          .select("*")
          .single(),
        "report insert",
      );
      ids.reportId = row.id;
      expect(row.status === "published", "Report status was not published.");
    });
  }

  await check("notification_preferences", "upsert admin notification preferences", async () => {
    const row = unwrap(
      await supabase
        .from("notification_preferences")
        .upsert(
          {
            user_id: ids.userId,
            session_reminders: true,
            homework_updates: true,
            report_updates: true,
            email_enabled: false,
          },
          { onConflict: "user_id" },
        )
        .select("*")
        .single(),
      "notification preference upsert",
    );
    expect(row.email_enabled === false, "Notification preference readback mismatch.");
  });

  const notification = await check("notifications", "insert in-app notification", async () => {
    const row = unwrap(
      await supabase
        .from("notifications")
        .insert({
          recipient_id: ids.userId,
          title: `${runId} Notification`,
          body: "officialtest in-app delivery",
          link: "/portal/notifications",
          channel: "in_app",
        })
        .select("*")
        .single(),
      "notification insert",
    );
    ids.notificationId = row.id;
    return row;
  });

  if (notification) {
    await check("notifications", "mark notification read", async () => {
      const row = unwrap(
        await supabase
          .from("notifications")
          .update({ read_at: new Date().toISOString() })
          .eq("id", notification.id)
          .select("read_at")
          .single(),
        "notification update",
      );
      expect(row.read_at, "Notification read_at was not stored.");
    });
  }

  await check("store_products", "upsert and read product", async () => {
    const slug = `${runId}-product`;
    const row = unwrap(
      await supabase
        .from("store_products")
        .upsert(
          {
            slug,
            title: `${runId} Workbook`,
            short_description: "officialtest workbook",
            description: "officialtest full product description",
            product_type: "Downloadable",
            price_kobo: 250000,
            currency: "NGN",
            image_url: "https://example.invalid/officialtest-image.png",
            checkout_url: "https://example.invalid/officialtest-checkout",
            audience: "officialtest Year 7",
            features: ["officialtest printable", "officialtest answers"],
            status: "draft",
            featured: false,
            created_by: ids.userId,
          },
          { onConflict: "slug" },
        )
        .select("*")
        .single(),
      "store product upsert",
    );
    ids.productId = row.id;
    expect(row.price_kobo === 250000 && row.status === "draft", "Product readback mismatch.");
  });

  await check("contact_requests", "submit valid request through local HTTP endpoint", async () => {
    const response = await fetch(`${appUrl}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": `officialtest/${runId}` },
      body: JSON.stringify({
        parentName: `${runId} Parent`,
        childName: `${runId} Child`,
        yearGroup: "officialtest Year 7",
        subjectInterest: ["Maths", "Science"],
        preferredDays: ["Tue", "Thu"],
        whatsapp: "+234 800 000 0001",
        note: "officialtest contact request",
        website: "",
      }),
    });
    const body = await response.json();
    expect(response.status === 201 && body.success === true, `Contact endpoint returned ${response.status}: ${JSON.stringify(body)}`);
  });

  await check("contact_requests", "reject malformed contact before persistence", async () => {
    const response = await fetch(`${appUrl}/api/contact`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ parentName: "officialtest", childName: "", whatsapp: "bad" }),
    });
    expect(response.status === 422, `Expected 422, received ${response.status}.`);
  });

  if (session) {
    await check("lesson-board API", "GET authenticated board snapshot", async () => {
      const response = await fetch(`${appUrl}/api/lesson-boards/${session.id}`, {
        headers: { cookie: cookieHeader() },
      });
      const body = await response.json();
      expect(response.status === 200 && body.board?.revision === 1, `GET returned ${response.status}: ${JSON.stringify(body)}`);
    });

    await check("lesson-board API", "PATCH authenticated board revision", async () => {
      const response = await fetch(`${appUrl}/api/lesson-boards/${session.id}`, {
        method: "PATCH",
        headers: { cookie: cookieHeader(), "content-type": "application/json" },
        body: JSON.stringify({ snapshot: { officialtest: runId, endpoint: true }, revision: 1 }),
      });
      const body = await response.json();
      expect(response.status === 200 && body.revision === 2, `PATCH returned ${response.status}: ${JSON.stringify(body)}`);
    });
  }

  await check("invite endpoint", "reject unauthenticated invitation", async () => {
    const response = await fetch(`${appUrl}/api/admin/invite`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    expect(response.status === 401, `Expected 401, received ${response.status}.`);
  });

  await check("invite endpoint", "validate authenticated request without sending email", async () => {
    const response = await fetch(`${appUrl}/api/admin/invite`, {
      method: "POST",
      headers: { cookie: cookieHeader(), "content-type": "application/json" },
      body: JSON.stringify({}),
    });
    const body = await response.json();
    expect(response.status === 400 && /email/i.test(body.error || ""), `Expected safe 400 validation, received ${response.status}: ${JSON.stringify(body)}`);
  });

  await check("Google Calendar", "authenticated connect endpoint reaches OAuth boundary", async () => {
    const response = await fetch(`${appUrl}/api/integrations/google/connect`, {
      headers: { cookie: cookieHeader() },
      redirect: "manual",
    });
    const location = response.headers.get("location") || "";
    expect(response.status >= 300 && response.status < 400, `Expected redirect, received ${response.status}.`);
    expect(location.includes("accounts.google.com") || location.includes("google=error"), `Unexpected redirect: ${location}`);
  });

  skip("Resend email", "send transactional message", process.env.RESEND_API_KEY ? "Configured; deliberately not sent to avoid contacting a real recipient." : "RESEND_API_KEY is not configured; app will record email as skipped.");
  skip("Supabase Auth email", "send invite/reset message", "Endpoint authorization and validation tested; actual email deliberately not sent.");
  skip("parent_child_links", "link parent account", "No parent profile exists in the live project.");
  skip("students.child_profile_id", "link child login", "No child profile exists in the live project.");

  await check("RLS negative", "anonymous student insert is denied", async () => {
    const response = await anonymous.from("students").insert({ full_name: `${runId} anonymous-denied` });
    expect(Boolean(response.error), "Anonymous insert unexpectedly succeeded.");
  });

  await check("RLS negative", "anonymous officialtest student read is hidden", async () => {
    const response = await anonymous.from("students").select("id").eq("id", ids.studentId);
    if (response.error) return;
    expect((response.data || []).length === 0, "Anonymous user could read the protected student.");
  });

  await check("aggregate verification", "read linked officialtest graph", async () => {
    const row = unwrap(
      await supabase
        .from("students")
        .select("id,full_name,tutor_assignments(tutor_id,is_primary),sessions(id,title),homework(id,title),reports(id,title)")
        .eq("id", ids.studentId)
        .single(),
      "aggregate read",
    );
    expect(row.tutor_assignments?.length === 1, "Assignment missing from aggregate graph.");
    expect(row.sessions?.length === 1, "Session missing from aggregate graph.");
    expect(row.homework?.length === 1, "Homework missing from aggregate graph.");
    expect(row.reports?.length === 1, "Report missing from aggregate graph.");
  });

  const passed = results.filter((item) => item.status === "PASS").length;
  const failed = results.filter((item) => item.status === "FAIL").length;
  const skipped = results.filter((item) => item.status === "SKIP").length;
  console.log("\nOFFICIALTEST_SUMMARY");
  console.log(JSON.stringify({ runId, passed, failed, skipped, ids, results }, null, 2));
  process.exitCode = failed ? 1 : 0;
}
