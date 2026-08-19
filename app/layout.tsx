import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.apexpowersystems.com"),
  title: {
    default: "EV Charging Test & Validation Solutions",
    template: "%s | APEX",
  },
  description:
    "Professional EV charger testing equipment, EVSE analyzers, charging simulators, and compliance validation systems for manufacturers, laboratories, and EV infrastructure companies worldwide.",
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
    images: ["/assets/hero/test-lab-systems.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
