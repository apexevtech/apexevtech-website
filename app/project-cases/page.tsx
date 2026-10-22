import type { Metadata } from "next";
import Link from "next/link";
import { T } from "@/components/LanguageProvider";
import { ArrowRight, BookOpen, BriefcaseBusiness, ChevronDown } from "lucide-react";
import { EngineeringCaseBrowser } from "@/components/EngineeringCaseBrowser";
import { ResourceBrowser } from "@/components/ResourceBrowser";
import { engineeringCases } from "@/data/engineering-cases";
import { interfaceTopics } from "@/data/interface-topics";
import { parseEngineeringCaseFilters } from "@/lib/engineering-cases/filter";
import { searchParamsFromRecord } from "@/lib/navigation/pagination";
import { parseResourceBrowserFilters, resourceBrowserEntries } from "@/lib/resources/browser";
import { resourceGroups } from "@/lib/resources/groups";
import { getCatalogMetadataState, projectCasesIndexTitle, resourceIndexTitle } from "@/lib/seo/catalog-metadata";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

type ProjectCasesPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const description = "Explore EV charger project references, laboratory and field testing applications, technical guides and test planning materials.";
const resourceDescription = "Technical guides for EV charger test equipment, DC fast chargers, AC EVSE, CCS2, GB/T, NACS, production and commissioning workflows.";

export async function generateMetadata({ searchParams }: ProjectCasesPageProps): Promise<Metadata> {
  const params = searchParamsFromRecord(await searchParams);
  if (params.get("section") === "resources") {
    const filters = parseResourceBrowserFilters(params);
    const hasFilters = filters.type !== "all" || filters.category !== "all" || Boolean(filters.query);
    return buildPageMetadata({ ...getCatalogMetadataState("/project-cases?section=resources", resourceIndexTitle, filters.page, hasFilters), description: resourceDescription, image: "/assets/social/resources.png" });
  }
  const filters = parseEngineeringCaseFilters(params);
  const hasFilters = filters.category !== "all" || Boolean(filters.query);
  return buildPageMetadata({ ...getCatalogMetadataState("/project-cases", projectCasesIndexTitle, filters.page, hasFilters), description, image: "/assets/engineering-cases/cases-banner.webp" });
}

export default async function ProjectCasesPage({ searchParams }: ProjectCasesPageProps) {
  const params = searchParamsFromRecord(await searchParams);
  const isResources = params.get("section") === "resources";
  const collections = [
    { href: "/project-cases", label: "Engineering references", icon: BriefcaseBusiness, count: engineeringCases.length, active: !isResources },
    { href: "/project-cases?section=resources", label: "Technical materials", icon: BookOpen, count: resourceBrowserEntries.length, active: isResources },
  ];

  return <>
    <section className="border-b border-[#e8edef] bg-white px-6 py-6 sm:py-7 lg:px-11">
      <div className="mx-auto max-w-[1448px]">
        <h1 className="text-2xl font-bold leading-tight text-[#12263a] sm:text-3xl"><T>Project Cases</T></h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-[#526b7d]"><T>Engineering references, technical guides and application planning for EV charging test projects.</T></p>
      </div>
    </section>

    <nav aria-label="Project case collections" className="border-b border-[#dce2e6] bg-white px-3 sm:px-6 lg:px-11">
      <div className="mx-auto grid max-w-[1448px] grid-cols-2 sm:flex">
        {collections.map((collection) => <Link key={collection.href} href={collection.href} aria-current={collection.active ? "page" : undefined} className={`flex min-h-16 min-w-0 items-center justify-center gap-2 border-b-4 px-2 py-3 text-sm font-bold leading-5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#1479c9] sm:gap-3 sm:px-6 sm:text-lg sm:leading-6 ${collection.active ? "border-[#1268a8] bg-[#edf5fc] text-[#1268a8]" : "border-transparent text-[#385064] hover:bg-[#f3f6f8] hover:text-[#1268a8]"}`}><collection.icon size={22} strokeWidth={2} aria-hidden="true" className="shrink-0" /><span><T>{collection.label}</T></span><span className="sr-only text-xs font-semibold tabular-nums text-[#64737e] sm:not-sr-only">{collection.count}</span></Link>)}
      </div>
    </nav>

    {isResources ? <ResourceBrowser initialFilters={parseResourceBrowserFilters(params)} /> : <EngineeringCaseBrowser initialFilters={parseEngineeringCaseFilters(params)} />}

    <section className="border-t border-[#e8edef] bg-[#f5f7f8] px-6 py-8 lg:px-11" aria-label="Related project materials">
      <div className="mx-auto max-w-[1448px]">
        <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
          {!isResources ? <p className="max-w-2xl text-xs leading-6 text-[#60717d]"><T>Partner-published technical references; not verified APEX delivery records.</T></p> : null}
          <Link href="/solutions" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1268a8] hover:underline"><T>Testing solutions</T><ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
        {isResources ? <details className="group/directory mt-4">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 [&::-webkit-details-marker]:hidden"><h2 id="guide-directory-heading" className="flex items-center gap-2 text-base font-bold text-[#12263a]"><BookOpen size={18} aria-hidden="true" /><T>Guide directory</T></h2><ChevronDown size={18} aria-hidden="true" className="shrink-0 text-[#526b7d] transition-transform group-open/directory:rotate-180" /></summary>
          <div className="mt-3 border-t border-slate-200 pt-3">
            <nav aria-label="Charging interfaces" className="flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1"><span className="text-xs font-bold text-[#526b7d]"><T>Interfaces</T></span>{interfaceTopics.map((topic) => <Link key={topic.slug} href={`/interfaces/${topic.slug}`} className="inline-flex min-h-11 items-center text-sm font-bold text-[#1268a8] hover:underline">{topic.name}</Link>)}</nav>
          </div>
          <nav aria-label="Guide topics" className="mt-2 flex flex-wrap gap-x-5 gap-y-1">{resourceGroups.map((group) => <a key={group.id} href={`#${group.id}`} className="inline-flex min-h-11 items-center text-xs font-bold text-[#1268a8] hover:underline"><T>{group.eyebrow}</T></a>)}</nav>
          <div className="mt-4 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {resourceGroups.map((group) => <section key={group.id} id={group.id} aria-labelledby={`${group.id}-heading`} className="min-w-0 scroll-mt-28 border-t border-slate-300 pt-4">
              <h3 id={`${group.id}-heading`} className="text-base font-black text-[#12263a]"><T>{group.eyebrow}</T></h3>
              <ul className="mt-3 space-y-1">{group.resources.map((resource) => <li key={resource.slug}><Link href={`/resources/${resource.slug}`} className="inline-flex min-h-11 items-center break-words text-sm leading-6 text-[#385064] hover:text-[#1268a8] hover:underline"><T>{resource.title}</T></Link></li>)}</ul>
            </section>)}
          </div>
        </details> : null}
      </div>
    </section>
  </>;
}
