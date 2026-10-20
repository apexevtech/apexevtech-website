import type { Metadata } from "next";
import { ArrowRight, BookOpen, ChevronDown, ChevronRight } from "lucide-react";
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
    <section className="border-b border-slate-200 bg-white px-5 pb-7 pt-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-medium text-[#526b7d]">
          <Link href="/" className="inline-flex min-h-8 items-center hover:text-[#1268a8]">Home</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Resources</span>
        </nav>
        <div className="mt-3 flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-end">
          <div className="min-w-0">
            <h1 className="text-2xl font-black leading-tight text-[#12263a] sm:text-3xl">EV charger testing resource center</h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-[#526b7d]">Technical guides, solution briefs and application planning for laboratory, production and field testing.</p>
          </div>
          <Link href="/solutions" className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline">Explore solutions<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>

    <ResourceBrowser initialFilters={filters} />

    <section className="border-t border-slate-200 bg-[#f3f8fa] px-5 py-6 lg:px-8" aria-labelledby="guide-directory-heading">
      <div className="mx-auto max-w-7xl">
        <details className="group/directory">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"><h2 id="guide-directory-heading" className="flex items-center gap-2 text-base font-bold text-[#12263a]"><BookOpen size={18} aria-hidden="true" />Guide directory</h2><ChevronDown size={18} aria-hidden="true" className="shrink-0 text-[#526b7d] transition-transform group-open/directory:rotate-180" /></summary>
          <div className="mt-3 border-t border-slate-200 pt-3">
            <nav aria-label="Charging interfaces" className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1"><span className="text-xs font-bold text-[#526b7d]">Interfaces</span>{interfaceTopics.map((topic) => <Link key={topic.slug} href={`/interfaces/${topic.slug}`} className="inline-flex min-h-11 items-center text-sm font-bold text-[#1268a8] hover:underline">{topic.name}</Link>)}</nav>
          </div>
          <nav aria-label="Guide topics" className="mt-2 flex flex-wrap gap-x-5 gap-y-1">{resourceGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="inline-flex min-h-11 items-center text-xs font-bold text-[#1268a8] hover:underline">{group.eyebrow}</a>)}</nav>
          <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {resourceGroups.map((group) => <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="min-w-0 scroll-mt-28 border-t border-slate-300 pt-4">
              <h3 id={`${group.id}-heading`} className="text-base font-black text-[#12263a]">{group.eyebrow}</h3>
              <ul className="mt-3 space-y-1">{group.resources.map((resource) => <li key={resource.slug}><Link href={`/resources/${resource.slug}`} className="inline-flex min-h-11 items-center break-words text-sm leading-6 text-[#385064] hover:text-[#1268a8] hover:underline">{resource.title}</Link></li>)}</ul>
            </section>)}
          </div>
        </details>
      </div>
    </section>
  </>;
}
