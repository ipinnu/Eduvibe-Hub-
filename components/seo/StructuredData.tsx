import { SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "EducationalOrganization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      alternateName: ["EduVibeHub", "EduVibe Hub Nigeria"],
      url: SITE_URL,
      logo: absoluteUrl("/Logo%20V2.png"),
      image: absoluteUrl("/peace-online-tutor-chic.webp"),
      areaServed: [
        {
          "@type": "Country",
          name: "Nigeria",
        },
        {
          "@type": "Place",
          name: "Online tutoring",
        },
      ],
      description:
        "Personalised online tutoring in Nigeria for children, including Maths, English, Science, homework support, exam preparation, and parent progress updates.",
      knowsAbout: [
        "Online tutoring in Nigeria",
        "Maths tutoring",
        "English tutoring",
        "Science tutoring",
        "Primary school tutoring",
        "SAT Mathematics preparation",
        "Homework support",
        "Exam preparation",
      ],
      sameAs: [SITE_URL],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: {
        "@id": `${SITE_URL}/#organization`,
      },
      inLanguage: "en-NG",
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#online-tutoring-service`,
      name: "Online tutoring in Nigeria",
      provider: {
        "@id": `${SITE_URL}/#organization`,
      },
      serviceType: "Online tutoring",
      areaServed: {
        "@type": "Country",
        name: "Nigeria",
      },
      audience: {
        "@type": "Audience",
        audienceType: "Parents looking for online tutoring for children",
      },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        category: "Tutoring",
        url: SITE_URL,
      },
    },
  ],
};

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
      }}
    />
  );
}
