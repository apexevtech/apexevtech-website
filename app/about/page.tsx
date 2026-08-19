import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { company } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `Company overview for ${company.name}, provider of APEX EV charging test solutions.`,
};

const advantages = [
  "Experienced Engineering Team",
  "Industrial Testing Expertise",
  "Custom Test Solutions",
  "Global Customer Service",
];

const supportedProtocols = [
  "GB/T 20234.1-2023",
  "GB/T 20234.2-2015",
  "GB/T 20234.3-2023",
  "GB/T 20234.4-2023",
  "IEC 62196-1",
  "IEC 62196-2",
  "IEC 62196-3",
  "GB/T 18487.1-2023",
  "GB/T 18487.5-2024",
  "GB/T 27930-2023",
  "GB/T 27930.2-2024",
  "DIN 70121",
  "ISO 15118-2",
  "ISO 15118-20",
  "SAE J1772",
  "GB/T 34658-2025",
  "GB/T 34657.1-2025",
  "JJG 1192-2023",
  "NB/T 11867-2025",
  "NB/T 11864-2025",
  "NB/T 33008.1-2018",
  "GB 39752-2024",
  "GB 44263-2024",
  "GB 46519-2025",
  "CHAdeMO",
  "NACS",
  "MCS",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Us"
        title={company.name}
        description="APEX is focused on EV charger testing equipment, charging pile validation systems and EVSE test solutions for global B2B customers."
      />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Company Overview" title="Technology-focused partner for EV charger testing." />
            <p className="leading-8 text-slate-600">
              We support EV charger manufacturers, certification laboratories, charging pile testing institutions, charging station operators and field service teams with professional test systems for AC/DC chargers, EVSE interfaces and V2G-related charging equipment.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              <div className="rounded-lg bg-slate-950 p-6 text-white">
                <p className="text-sm font-extrabold text-sky-300">Mission</p>
                <p className="mt-3 font-bold">Make EV charger testing more reliable, repeatable and field-ready.</p>
              </div>
              <div className="rounded-lg bg-apex-blue p-6 text-white">
                <p className="text-sm font-extrabold text-blue-100">Vision</p>
                <p className="mt-3 font-bold">Become a trusted global provider of EV charging test solutions.</p>
              </div>
            </div>
          </div>
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg bg-[#f8fafc]">
            <Image
              src="/assets/products/AST-9000x-fitted.png"
              alt="AST-9000X EV charger testing system"
              fill
              priority
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-contain"
            />
          </div>
        </div>
      </section>
      <section className="bg-slate-50 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Factory & Laboratory" title="Built around industrial production and validation workflows." />
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-white p-7">
              <h3 className="text-2xl font-black text-slate-950">Factory Introduction</h3>
              <p className="mt-4 leading-7 text-slate-600">
                APEX products are developed for production environments where repeatability, rugged design and clear test records matter.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-7">
              <h3 className="text-2xl font-black text-slate-950">Laboratory Introduction</h3>
              <p className="mt-4 leading-7 text-slate-600">
                Our solutions support certification preparation, standards testing, protocol diagnostics and charging system analysis.
              </p>
            </div>
          </div>
          <div className="mt-10 rounded-lg border border-slate-200 bg-white p-7">
            <h3 className="text-2xl font-black text-slate-950">Supported Standards &amp; Protocols</h3>
            <p className="mt-3 max-w-4xl leading-7 text-slate-600">
              Our laboratory and field systems can be configured for the following charging interfaces, communication protocols, metering requirements and safety standards.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {supportedProtocols.map((protocol) => (
                <span key={protocol} className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
                  {protocol}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {advantages.map((item) => (
              <div key={item} className="rounded-lg border border-slate-200 bg-white p-6 font-black text-slate-900">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
