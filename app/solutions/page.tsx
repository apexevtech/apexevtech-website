import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { solutions, products } from "@/data/site";
import { applicationExamples } from "@/data/applications";
import { ApplicationCard } from "@/components/ApplicationCard";
import { solutionLinks } from "@/data/solution-links";
import { resources } from "@/lib/resources/catalog";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "EV Charger Testing Solutions for Labs & Field Teams",
  description: "Match APEX EV charger test systems to development, production verification, laboratory validation and field commissioning. Explore equipment by workflow.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Solutions"
        title="EV charger test solutions for every validation workflow."
        description="APEX helps charger manufacturers, certification laboratories, testing institutions and field service teams build repeatable test workflows."
      />
      <section className="bg-white px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Applications" title="Testing systems built for field and laboratory workflows" />
          <div className="grid gap-8 lg:grid-cols-2">
            <article>
              <div className="group relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100 shadow-lg shadow-slate-900/10">
                <Image
                  src="/assets/products/evse-field-commissioning.webp"
                  alt="Engineers conducting an EV charger system field test"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover contrast-[1.04] saturate-[1.08] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">On-site Charger Commissioning</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Portable test systems support charger commissioning, interoperability checks, fault diagnosis and metering verification directly at the charging site.
              </p>
            </article>
            <article>
              <div className="group relative aspect-[16/9] overflow-hidden rounded-lg bg-slate-100 shadow-lg shadow-slate-900/10">
                <Image
                  src="/assets/products/ev-charger-test-laboratory.webp"
                  alt="EV charger interface and waveform testing laboratory"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover contrast-[1.03] saturate-[1.05] transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
              <h2 className="mt-5 text-2xl font-black text-slate-950">Protocol &amp; Waveform Analysis</h2>
              <p className="mt-3 leading-7 text-slate-600">
                Laboratory instrumentation captures charging signals, protocol messages and electrical waveforms for compliance investigation and engineering validation.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Solution Portfolio" title="Solutions derived from real charger testing workflows" />
          <div className="grid gap-6 md:grid-cols-2">
            {solutions.map((solution) => (
              <article id={solution.slug} key={solution.slug} className="scroll-mt-28 rounded-md border border-slate-200 bg-white p-7">
                <h2 className="text-2xl font-black text-slate-950">{solution.title}</h2>
                <p className="mt-3 leading-7 text-slate-600">{solution.overview}</p>
                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div>
                    <p className="font-black text-apex-blue">Benefits</p>
                    <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                      {solution.benefits.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-black text-apex-blue">Equipment Used</p>
                    <ul className="mt-3 grid gap-2 text-sm text-slate-600">
                      {solution.equipment.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-6 border-l-4 border-[#00a6c7] bg-[#f3f8fa] p-4 text-sm font-semibold text-slate-700">{solution.value}</p>
                <div className="mt-6 border-t border-slate-200 pt-5">
                  <h3 className="font-black text-[#12263a]">Compare equipment configurations</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">Review the interface and options for your project.</p>
                  <ul className="mt-3 grid gap-3 text-sm">
                    {products.filter((product) => solutionLinks[solution.slug]?.productSlugs.includes(product.slug)).map((product) => (
                      <li key={product.slug}><Link href={`/products/${product.slug}`} className="font-bold text-[#1268a8] hover:underline">{product.model}: {product.title} →</Link></li>
                    ))}
                  </ul>
                  <h3 className="mt-5 font-black text-[#12263a]">Plan the test workflow</h3>
                  <ul className="mt-3 grid gap-3 text-sm">
                    {resources.filter((resource) => solutionLinks[solution.slug]?.resourceSlugs.includes(resource.slug)).map((resource) => (
                      <li key={resource.slug}><Link href={`/resources/${resource.slug}`} className="font-bold text-[#1268a8] hover:underline">{resource.title} →</Link></li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f8fafc] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Application Architectures"
            title="Reference configurations for laboratory, factory and field operations"
            description="Use these examples to prepare a project scope. Final equipment, ratings and evidence depend on the actual charger and test plan."
          />
          <div className="grid gap-8 md:grid-cols-2">
            {applicationExamples.map((application) => <ApplicationCard key={application.slug} application={application} headingLevel="h3" />)}
          </div>
          <div className="mt-8 text-center"><Link href="/applications" className="inline-flex rounded-md border border-[#1479c9] px-5 py-3 text-sm font-black text-[#1268a8] hover:bg-[#1479c9] hover:text-white">View all application architectures</Link></div>
        </div>
      </section>
    </>
  );
}
