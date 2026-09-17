export const SITE_URL = "https://eduvibehub.com.ng";
export const SITE_NAME = "EduVibe Hub";

export const defaultSeoDescription =
  "EduVibe Hub provides personalised online tutoring in Nigeria for children, with Maths, English, Science, exam preparation, homework support, and clear parent updates.";

export const publicRoutes = [
  {
    path: "/",
    priority: 1,
    changeFrequency: "weekly",
  },
  {
    path: "/subjects",
    priority: 0.9,
    changeFrequency: "weekly",
  },
  {
    path: "/how-it-works",
    priority: 0.85,
    changeFrequency: "monthly",
  },
  {
    path: "/about",
    priority: 0.8,
    changeFrequency: "monthly",
  },
  {
    path: "/store",
    priority: 0.7,
    changeFrequency: "weekly",
  },
  {
    path: "/safeguarding",
    priority: 0.45,
    changeFrequency: "yearly",
  },
  {
    path: "/privacy",
    priority: 0.25,
    changeFrequency: "yearly",
  },
  {
    path: "/terms",
    priority: 0.25,
    changeFrequency: "yearly",
  },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, SITE_URL).toString();
}
