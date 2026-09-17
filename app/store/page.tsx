import type { Metadata } from "next";
import { Store } from "@/components/sections/Store";

export const metadata: Metadata = {
  title: "Learning Resources and Workbooks",
  description:
    "EduVibe Hub learning resources, workbooks, and study support materials for children receiving online tutoring and exam preparation.",
  alternates: {
    canonical: "/store",
  },
  openGraph: {
    title: "Learning Resources | EduVibe Hub",
    description: "Workbooks and study support materials from EduVibe Hub.",
    url: "/store",
  },
};

export default function StorePage() {
  return (
    <main>
      <Store />
    </main>
  );
}
