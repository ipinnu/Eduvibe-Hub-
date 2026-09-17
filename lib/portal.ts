export type PortalRole = "tutor_admin" | "partner_tutor" | "parent" | "child";

export const ROLE_LABELS: Record<PortalRole, string> = {
  tutor_admin: "Tutor admin",
  partner_tutor: "Partner tutor",
  parent: "Parent",
  child: "Student",
};

export const ROLE_ROUTES: Record<PortalRole, string> = {
  tutor_admin: "/portal/admin",
  partner_tutor: "/portal/tutor",
  parent: "/portal/parent",
  child: "/portal/student",
};

export const ROLE_PEOPLE: Record<PortalRole, { name: string; greeting: string; initials: string }> = {
  tutor_admin: { name: "Peace", greeting: "Here’s what needs your attention today.", initials: "PE" },
  partner_tutor: { name: "Tomi", greeting: "Your learners are ready for another good day.", initials: "TO" },
  parent: { name: "Mrs Yusuf", greeting: "Here’s how Amina is progressing this week.", initials: "MY" },
  child: { name: "Amina", greeting: "Ready to learn something brilliant today?", initials: "AY" },
};
