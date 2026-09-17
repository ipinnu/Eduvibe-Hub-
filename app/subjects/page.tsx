import type { Metadata } from "next";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Subjects } from "@/components/sections/Subjects";

export const metadata: Metadata = {
  title: "Maths, English, Science and Exam Tutoring in Nigeria",
  description:
    "Explore EduVibe Hub online tutoring for Maths, English, Science, homework support, exam preparation, and one-to-one learning support for children in Nigeria.",
  alternates: {
    canonical: "/subjects",
  },
  openGraph: {
    title: "Subjects and Exam Support | EduVibe Hub",
    description:
      "Personalised Maths, English, Science, homework support, and exam preparation from an online tutor in Nigeria.",
    url: "/subjects",
  },
};

export default function SubjectsPage() {
  return (
    <main className="pt-14">
      <h1 className="sr-only">Online Maths, English, Science and exam tutoring in Nigeria</h1>
      <Subjects />
      <FinalCTA />
    </main>
  );
}
