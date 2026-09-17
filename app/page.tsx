import type { Metadata } from "next";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { MeetTutor } from "@/components/sections/MeetTutor";
import { Subjects } from "@/components/sections/Subjects";
import { Testimonials } from "@/components/sections/Testimonials";
import { TrustBar } from "@/components/sections/TrustBar";

export const metadata: Metadata = {
  title: "Online Tutoring in Nigeria for Children",
  description:
    "EduVibe Hub offers personalised online tutoring in Nigeria for children, with Maths, English, Science, homework support, exam preparation, and clear parent updates.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EduVibe Hub | Online Tutoring in Nigeria for Children",
    description:
      "Personalised online Maths, English, Science, homework support, and exam preparation for children in Nigeria.",
    url: "/",
  },
};

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <Subjects compact />
      <HowItWorks />
      <MeetTutor />
      <Testimonials />
      <FinalCTA />
    </main>
  );
}
