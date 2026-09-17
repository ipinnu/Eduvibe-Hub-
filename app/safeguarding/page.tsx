import type { Metadata } from "next";
import { LegalPage, PolicySection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Child Safeguarding for Online Lessons",
  description: "EduVibe Hub's child safeguarding approach for safe, professional online tutoring lessons.",
  alternates: {
    canonical: "/safeguarding",
  },
};

export default function SafeguardingPage() {
  return <LegalPage title="Child Safeguarding Policy" updated="2 August 2026"><PolicySection title="Our commitment"><p>Every child’s safety, dignity, and wellbeing come first. Lessons are educational, age-appropriate, professional, and conducted through agreed channels.</p></PolicySection><PolicySection title="Online lesson safeguards"><p>A parent or guardian must know when lessons take place and ensure the child has an appropriate space and device. Private contact, secret communication, inappropriate recording, and sharing access links are not permitted.</p></PolicySection><PolicySection title="Concerns"><p>Any disclosure, suspected harm, boundary concern, or unsafe behaviour is documented and escalated promptly. Where a child may be at immediate risk, EduVibe Hub may contact the parent, relevant safeguarding authority, or emergency service.</p></PolicySection><PolicySection title="Reporting"><p>Parents and learners should report concerns directly to EduVibe Hub by WhatsApp. Reports are treated seriously, shared only where necessary, and handled without retaliation.</p></PolicySection></LegalPage>;
}
