import type { Metadata } from "next";
import { LegalPage, PolicySection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How EduVibe Hub collects, uses, protects, and retains family and learner information for online tutoring.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return <LegalPage title="Privacy Policy" updated="2 August 2026"><PolicySection title="Information we collect"><p>We collect the parent and learner details needed to respond to enquiries, arrange lessons, manage accounts, track learning, provide reports, and keep families informed. This may include names, contact details, year group, learning goals, attendance, homework, progress, and lesson records.</p></PolicySection><PolicySection title="How information is used"><p>Information is used only to deliver and improve EduVibe Hub services, communicate with authorised family members, protect children, and meet legal or safeguarding duties. We do not sell personal information.</p></PolicySection><PolicySection title="Storage and access"><p>Portal data is held in access-controlled systems. Parents see linked children, students see their own learning information, assigned tutors see the learners they teach, and the tutor-admin manages the service. Private tutor notes are not shared with parents or students.</p></PolicySection><PolicySection title="Your choices"><p>You may ask to access, correct, or delete information, subject to safeguarding and legal retention duties. Notification preferences can be changed in the portal. Contact EduVibe Hub to make a request.</p></PolicySection></LegalPage>;
}
