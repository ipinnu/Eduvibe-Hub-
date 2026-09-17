import type { Metadata } from "next";
import { LegalPage, PolicySection } from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms for EduVibe Hub online tutoring, scheduling, conduct, resources, and cancellations.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return <LegalPage title="Terms and Conditions" updated="2 August 2026"><PolicySection title="Tutoring service"><p>EduVibe Hub provides personalised online tutoring and learning support. A learning plan, timetable, fees, and any included resources are agreed with the parent or guardian before paid lessons begin.</p></PolicySection><PolicySection title="Lessons and attendance"><p>Families should provide a safe, suitable online learning environment and join on time. Rescheduling and cancellation arrangements are communicated when a booking is confirmed. Meet links and portal access must not be shared with unauthorised people.</p></PolicySection><PolicySection title="Resources and store"><p>Purchased or supplied learning resources are for the named family or learner unless the product says otherwise. Store purchases are completed on Selar and are also subject to Selar’s checkout terms.</p></PolicySection><PolicySection title="Safety and acceptable use"><p>Users must communicate respectfully, protect account credentials, and never misuse lesson rooms, whiteboards, files, or another person’s information. EduVibe Hub may restrict access where safety, privacy, or service integrity is at risk.</p></PolicySection></LegalPage>;
}
