import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, BookOpen, ChevronDown } from "lucide-react";
import { ResourceBrowser } from "@/components/ResourceBrowser";
import { searchParamsFromRecord } from "@/lib/navigation/pagination";
import { parseResourceBrowserFilters } from "@/lib/resources/browser";
import { resourceGroups } from "@/lib/resources/groups";
import { resourceBannerImage } from "@/lib/resources/images";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import Link from "next/link";
import { interfaceTopics } from "@/data/interface-topics";
import { getCatalogMetadataState, resourceIndexTitle } from "@/lib/seo/catalog-metadata";

type ResourcesPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const description = "Technical guides for EV charger test equipment, DC fast chargers, AC EVSE, CCS2, GB/T, NACS, production and commissioning workflows.";

export async function generateMetadata({ searchParams }: ResourcesPageProps): Promise<Metadata> {
  const filters = parseResourceBrowserFilters(searchParamsFromRecord(await searchParams));
  const hasFilters = filters.type !== "all" || filters.category !== "all" || Boolean(filters.query);
  return buildPageMetadata({ ...getCatalogMetadataState("/resources", resourceIndexTitle, filters.page, hasFilters), description, image: resourceBannerImage.src });
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const filters = parseResourceBrowserFilters(searchParamsFromRecord(await searchParams));
  return <>
    <section className="relative isolate bg-white">
      <Image src={resourceBannerImage.src} alt={resourceBannerImage.alt} width={resourceBannerImage.width} height={resourceBannerImage.height} preload sizes="100vw" className="block h-auto w-full" />
      <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
      <div className="absolute inset-0 flex items-center justify-center px-5 text-center">
        <div className="max-w-3xl text-white">
          <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[40px]">Resource Center</h1>
          <p className="mt-3 text-sm font-normal leading-6 sm:mt-4 sm:text-lg">Technical guides, solution briefs and application planning for laboratory, production and field testing.</p>
        </div>
      </div>
    </section>

    <ResourceBrowser initialFilters={filters} />

    <section className="border-t border-[#e8edef] bg-[#f5f7f8] px-6 py-8 lg:px-11" aria-labelledby="guide-directory-heading">
      <div className="mx-auto max-w-[1448px]">
        <div className="mb-4 flex flex-wrap gap-x-8 gap-y-2">
          <Link href="/engineering-cases" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1268a8] hover:underline">Engineering cases<ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href="/solutions" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1268a8] hover:underline">Testing solutions<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
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
