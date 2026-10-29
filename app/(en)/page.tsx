import { T } from "@/components/LanguageProvider";
import Image from "next/image";
import Link from "@/components/LocaleLink";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { interfaceTopics } from "@/data/interface-topics";
import { products } from "@/data/site";
import { resources } from "@/lib/resources/catalog";

import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata = {
  ...buildPageMetadata({
  title: "APEX EV Charger Test Lab Equipment & AC/DC EVSE Systems",
  description: "Configure APEX AC/DC EV charger test systems for laboratories, production and field commissioning. Compare connectors, protocols, ratings and load options.",
  path: "/",
  image: "/assets/social/home.png",
  }),
  title: { absolute: "APEX EV Charger Test Lab Equipment & AC/DC EVSE Systems" },
};

const capabilities = [
  {
    index: "01",
    title: "Multi-standard validation",
    description: "Configure AC and DC test coverage for GB/T, IEC, SAE J1772, NACS and other target-market requirements.",
  },
  {
    index: "02",
    title: "Protocol and signal analysis",
    description: "Capture charging messages, control-pilot signals and electrical waveforms for repeatable engineering diagnosis.",
  },
  {
    index: "03",
    title: "Metering and safety tests",
    description: "Verify energy measurement, insulation monitoring, fault response and protection behavior in controlled conditions.",
  },
  {
    index: "04",
    title: "Laboratory and field systems",
    description: "Select integrated laboratory platforms or portable equipment for commissioning, maintenance and site acceptance.",
  },
];

const process = [
  ["01", "Define the test scope", "Share the charger type, target market, interfaces, voltage and current range, and required test standards."],
  ["02", "Configure the system", "Our engineers match the tester, metering, communication, load and software options to your workflow."],
  ["03", "Validate and commission", "The configured system is checked before delivery, followed by documentation, onboarding and technical support."],
];

const testingPaths = [
  { title: "DC charger testing", description: "Compare DC testers, BMS simulation and load options.", href: "/products?type=dc#equipment" },
  { title: "AC charger testing", description: "Explore pilot signals, metering and AC interfaces.", href: "/products?type=ac#equipment" },
  { title: "Laboratory validation", description: "Plan an integrated bench and repeatable test evidence.", href: "/applications/integrated-ev-charger-validation-laboratory" },
  { title: "Field commissioning", description: "Define portable testing for installation and maintenance.", href: "/applications/mobile-ev-charger-commissioning-workflow" },
];

const markets = ["EV charger manufacturers", "Certification laboratories", "Utilities and operators", "Field service teams"];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-6 sm:gap-8 sm:py-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10 lg:px-8 lg:py-12">
          <div className="max-w-2xl">
            <p className="text-sm font-black uppercase text-[#1268a8]"><T>{"APEX Power Systems · EVSE testing"}</T></p>
            <h1 className="home-title mt-4 text-4xl font-black leading-[1.08] text-[#12263a] md:text-5xl lg:text-[60px]"><T>{"EV charger test equipment for laboratory and field validation."}</T></h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#526b7d] sm:mt-6 sm:text-lg sm:leading-8"><T>{"Apex Power Systems (Nanjing) Co., Ltd. supplies AC and DC EVSE test systems for charger development, production verification and field commissioning. Match the equipment to your connector, electrical range and test workflow."}</T></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact#inquiry-form" className="inline-flex items-center rounded-md bg-[#1479c9] px-6 py-3.5 text-sm font-extrabold text-white transition-colors hover:bg-[#0f5f9f]"><T>{"Discuss your requirements "}</T><span className="ml-2" aria-hidden="true">→</span>
              </Link>
              <Link href="/products" className="inline-flex items-center rounded-md border border-slate-300 bg-white px-6 py-3.5 text-sm font-extrabold text-[#12263a] transition-colors hover:border-[#1479c9] hover:text-[#1268a8]"><T>{"Browse test systems"}</T></Link>
            </div>
            <dl className="mt-9 hidden grid-cols-3 gap-4 border-t border-slate-200 pt-6 sm:grid">
              {[["10+ years", "Test engineering"], ["AC and DC", "System coverage"], ["Global", "Project support"]].map(([value, label]) => (
                <div key={label}>
                  <dt className="text-lg font-black text-[#12263a] md:text-xl"><T>{value}</T></dt>
                  <dd className="mt-1 text-xs leading-5 text-[#526b7d] md:text-sm"><T>{label}</T></dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative h-[210px] overflow-hidden rounded-md bg-[#eaf1f5] sm:h-auto sm:aspect-[16/10] lg:aspect-[16/11]">
            <Image
              src="/assets/hero/test-lab-systems.webp"
              alt="APEX integrated EV charger test laboratory systems"
              fill
              fetchPriority="high"
              loading="eager"
              quality={60}
              sizes="(min-width: 1280px) 680px, (min-width: 1024px) 53vw, calc(100vw - 40px)"
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 border-t border-white/20 bg-[#102a43]/95 px-5 py-4 text-sm font-bold text-white"><T>{"Integrated laboratory platforms · Portable field testers · Regenerative loads"}</T></div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-[#f3f6f8]">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-3 px-5 py-5 text-sm font-bold text-[#385064] lg:px-8">
          <span className="text-[#1268a8]"><T>{"Built for"}</T></span>
          {markets.map((market) => <span key={market}><T>{market}</T></span>)}
        </div>
      </section>

      <section aria-labelledby="test-path-heading" className="bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <h2 id="test-path-heading" className="text-2xl font-black text-[#12263a]"><T>{"Find your testing starting point"}</T></h2>
            <p className="text-sm text-[#526b7d]"><T>{"Choose by charger type or test environment."}</T></p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {testingPaths.map((path) => (
              <Link key={path.title} href={path.href} className="group rounded-md border border-slate-200 bg-[#f7fafc] p-5 transition-colors hover:border-[#1479c9] hover:bg-[#edf6fc]">
                <span className="flex items-center justify-between gap-3 text-base font-extrabold text-[#12263a]">
                  <T>{path.title}</T><span aria-hidden="true" className="text-[#1268a8]">→</span>
                </span>
                <span className="mt-2 block text-sm leading-6 text-[#526b7d]"><T>{path.description}</T></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f3f6f8] px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <SectionHeading eyebrow="Product portfolio" title="Systems for laboratory, production and field validation" />
            <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3">
              <Link href="/solutions#application-architectures" className="border-b-2 border-[#1479c9] pb-1 text-sm font-extrabold text-[#1268a8] hover:text-[#0f5f9f]"><T>{"View solution architectures →"}</T></Link>
              <Link href="/products" className="border-b-2 border-[#1479c9] pb-1 text-sm font-extrabold text-[#1268a8] hover:text-[#0f5f9f]"><T>{"View all equipment →"}</T></Link>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 3).map((product) => <ProductCard key={product.slug} product={product} sizes="(min-width: 1280px) 350px, (min-width: 1024px) calc(33vw - 62px), (min-width: 768px) calc(50vw - 72px), calc(100vw - 82px)" />)}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Core capabilities"
            title="One test workflow from interface checks to recorded evidence"
            description="Build the system around your charger, market and validation objectives instead of adapting your process to a fixed test bench."
          />
          <div className="grid border-l border-t border-slate-200 md:grid-cols-2 lg:grid-cols-4">
            {capabilities.map((capability) => (
              <article key={capability.index} className="min-h-64 border-b border-r border-slate-200 bg-white p-6">
                <span className="text-sm font-black text-[#067187]"><T>{capability.index}</T></span>
                <h2 className="mt-8 text-xl font-black text-[#12263a]"><T>{capability.title}</T></h2>
                <p className="mt-3 text-sm leading-6 text-[#526b7d]"><T>{capability.description}</T></p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f3f6f8] px-5 py-14 lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Charging interfaces"
            title="Plan testing for the charger interface"
            description="Compare connector, communication, electrical and evidence requirements before selecting laboratory or field equipment."
          />
          <div className="mt-8 grid border-l border-t border-slate-300 sm:grid-cols-2 lg:grid-cols-3">
            {interfaceTopics.map((topic) => (
              <Link
                key={topic.slug}
                href={`/interfaces/${topic.slug}`}
                className="group min-h-40 border-b border-r border-slate-300 bg-white p-6 transition-colors hover:border-[#1479c9] hover:bg-[#f7fbfd]"
              >
                <span className="text-xs font-black uppercase tracking-wide text-[#067187]"><T>{topic.name}</T></span>
                <span className="mt-3 block text-lg font-black leading-6 text-[#12263a] group-hover:text-[#1268a8]"><T>{topic.title}</T></span>
                <span className="mt-4 inline-flex text-sm font-extrabold text-[#1268a8]"><T>{"View test workflow →"}</T></span>
              </Link>
            ))}
          </div>
          <Link href="/interfaces" className="mt-6 inline-flex rounded-md border border-[#1479c9] px-5 py-3 text-sm font-extrabold text-[#1268a8] hover:bg-white"><T>{"Compare all interface workflows"}</T></Link>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f3f6f8] px-5 py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Engineering Resources" title="Plan your charger validation workflow with practical guidance" description="Start with a clear test boundary, then connect the right equipment to your laboratory, production or field process." />
          <div className="mt-8 grid gap-x-8 md:grid-cols-3">
            {resources.filter((resource) => ["choose-ev-charger-test-system", "ev-charging-protocol-testing", "post-installation-evse-testing"].includes(resource.slug)).map((resource) => <article key={resource.slug} className="border-t border-slate-300 py-5"><h2 className="font-black text-[#12263a]"><Link href={`/resources/${resource.slug}`} className="hover:text-[#1268a8]"><T>{resource.title}</T></Link></h2><p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{resource.description}</T></p></article>)}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/project-cases?section=resources" className="inline-flex rounded-md border border-[#1479c9] px-5 py-3 text-sm font-extrabold text-[#1268a8]"><T>{"View all resources"}</T></Link>
            <Link href="/resources/ev-charger-testing-guide" className="text-sm font-extrabold text-[#1268a8] hover:text-[#0f5f9f]"><T>{"EV charger testing guide →"}</T></Link>
            <Link href="/resources/dc-fast-charger-testing-guide" className="text-sm font-extrabold text-[#1268a8] hover:text-[#0f5f9f]"><T>{"DC fast charger testing guide →"}</T></Link>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-16 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
          <SectionHeading
            eyebrow="Project process"
            title="Engineering support from requirement review to commissioning"
            description="A clear technical handoff reduces configuration risk and gives procurement teams a defined scope for evaluation."
          />
          <ol className="border-t border-slate-200">
            {process.map(([number, title, description]) => (
              <li key={number} className="grid gap-3 border-b border-slate-200 py-6 sm:grid-cols-[52px_180px_1fr] sm:items-start">
                <span className="font-black text-[#067187]">{number}</span>
                <h2 className="font-black text-[#12263a]"><T>{title}</T></h2>
                <p className="text-sm leading-6 text-[#526b7d]"><T>{description}</T></p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#102a43] px-5 py-12 text-white lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#7de3ef]"><T>{"Start a technical discussion"}</T></p>
            <h2 className="mt-2 text-2xl font-black md:text-3xl"><T>{"Tell us what your charging equipment needs to prove."}</T></h2>
          </div>
          <Link href="/contact#inquiry-form" className="inline-flex shrink-0 self-start rounded-md bg-white px-6 py-3.5 text-sm font-extrabold text-[#102a43] hover:bg-[#e8f7fa]"><T>{"Request a system recommendation"}</T></Link>
        </div>
      </section>
    </>
  );
}
