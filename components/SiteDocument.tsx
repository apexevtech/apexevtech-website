import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CookieConsent } from "@/components/CookieConsent";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StructuredData } from "@/components/StructuredData";
import { siteUrl } from "@/lib/seo/site-urls";
import { buildStructuredData } from "@/lib/seo/structured-data";
import { AttributionCapture } from "@/components/AttributionCapture";
import { LanguageProvider, T } from "@/components/LanguageProvider";
import Link from "@/components/LocaleLink";
import type { Language } from "@/lib/i18n/preference";

export const baseSiteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: { icon: "/assets/apex-logo.webp" },
  title: {
    default: "EV Charger Test Equipment & EVSE Testing Solutions",
    template: "%s | APEX",
  },
  description: "Professional EV charger testing equipment, EVSE analyzers, charging simulators, and compliance validation systems for manufacturers, laboratories, and EV infrastructure companies worldwide.",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION ? { google: process.env.GOOGLE_SITE_VERIFICATION } : undefined,
  keywords: ["EV charger testing equipment", "EVSE testing solutions", "charging infrastructure test systems", "DC charger tester", "AC charger tester", "regenerative DC load"],
  openGraph: {
    title: "EV Charger Test Equipment & EVSE Testing Solutions | APEX",
    type: "website",
    description: "Professional EV charger testing equipment, EVSE analyzers, charging simulators, and compliance validation systems for manufacturers, laboratories, and EV infrastructure companies worldwide.",
    url: siteUrl,
    images: ["/assets/social/home.png"],
  },
};

export default async function SiteDocument({ children, language }: { children: ReactNode; language: Language }) {
  const initialMessages = language === "zh" ? (await import("@/lib/i18n/zh")).messages : undefined;
  return (
    <html lang={language === "zh" ? "zh-CN" : "en"} data-scroll-behavior="smooth">
      <body className="font-sans antialiased">
        <LanguageProvider initialLanguage={language} initialMessages={initialMessages}>
          <StructuredData data={buildStructuredData(siteUrl)} />
          <Link href="#main-content" prefetch={false} className="skip-link"><T>Skip to main content</T></Link>
          <Header />
          <AttributionCapture />
          <main id="main-content" tabIndex={-1}>{children}</main>
          <Footer />
          <WhatsAppButton />
          <CookieConsent />
        </LanguageProvider>
      </body>
    </html>
  );
}
