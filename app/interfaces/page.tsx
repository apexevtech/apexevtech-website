import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { interfaceTopics } from "@/data/interface-topics";
import { buildInterfaceIndexStructuredData } from "@/lib/seo/interface-structured-data";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

export const metadata: Metadata = buildPageMetadata({ title: "EV Charger Test Interfaces: CCS2, GB/T, NACS & Type 2", description: "Compare EV charger test equipment and workflows by CCS2, GB/T, NACS and Type 2 interface, protocol scope and validation environment.", path: "/interfaces" });

export default function InterfacesPage() {
  return <>
    <StructuredData data={buildInterfaceIndexStructuredData(interfaceTopics, siteUrl)} />
    <PageHero eyebrow="Interface Guides" title="Select EV charger test equipment by interface and workflow." description="Start with the physical connection, protocol edition, electrical range and test environment before comparing equipment." />
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><div className="grid gap-6 md:grid-cols-2">{interfaceTopics.map((topic) => <article key={topic.slug} className="rounded-md border border-slate-200 bg-white p-7 hover:border-[#1479c9]"><p className="text-sm font-black uppercase tracking-wide text-[#1268a8]">{topic.name}</p><h2 className="mt-2 text-2xl font-black text-[#12263a]"><Link href={`/interfaces/${topic.slug}`} className="hover:text-[#1268a8]">{topic.title}</Link></h2><p className="mt-3 leading-7 text-[#526b7d]">{topic.description}</p><div className="mt-5 flex flex-wrap gap-2">{topic.scope.slice(0, 3).map((item) => <span key={item} className="rounded bg-[#e7f0f5] px-2.5 py-1 text-xs font-semibold text-[#385064]">{item}</span>)}</div><Link href={`/interfaces/${topic.slug}`} className="mt-6 inline-flex text-sm font-black text-[#1268a8]">Compare equipment and workflow →</Link></article>)}</div></section>
  </>;
}
