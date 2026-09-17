"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/sections/Footer";
import { Nav } from "@/components/sections/Nav";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPortal = pathname.startsWith("/portal");

  if (isPortal) {
    return children;
  }

  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
