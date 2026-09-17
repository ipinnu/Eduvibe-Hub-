import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portal | EduVibe Hub",
  description: "Learning, lessons, and progress in one calm place.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
