"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ListChecks, RotateCcw, Search } from "lucide-react";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogMetadataSync } from "@/components/CatalogMetadataSync";
import { Pagination } from "@/components/Pagination";
import { QueryStateSync } from "@/components/QueryStateSync";
import { StructuredData } from "@/components/StructuredData";
import { engineeringCaseCategories, engineeringCases } from "@/data/engineering-cases";
import { defaultEngineeringCaseFilters, engineeringCaseIndexTitle, getEngineeringCaseCategoryLabel, getEngineeringCasePage, parseEngineeringCaseFilters, serializeEngineeringCaseFilters, type EngineeringCaseFilters } from "@/lib/engineering-cases/filter";
import { buildPageHref } from "@/lib/navigation/pagination";
import { getCatalogMetadataState } from "@/lib/seo/catalog-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

const categories = [
  { id: "all" as const, label: "All references", count: engineeringCases.length },
  ...engineeringCaseCategories.map((category) => ({ ...category, count: engineeringCases.filter((entry) => entry.categoryId === category.id).length })),
];

export function EngineeringCaseBrowser({ initialFilters }: { initialFilters: EngineeringCaseFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const syncFilters = useCallback((params: URLSearchParams) => {
    const parsed = parseEngineeringCaseFilters(params);
    setFilters((current) => current.category === parsed.category && current.page === parsed.page && current.query.trim() === parsed.query
      ? { ...parsed, query: current.query }
      : parsed);
    const normalized = serializeEngineeringCaseFilters(parsed, params);
    if (normalized.toString() !== params.toString()) {
      window.history.replaceState(null, "", `${window.location.pathname}${normalized.size ? `?${normalized}` : ""}${window.location.hash}`);
    }
  }, []);

  function updateFilters(changes: Partial<EngineeringCaseFilters>, replace = false) {
    const next = { ...filters, ...changes, page: changes.page ?? 1 };
    next.page = getEngineeringCasePage(next).page;
    setFilters(next);
    const url = new URL(window.location.href);
    url.search = serializeEngineeringCaseFilters(next, url.searchParams).toString();
    const href = `${url.pathname}${url.search}${url.hash}`;
    if (replace) window.history.replaceState(null, "", href);
    else window.history.pushState(null, "", href);
  }

  const page = getEngineeringCasePage(filters);
  const hasFilters = filters.category !== "all" || Boolean(filters.query);
  const params = serializeEngineeringCaseFilters(filters);
  const pageHref = buildPageHref("/engineering-cases", params, page.page, "engineering-case-results");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: engineeringCaseIndexTitle,
    url: new URL(pageHref, siteUrl).href,
    numberOfItems: page.items.length,
    itemListElement: page.items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: new URL(buildPageHref("/engineering-cases", params, page.page, entry.slug), siteUrl).href,
    })),
  };

  return <section className="px-5 pb-8 pt-2 lg:px-8" aria-label="Engineering case references">
    <QueryStateSync onChange={syncFilters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/engineering-cases", engineeringCaseIndexTitle, page.page, hasFilters)} />
    <StructuredData data={structuredData} />
    <div className="mx-auto max-w-7xl">
      <CatalogControls className="border-b border-slate-200 pb-1">
        <fieldset className="grid grid-cols-2 border-b border-slate-200 md:grid-cols-5">
          <legend className="sr-only">Engineering case category</legend>
          {categories.map((category, index) => <label key={category.id} className={`relative -mb-px min-w-0 cursor-pointer ${index === 0 ? "col-span-2 md:col-span-1" : ""}`}>
            <input type="radio" name="engineering-case-category" value={category.id} checked={filters.category === category.id} onChange={() => updateFilters({ category: category.id })} className="peer sr-only" />
            <span className="flex min-h-12 h-full items-center justify-center gap-2 border-b-2 border-transparent px-2 py-3 text-center text-xs font-bold leading-5 text-[#526b7d] peer-checked:border-[#1268a8] peer-checked:bg-[#f2f7fb] peer-checked:text-[#1268a8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-3px] peer-focus-visible:outline-[#1479c9] lg:px-4 lg:text-sm"><span className="min-w-0 break-words">{category.label}</span><span aria-hidden="true" className="shrink-0 text-[11px] font-normal tabular-nums text-[#526b7d]">{category.count}</span></span>
          </label>)}
        </fieldset>
        <label className="mt-5 grid min-w-0 gap-2 text-xs font-bold text-[#385064]">Search engineering references<span className="relative flex min-w-0 items-center"><Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 text-slate-400" /><input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Test scope, interface or workflow" className="min-h-11 w-full min-w-0 rounded-md border border-slate-300 bg-white py-2 pl-10 pr-3 text-sm font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]" /></span></label>
        <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="min-w-0 flex-1 break-words text-sm text-[#526b7d]">{page.totalItems ? `${page.start}-${page.end} of ${page.totalItems} references` : "0 references"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultEngineeringCaseFilters)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline"><RotateCcw size={15} aria-hidden="true" />Reset filters</button> : null}
        </div>
      </CatalogControls>

      <div id="engineering-case-results" tabIndex={-1} className="scroll-mt-28 outline-none">
        <h2 className="sr-only">Engineering reference results</h2>
        {page.totalItems ? <div className="divide-y divide-slate-200">{page.items.map((entry, index) => <article key={entry.id} id={entry.slug} className="grid min-w-0 scroll-mt-28 gap-x-5 py-6 sm:grid-cols-[28px_minmax(0,1fr)] lg:gap-x-7 lg:py-7">
          <span aria-hidden="true" className="hidden pt-0.5 text-sm font-semibold tabular-nums text-[#7a8c9a] sm:block">{String(page.start + index).padStart(2, "0")}</span>
          <div className="min-w-0">
            <div className={`grid min-w-0 gap-4 ${entry.image ? "md:grid-cols-[minmax(0,1fr)_192px] lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-7" : ""}`}>
              <div className="min-w-0">
                <p className="text-xs font-semibold leading-5 text-[#15803d]">{getEngineeringCaseCategoryLabel(entry.categoryId)}</p>
                <h3 className="mt-1.5 max-w-4xl break-words text-lg font-bold leading-7 text-[#12263a]">{entry.title}</h3>
                <p className="mt-2 max-w-4xl text-sm leading-6 text-[#526b7d]">{entry.summary}</p>
                <Link href={`/resources/${entry.relatedResourceSlug}`} className="mt-2 inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-bold leading-6 text-[#1268a8] hover:underline"><span>Related testing guide</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link>
              </div>
              {entry.image ? <figure className="w-full max-w-sm min-w-0 self-start md:pt-1"><div className="aspect-[16/9] overflow-hidden rounded-md border border-slate-200 bg-[#f7fafc]"><Image src={entry.image.src} alt={entry.image.alt} width={entry.image.width} height={entry.image.height} sizes="(min-width: 1024px) 240px, (min-width: 768px) 192px, (min-width: 424px) 384px, calc(100vw - 40px)" className="h-full w-full object-contain" /></div></figure> : null}
            </div>
            <details className="group/focus mt-3 min-w-0 border-t border-slate-100">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-sm font-semibold text-[#385064] [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><ListChecks size={16} aria-hidden="true" />Technical focus</span><ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/focus:rotate-180" /></summary>
              <ul className="max-w-4xl list-disc space-y-2 pb-5 pl-5 text-sm leading-6 text-[#526b7d]">{entry.technicalFocus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
            </details>
          </div>
        </article>)}</div> : <div className="py-14 text-center"><h3 className="text-xl font-bold text-[#12263a]">No matching references</h3><p className="mt-3 text-sm text-[#526b7d]">No engineering reference matches this search and category.</p><button type="button" onClick={() => updateFilters(defaultEngineeringCaseFilters)} className="mt-4 min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button></div>}
      </div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/engineering-cases", params, number, "engineering-case-results")} />
    </div>
  </section>;
}
