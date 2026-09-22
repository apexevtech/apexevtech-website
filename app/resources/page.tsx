import type { Metadata } from "next";
import { ResourceCard } from "@/components/ResourceCard";
import { resources } from "@/lib/resources/catalog";
import { resourceGroups } from "@/lib/resources/groups";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { buildResourceIndexStructuredData } from "@/lib/seo/resource-index-structured-data";
import { siteUrl } from "@/lib/seo/site-urls";
import Link from "next/link";
import { interfaceTopics } from "@/data/interface-topics";

export const metadata: Metadata = buildPageMetadata({ title: "EV Charger Testing Guides: CCS2, GB/T, NACS & EVSE", description: "Technical guides for EV charger conformance, protocol, production-line and post-installation testing across CCS2, GB/T, NACS and Type 2 interfaces.", path: "/resources" });

export default function ResourcesPage() {
  const itemListData = buildResourceIndexStructuredData(resources, siteUrl);
  return <>
    <StructuredData data={itemListData} />
    <PageHero eyebrow="Resources" title="EV charger testing guides for laboratory, production and field work." description="Plan CCS2, GB/T, NACS and Type 2 tests, compare equipment and define the evidence needed for conformance, end-of-line and post-installation checks." />
    <section className="border-b border-slate-200 bg-white px-5 py-10 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="text-2xl font-black text-[#12263a]">Browse by charging interface</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{interfaceTopics.map((topic) => <Link key={topic.slug} href={`/interfaces/${topic.slug}`} className="rounded-md border border-slate-200 p-5 hover:border-[#1479c9]"><span className="text-lg font-black text-[#1268a8]">{topic.name} →</span><span className="mt-2 block text-sm leading-6 text-[#526b7d]">{topic.description}</span></Link>)}</div></div></section>
    <nav aria-labelledby="resource-topics-heading" className="border-b border-slate-200 bg-[#f3f8fa] px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 id="resource-topics-heading" className="text-2xl font-black text-[#12263a]">Browse by testing goal</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {resourceGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="group rounded-md border border-slate-200 bg-white p-5 transition hover:border-[#1479c9] hover:shadow-sm"><span className="text-xs font-black uppercase tracking-wide text-[#1268a8]">{group.eyebrow}</span><span className="mt-2 block font-black leading-6 text-[#12263a] group-hover:text-[#1268a8]">{group.title}</span><span className="mt-3 block text-sm text-[#526b7d]">{group.resources.length} guides →</span></a>)}
        </div>
      </div>
    </nav>
    <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      {resourceGroups.map((group, index) => <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className={`${index ? "mt-16 border-t border-slate-200 pt-14" : ""} scroll-mt-28`}>
        <p className="text-sm font-black uppercase tracking-wide text-[#1268a8]">{group.eyebrow}</p>
        <div className="mt-2 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:items-end">
          <h2 id={`${group.id}-heading`} className="text-3xl font-black leading-tight text-[#12263a]">{group.title}</h2>
          <p className="leading-7 text-[#526b7d]">{group.description}</p>
        </div>
        <div className="mt-7 grid gap-x-12 md:grid-cols-2">{group.resources.map((resource) => <ResourceCard key={resource.slug} resource={resource} headingLevel="h3" />)}</div>
      </section>)}
    </div>
  </>;
}
