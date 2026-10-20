import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BatteryCharging, ChevronRight, Factory, FlaskConical, Wrench } from "lucide-react";
import { StructuredData } from "@/components/StructuredData";
import { solutions } from "@/data/site";
import { applicationExamples } from "@/data/applications";
import { solutionLinks } from "@/data/solution-links";
import { resources } from "@/lib/resources/catalog";
import { buildApplicationIndexStructuredData } from "@/lib/seo/application-structured-data";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

export const metadata: Metadata = buildPageMetadata({
  title: "EV Charger Testing Solutions for Labs & Field Teams",
  description: "Match APEX EV charger test systems to development, production verification, laboratory validation and field commissioning. Explore equipment by workflow.",
  path: "/solutions",
});

const workflows = [
  { label: "Laboratory validation", solutionSlug: "ev-charger-manufacturing-testing", applicationSlug: "integrated-ev-charger-validation-laboratory", icon: FlaskConical },
  { label: "Field commissioning", solutionSlug: "charger-operations-maintenance", applicationSlug: "mobile-ev-charger-commissioning-workflow", icon: Wrench },
  { label: "Production testing", solutionSlug: "production-line-testing-and-aging", applicationSlug: "evse-production-end-of-line-architecture", icon: Factory },
  { label: "Energy integration", solutionSlug: "pv-storage-charging-testing", applicationSlug: "pv-storage-ev-charging-test-architecture", icon: BatteryCharging },
];

export default function SolutionsPage() {
  return (
    <>
      <StructuredData data={buildApplicationIndexStructuredData(applicationExamples, siteUrl)} />
      <section className="border-b border-slate-200 bg-white px-5 pb-6 pt-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#526b7d]">
            <Link href="/" className="hover:text-[#1268a8]">Home</Link>
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
            <span aria-current="page">Solutions</span>
          </nav>
          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div className="max-w-3xl">
              <h1 className="text-2xl font-black leading-tight text-[#12263a] md:text-3xl">EV charger testing solutions</h1>
              <p className="mt-3 leading-7 text-[#526b7d]">Match your laboratory, field, production or energy-system workflow to a reference architecture and the equipment it needs.</p>
            </div>
            <Link href="/contact#inquiry-form" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline">
              Discuss your test scope <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
          <nav aria-label="Testing workflows" className="mt-6 grid grid-cols-2 gap-x-5 gap-y-1 sm:grid-cols-4 sm:gap-x-6">
            {workflows.map(({ label, solutionSlug, icon: Icon }) => (
              <Link key={solutionSlug} href={`#${solutionSlug}`} className="group flex min-h-14 min-w-0 items-center gap-2.5 border-b-2 border-slate-200 py-2 text-sm font-bold leading-5 text-[#385064] transition-colors hover:border-[#1479c9] hover:text-[#1268a8]">
                <Icon aria-hidden="true" className="h-5 w-5 shrink-0 text-[#1268a8]" />
                <span className="min-w-0">{label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section id="application-architectures" aria-label="Application architectures" className="scroll-mt-24 bg-white px-5 lg:px-8">
        <div className="mx-auto max-w-7xl divide-y divide-slate-200">
          {workflows.map((workflow, index) => {
            const solution = solutions.find((item) => item.slug === workflow.solutionSlug);
            const application = applicationExamples.find((item) => item.slug === workflow.applicationSlug);
            if (!solution || !application) return null;
            const links = solutionLinks[solution.slug];
            const guides = links.resourceSlugs.map((slug) => resources.find((resource) => resource.slug === slug)).filter((resource) => resource !== undefined);

            return (
              <article id={solution.slug} key={solution.slug} className="grid scroll-mt-24 gap-6 py-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.4fr)] lg:gap-10 lg:py-10">
                <div className="min-w-0">
                  <Link href={`/applications/${application.slug}`} aria-label={`View ${application.title}`} className="relative block aspect-[16/10] overflow-hidden bg-[#f6f8fa]">
                    <Image src={application.image} alt={application.imageAlt} fill preload={index === 0} sizes="(min-width: 1280px) 455px, (min-width: 1024px) 38vw, 100vw" className="object-contain p-3 sm:p-5" />
                  </Link>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase leading-5 text-[#1268a8]">{String(index + 1).padStart(2, "0")} / {workflow.label}</p>
                  <h2 className="mt-2 text-2xl font-black leading-tight text-[#12263a]">{solution.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[#526b7d]">{application.description}</p>

                  <dl className="mt-5 grid gap-4 border-y border-slate-200 py-4 sm:grid-cols-2 sm:gap-6">
                    <div className="min-w-0"><dt className="text-xs font-bold uppercase text-[#385064]">Confirm the scope</dt><dd className="mt-1.5 text-sm leading-6 text-[#526b7d]">{application.confirmBeforeProject[0]}</dd></div>
                    <div className="min-w-0"><dt className="text-xs font-bold uppercase text-[#385064]">Engineering objective</dt><dd className="mt-1.5 text-sm leading-6 text-[#526b7d]">{application.objectives[0]}</dd></div>
                  </dl>

                  <div className="mt-4 min-w-0">
                    <h3 className="text-xs font-bold uppercase text-[#385064]">Planning guides</h3>
                    <ul className="mt-1 grid gap-1 sm:grid-cols-2 sm:gap-x-6">
                      {guides.slice(0, 2).map((guide) => <li key={guide.slug}><Link href={`/resources/${guide.slug}`} className="inline-flex min-h-11 items-center py-2 text-sm leading-6 text-[#1268a8] hover:underline">{guide.title}</Link></li>)}
                    </ul>
                  </div>
                  <Link href={`/applications/${application.slug}`} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] underline underline-offset-4">View architecture<ArrowRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f3f6f8] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-6">
          <div className="max-w-3xl">
            <h2 className="text-xl font-bold text-[#12263a]">Define the configuration before the test</h2>
            <p className="mt-2 text-sm leading-6 text-[#526b7d]">These reference architectures are planning materials, not named customer deliveries or certification claims. Final equipment, ratings and evidence depend on the charger, facility and agreed test plan.</p>
          </div>
          <Link href="/contact#inquiry-form" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f5f9f]">Discuss a configuration<ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
        </div>
      </section>
    </>
  );
}
