import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type ContactPayload = {
  parentName?: unknown;
  childName?: unknown;
  yearGroup?: unknown;
  subjectInterest?: unknown;
  preferredDays?: unknown;
  whatsapp?: unknown;
  note?: unknown;
  website?: unknown;
};

const allowedSubjects = new Set(["Maths", "Literacy", "Science"]);
const allowedDays = new Set(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);

function clean(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanList(value: unknown, allowed: Set<string>) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && allowed.has(item)).slice(0, 6)
    : [];
}

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = await request.json() as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (clean(payload.website, 200)) return NextResponse.json({ success: true });

  const parentName = clean(payload.parentName, 100);
  const childName = clean(payload.childName, 100);
  const yearGroup = clean(payload.yearGroup, 50);
  const whatsapp = clean(payload.whatsapp, 32);
  const note = clean(payload.note, 2_000);
  const subjects = cleanList(payload.subjectInterest, allowedSubjects);
  const days = cleanList(payload.preferredDays, allowedDays);
  if (!parentName || !childName || !yearGroup || !whatsapp || !/^\+?[0-9 ()-]{7,32}$/.test(whatsapp)) {
    return NextResponse.json({ error: "Please complete the required details with a valid WhatsApp number." }, { status: 422 });
  }

  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const fingerprint = createHash("sha256")
    .update(`${forwarded}:${request.headers.get("user-agent") || "unknown"}:${process.env.CONTACT_RATE_LIMIT_SALT || "eduvibe"}`)
    .digest("hex");
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_contact_request", {
    p_parent_name: parentName,
    p_child_name: childName,
    p_year_group: yearGroup,
    p_subjects: subjects,
    p_preferred_days: days,
    p_whatsapp: whatsapp,
    p_note: note,
    p_fingerprint_hash: fingerprint,
  });

  if (error) {
    const limited = error.message.toLowerCase().includes("too many");
    const whatsappMessage = `Hello EduVibe Hub, I am ${parentName}. I would like tutoring support for ${childName} (${yearGroup}). Subjects: ${subjects.join(", ") || "To discuss"}. Preferred days: ${days.join(", ") || "Flexible"}.${note ? ` Note: ${note}` : ""}`;
    return NextResponse.json(
      { error: limited ? "Too many requests. Please try again in a few minutes." : "Online saving is temporarily unavailable. Continue securely on WhatsApp.", whatsappUrl: limited ? undefined : `https://wa.me/2349073149749?text=${encodeURIComponent(whatsappMessage)}` },
      { status: limited ? 429 : 503 },
    );
  }
  return NextResponse.json({ success: true }, { status: 201 });
}
