import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { caseStudies, solutions } from "@/data/site";

export const metadata: Metadata = {
  title: "Solutions",
  description: "APEX EV charger manufacturing, certification laboratory, charger commissioning and field maintenance test solutions.",
  alternates: { canonical: "/solutions" },
};

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
                  src="/assets/products/evse-field-commissioning.png"
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
                  src="/assets/products/图片5.png"
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
              <article key={solution.slug} className="rounded-md border border-slate-200 bg-white p-7">
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
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-[#f8fafc] px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Engineering Cases"
            title="Representative projects from laboratory, factory and field operations"
          />
          <div className="grid gap-8 md:grid-cols-2">
            {caseStudies.map((study) => (
              <article key={study.slug} className="overflow-hidden rounded-md border border-slate-200 bg-white transition hover:border-[#9edbe5]">
                <div className={`relative aspect-[16/9] overflow-hidden ${study.slug === "charger-production-aging-line" ? "bg-white" : "bg-slate-100"}`}>
                  <Image
                    src={study.image}
                    alt={study.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className={study.slug === "charger-production-aging-line" ? "object-contain p-3" : "object-cover"}
                  />
                </div>
                <div className="p-6">
                  <p className="text-xs font-black uppercase text-[#1479c9]">{study.category}</p>
                  <h2 className="mt-2 text-2xl font-black text-[#12263a]">{study.title}</h2>
                  <p className="mt-3 leading-7 text-[#526b7d]">{study.summary}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {study.tags.map((tag) => (
                      <span key={tag} className="rounded bg-[#e7f0f5] px-2.5 py-1 text-xs font-semibold text-[#385064]">{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
