import "server-only";

import { Resend } from "resend";
import { getSiteUrl } from "@/lib/site-url";

export async function sendTransactionalEmail(input: { to: string; subject: string; body: string; link?: string | null }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, skipped: true, error: "RESEND_API_KEY is not configured." };

  const from = process.env.RESEND_FROM_EMAIL || "EduVibe Hub <onboarding@resend.dev>";
  const siteUrl = getSiteUrl();
  const href = input.link ? new URL(input.link, siteUrl).toString() : siteUrl;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#10143a"><h1 style="font-size:24px">${escapeHtml(input.subject)}</h1><p style="font-size:15px;line-height:1.7">${escapeHtml(input.body)}</p><p><a href="${escapeHtml(href)}" style="display:inline-block;background:#111a4a;color:white;padding:12px 18px;border-radius:10px;text-decoration:none;font-weight:700">Open EduVibe Hub</a></p><p style="color:#596078;font-size:12px">You received this service update because you have an EduVibe Hub account.</p></div>`,
  });
  return error ? { sent: false, skipped: false, error: error.message } : { sent: true, skipped: false, error: null };
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character);
}

