import type { Metadata } from "next";
import { ResourceBrowser } from "@/components/ResourceBrowser";
import { searchParamsFromRecord } from "@/lib/navigation/pagination";
import { parseResourceBrowserFilters } from "@/lib/resources/browser";
import { resourceGroups } from "@/lib/resources/groups";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import Link from "next/link";
import { interfaceTopics } from "@/data/interface-topics";
import { getCatalogMetadataState, resourceIndexTitle } from "@/lib/seo/catalog-metadata";

type ResourcesPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const description = "Technical guides for EV charger test equipment, DC fast chargers, AC EVSE, CCS2, GB/T, NACS, production and commissioning workflows.";

export async function generateMetadata({ searchParams }: ResourcesPageProps): Promise<Metadata> {
  const filters = parseResourceBrowserFilters(searchParamsFromRecord(await searchParams));
  const hasFilters = filters.type !== "all" || filters.category !== "all" || Boolean(filters.query);
  return buildPageMetadata({ ...getCatalogMetadataState("/resources", resourceIndexTitle, filters.page, hasFilters), description, image: "/assets/social/resources.png" });
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const filters = parseResourceBrowserFilters(searchParamsFromRecord(await searchParams));
  return <>
    <section className="border-b border-slate-200 bg-white px-5 pb-6 pt-7 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold text-[#1268a8]"><Link href="/" className="hover:underline">Home</Link><span className="mx-2 text-slate-400">/</span>Resources</p>
        <h1 className="mt-4 text-2xl font-black leading-tight text-[#12263a] sm:text-4xl">EV charger testing resources</h1>
        <p className="mt-3 max-w-3xl leading-7 text-[#526b7d]">APEX testing guides and cited SAITER solution materials.</p>
        <details className="mt-4 border-t border-slate-200 pt-2 sm:hidden"><summary className="min-h-11 cursor-pointer py-2.5 text-sm font-bold text-[#1268a8]">Charging interfaces</summary><nav aria-label="Charging interfaces" className="flex flex-wrap gap-x-5 gap-y-1">{interfaceTopics.map((topic) => <Link key={topic.slug} href={`/interfaces/${topic.slug}`} className="inline-flex min-h-11 items-center text-sm font-bold text-[#1268a8] underline underline-offset-4">{topic.name}</Link>)}</nav></details>
        <nav aria-label="Charging interfaces" className="mt-5 hidden flex-wrap items-center gap-x-5 gap-y-2 border-t border-slate-200 pt-3 sm:flex">
          <span className="text-xs font-bold uppercase text-[#526b7d]">Interfaces</span>
          {interfaceTopics.map((topic) => <Link key={topic.slug} href={`/interfaces/${topic.slug}`} className="inline-flex min-h-11 items-center text-sm font-bold text-[#1268a8] underline underline-offset-4">{topic.name}</Link>)}
        </nav>
      </div>
    </section>

    <ResourceBrowser initialFilters={filters} />

    <section className="border-t border-slate-200 bg-[#f3f8fa] px-5 py-10 lg:px-8" aria-labelledby="guide-directory-heading">
      <div className="mx-auto max-w-7xl">
        <h2 id="guide-directory-heading" className="text-xl font-black text-[#12263a]">APEX guide directory</h2>
        <nav aria-label="Guide topics" className="mt-3 flex flex-wrap gap-x-5 gap-y-1">{resourceGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="inline-flex min-h-11 items-center text-sm font-bold text-[#1268a8] underline underline-offset-4">{group.eyebrow}</a>)}</nav>
        <div className="mt-4 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {resourceGroups.map((group) => <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="min-w-0 scroll-mt-28 border-t border-slate-300 pt-4">
            <h3 id={`${group.id}-heading`} className="text-base font-black text-[#12263a]">{group.eyebrow}</h3>
            <ul className="mt-3 space-y-2">{group.resources.map((resource) => <li key={resource.slug}><Link href={`/resources/${resource.slug}`} className="inline-flex min-h-11 items-center break-words text-sm leading-6 text-[#385064] hover:text-[#1268a8] hover:underline">{resource.title}</Link></li>)}</ul>
          </section>)}
        </div>
      </div>
    </section>
  </>;
}
