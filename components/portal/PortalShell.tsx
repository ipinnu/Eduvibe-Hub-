"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoutButton } from "@/components/portal/LogoutButton";
import { ROLE_LABELS, ROLE_PEOPLE, ROLE_ROUTES, type PortalRole } from "@/lib/portal";

const icons: Record<string, string> = {
  dashboard: "⌂",
  students: "◎",
  sessions: "◷",
  reports: "▤",
  store: "◇",
  settings: "⚙",
  access: "♙",
  homework: "✓",
  curriculum: "↗",
  notifications: "●",
};

const roleNavigation: Record<PortalRole, { label: string; href: string; icon: string }[]> = {
  tutor_admin: [
    { label: "Overview", href: "/portal/admin", icon: "dashboard" },
    { label: "Students", href: "/portal/students", icon: "students" },
    { label: "Sessions", href: "/portal/sessions", icon: "sessions" },
    { label: "Homework", href: "/portal/homework", icon: "homework" },
    { label: "Curriculum", href: "/portal/curriculum", icon: "curriculum" },
    { label: "Reports", href: "/portal/reports", icon: "reports" },
    { label: "Lesson reviews", href: "/portal/reviews", icon: "reports" },
    { label: "Notifications", href: "/portal/notifications", icon: "notifications" },
    { label: "Resources", href: "/portal/store", icon: "store" },
    { label: "People & access", href: "/portal/access", icon: "access" },
    { label: "Settings", href: "/portal/settings", icon: "settings" },
  ],
  partner_tutor: [
    { label: "Overview", href: "/portal/tutor", icon: "dashboard" },
    { label: "My students", href: "/portal/students", icon: "students" },
    { label: "Sessions", href: "/portal/sessions", icon: "sessions" },
    { label: "Homework", href: "/portal/homework", icon: "homework" },
    { label: "Learning paths", href: "/portal/curriculum", icon: "curriculum" },
    { label: "Lesson reviews", href: "/portal/reviews", icon: "reports" },
    { label: "Notifications", href: "/portal/notifications", icon: "notifications" },
    { label: "Resources", href: "/portal/resources", icon: "store" },
  ],
  parent: [
    { label: "Home", href: "/portal/parent", icon: "dashboard" },
    { label: "Sessions", href: "/portal/sessions", icon: "sessions" },
    { label: "Homework", href: "/portal/homework", icon: "homework" },
    { label: "Progress", href: "/portal/reports", icon: "reports" },
    { label: "Lesson reviews", href: "/portal/reviews", icon: "reports" },
    { label: "Notifications", href: "/portal/notifications", icon: "notifications" },
    { label: "Resources", href: "/portal/resources", icon: "store" },
  ],
  child: [
    { label: "My home", href: "/portal/student", icon: "dashboard" },
    { label: "My lessons", href: "/portal/sessions", icon: "sessions" },
    { label: "My homework", href: "/portal/homework", icon: "homework" },
    { label: "My progress", href: "/portal/reports", icon: "reports" },
    { label: "Lesson reviews", href: "/portal/reviews", icon: "reports" },
    { label: "Notifications", href: "/portal/notifications", icon: "notifications" },
    { label: "Resources", href: "/portal/resources", icon: "store" },
  ],
};

export function PortalShell({ children, role, userName, userEmail }: { children: React.ReactNode; role: PortalRole; userName?: string; userEmail?: string }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const person = ROLE_PEOPLE[role];
  const displayName = userName || person.name;
  const initials = displayName.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || person.initials;

  const sidebar = (
    <>
      <div className="flex h-20 items-center border-b border-white/10 px-6">
        <Link href="/" className="text-[21px] font-black tracking-[-0.05em]">
          <span className="text-white">EduVibe</span>
          <span className="text-ev-yellow">Hub</span>
        </Link>
      </div>
      <div className="px-4 py-5">
        <p className="px-3 font-mono text-[9px] uppercase tracking-[0.16em] text-white/40">{ROLE_LABELS[role]} portal</p>
        <nav className="mt-4 grid gap-1.5">
          {roleNavigation[role].map((item) => {
            const active = pathname === item.href || (item.href !== ROLE_ROUTES[role] && pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-[13px] font-bold transition ${
                  active
                    ? "bg-ev-yellow text-ev-green shadow-[2px_2px_0_rgba(255,210,31,0.35)]"
                    : "text-white hover:bg-white/15"
                }`}
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-base ${
                    active ? "bg-ev-green/10 text-ev-green" : "bg-white/15 text-white"
                  }`}
                  aria-hidden="true"
                >
                  {icons[item.icon]}
                </span>
                <span className={active ? "text-ev-green" : "text-white"}>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/5 p-2">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ev-teal text-[11px] font-black text-ev-green">{initials}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[12px] font-bold text-white">{displayName}</span>
              <span className="block truncate text-[9px] text-white/45">{userEmail || ROLE_LABELS[role]}</span>
            </span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </>
  );

  return (
    <div className={`min-h-screen bg-[#F4F7FB] ${role === "child" ? "bg-[radial-gradient(circle_at_15%_15%,#FFF4B2_0,transparent_28%),radial-gradient(circle_at_90%_85%,#E8F8D7_0,transparent_24%)]" : ""}`}>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] flex-col bg-ev-green lg:flex">{sidebar}</aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button aria-label="Close portal menu" className="absolute inset-0 bg-ev-ink/60" onClick={() => setMobileOpen(false)} />
          <aside className="relative flex h-full w-[280px] flex-col bg-ev-green shadow-2xl">{sidebar}</aside>
        </div>
      ) : null}

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-ev-line bg-white/90 px-5 backdrop-blur md:px-8 lg:px-10">
          <div className="flex items-center gap-3">
            <button type="button" aria-label="Open portal menu" onClick={() => setMobileOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-ev-line lg:hidden">☰</button>
            <div>
              <p className="text-[11px] font-semibold text-ev-muted">{new Intl.DateTimeFormat("en-NG", { weekday: "long", month: "long", day: "numeric" }).format(new Date())}</p>
              <p className="hidden text-[10px] text-ev-muted sm:block">Learning in motion, one lesson at a time.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" className="hidden rounded-xl border border-ev-line px-4 py-2 text-[11px] font-bold text-ev-green hover:bg-ev-board sm:block">View website</Link>
            <Link href="/portal/notifications" aria-label="Notifications" className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ev-board text-ev-green">
              ♢<span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-ev-teal" />
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-[1440px] p-5 md:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
