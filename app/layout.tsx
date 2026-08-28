import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { CookieConsent } from "@/components/CookieConsent";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { buildStructuredData } from "@/lib/seo/structured-data";
import { AttributionCapture } from "@/components/AttributionCapture";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.link-jl.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: "/assets/apex-logo.jpg",
  },
  title: {
    default: "EV Charging Test & Validation Solutions",
    template: "%s | APEX",
  },
  description:
    "Professional EV charger testing equipment, EVSE analyzers, charging simulators, and compliance validation systems for manufacturers, laboratories, and EV infrastructure companies worldwide.",
  alternates: {
    canonical: "/",
  },
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  keywords: [
    "EV charger testing equipment",
    "EVSE testing solutions",
    "charging infrastructure test systems",
    "DC charger tester",
    "AC charger tester",
    "regenerative DC load",
  ],
  openGraph: {
    title: "EV Charging Test & Validation Solutions",
    description:
      "Professional EV charger testing equipment, EVSE analyzers, charging simulators, and compliance validation systems for manufacturers, laboratories, and EV infrastructure companies worldwide.",
    url: siteUrl,
    images: ["/assets/hero/test-lab-systems.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = buildStructuredData(siteUrl);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <Header />
        <AttributionCapture />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <CookieConsent />
      </body>
    </html>
  );
}
