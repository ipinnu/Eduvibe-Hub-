import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, JetBrains_Mono } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome";
import { StructuredData } from "@/components/seo/StructuredData";
import { ContactModalProvider } from "@/components/ui/ContactModal";
import { SITE_NAME, SITE_URL, defaultSeoDescription } from "@/lib/seo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: SITE_NAME,
  icons: {
    icon: [{ url: "/Logo V2.png", type: "image/png" }],
    apple: "/Logo V2.png",
  },
  title: {
    default: "EduVibe Hub | Online Tutoring in Nigeria for Children",
    template: "%s | EduVibe Hub",
  },
  description: defaultSeoDescription,
  keywords: [
    "EduVibe Hub",
    "online tutoring in Nigeria",
    "tutoring in Nigeria",
    "online tutor Nigeria",
    "Maths tutor Nigeria",
    "English tutor Nigeria",
    "Science tutor Nigeria",
    "primary school tutor Nigeria",
    "exam preparation tutor",
    "homework support Nigeria",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "EduVibe Hub | Online Tutoring in Nigeria for Children",
    description: defaultSeoDescription,
    siteName: SITE_NAME,
    locale: "en_NG",
    images: [
      {
        url: "/peace-online-tutor-chic.webp",
        width: 1024,
        height: 1024,
        alt: "EduVibe Hub online tutoring in Nigeria",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduVibe Hub | Online Tutoring in Nigeria for Children",
    description: defaultSeoDescription,
    images: ["/peace-online-tutor-chic.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ev-cream text-ev-ink">
        <StructuredData />
        <ContactModalProvider>
          <SiteChrome>{children}</SiteChrome>
        </ContactModalProvider>
      </body>
    </html>
  );
}
