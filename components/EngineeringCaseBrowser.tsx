"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ChevronRight, Home, RotateCcw, Search } from "lucide-react";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogMetadataSync } from "@/components/CatalogMetadataSync";
import { EngineeringCaseCard } from "@/components/EngineeringCaseCard";
import { Pagination } from "@/components/Pagination";
import { QueryStateSync } from "@/components/QueryStateSync";
import { StructuredData } from "@/components/StructuredData";
import { engineeringCaseCategories, engineeringCases } from "@/data/engineering-cases";
import { defaultEngineeringCaseFilters, getEngineeringCasePage, parseEngineeringCaseFilters, serializeEngineeringCaseFilters, type EngineeringCaseFilters } from "@/lib/engineering-cases/filter";
import { buildPageHref } from "@/lib/navigation/pagination";
import { getCatalogMetadataState, projectCasesIndexTitle } from "@/lib/seo/catalog-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

const categories = engineeringCaseCategories.map((category) => ({ ...category, count: engineeringCases.filter((entry) => entry.categoryId === category.id).length }));

export function EngineeringCaseBrowser({ initialFilters }: { initialFilters: EngineeringCaseFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const syncFilters = useCallback((params: URLSearchParams) => {
    if (params.get("section") === "resources") return;
    const parsed = parseEngineeringCaseFilters(params);
    setFilters((current) => current.category === parsed.category && current.page === parsed.page && current.query.trim() === parsed.query
      ? { ...parsed, query: current.query }
      : parsed);
    const normalized = serializeEngineeringCaseFilters(parsed, params);
    if (normalized.toString() !== params.toString()) {
      window.history.replaceState(null, "", `${window.location.pathname}${normalized.size ? `?${normalized}` : ""}${window.location.hash}`);
    }
  }, []);

  useEffect(() => {
    // Rapid history traversals can coalesce the router's query updates.
    const syncHistory = () => syncFilters(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", syncHistory);
    return () => window.removeEventListener("popstate", syncHistory);
  }, [syncFilters]);

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
  const pageHref = buildPageHref("/project-cases", params, page.page, "engineering-case-results");
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: projectCasesIndexTitle,
    url: new URL(pageHref, siteUrl).href,
    numberOfItems: page.items.length,
    itemListElement: page.items.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.title,
      url: new URL(buildPageHref("/project-cases", params, page.page, entry.slug), siteUrl).href,
    })),
  };

  return <section className="bg-white" aria-label="Engineering case references">
    <QueryStateSync onChange={syncFilters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/project-cases", projectCasesIndexTitle, page.page, hasFilters)} />
    <StructuredData data={structuredData} />
    <CatalogControls className="bg-[#f3f4f5] px-6 lg:px-11">
      <div className="mx-auto flex min-h-[72px] max-w-[1448px] items-center justify-between gap-3 sm:gap-5">
        <nav aria-label="Breadcrumb" className="flex shrink-0 items-center gap-2 text-xs leading-5 text-[#64737e]">
          <Link href="/" title="Home" className="flex min-h-11 min-w-8 items-center hover:text-[#1268a8]"><Home size={16} strokeWidth={1.5} aria-hidden="true" /><span className="sr-only">Home</span></Link>
          <ChevronRight size={12} aria-hidden="true" /><span aria-current="page" className="hidden sm:inline">Engineering references</span>
        </nav>
        <label className="flex min-w-0 items-center gap-3 text-sm text-[#526b7d] xl:hidden">
          <span className="sr-only">Engineering case category</span>
          <select value={filters.category} onChange={(event) => updateFilters({ category: event.target.value as EngineeringCaseFilters["category"] })} className="min-h-11 min-w-0 max-w-full border-0 bg-transparent py-2 pl-1 pr-6 text-xs font-medium text-[#385064] outline-offset-2 focus-visible:outline-[#1268a8] sm:text-sm">
            <option value="all">All cases ({engineeringCases.length})</option>
            {categories.map((category) => <option key={category.id} value={category.id}>{category.label} ({category.count})</option>)}
          </select>
        </label>
        <fieldset className="hidden self-stretch xl:flex">
          <legend className="sr-only">Engineering case category</legend>
          {categories.map((category) => <label key={category.id} className="relative min-w-0 cursor-pointer">
            <input type="radio" name="engineering-case-category" value={category.id} checked={filters.category === category.id} onChange={() => updateFilters({ category: category.id })} className="peer sr-only" />
            <span className="flex h-full min-h-[72px] items-center justify-center gap-2 border-b-2 border-transparent px-4 py-3 text-center text-sm font-medium leading-5 text-[#526b7d] transition-colors hover:text-[#1268a8] peer-checked:border-[#1268a8] peer-checked:text-[#1268a8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-3px] peer-focus-visible:outline-[#1479c9]"><span>{category.label}</span><span aria-hidden="true" className="text-[11px] font-normal tabular-nums text-[#7a8993]">{category.count}</span></span>
          </label>)}
        </fieldset>
      </div>
    </CatalogControls>
    <div className="mx-auto max-w-[1536px] px-6 pb-10 pt-7 sm:pt-9 lg:px-11 lg:pb-14">
      <CatalogControls className="mb-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:mb-10">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1">
          <p role="status" aria-live="polite" className="min-w-0 break-words text-xs leading-6 text-[#74828d]">{page.totalItems ? `${page.start}-${page.end} of ${page.totalItems} references` : "0 references"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultEngineeringCaseFilters)} className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-[#1268a8] hover:underline"><RotateCcw size={14} aria-hidden="true" />Reset filters</button> : null}
        </div>
        <label className="relative flex min-w-0 flex-1 basis-full items-center sm:max-w-[280px] sm:basis-auto"><span className="sr-only">Search engineering references</span><Search size={17} strokeWidth={1.5} aria-hidden="true" className="pointer-events-none absolute left-0 text-[#74828d]" /><input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Search cases" className="min-h-11 w-full min-w-0 border-0 border-b border-[#dce2e6] bg-white py-2 pl-7 pr-1 text-sm text-[#385064] outline-none placeholder:text-[#74828d] focus:border-[#1268a8]" /></label>
      </CatalogControls>
      <div id="engineering-case-results" tabIndex={-1} className="scroll-mt-28 outline-none">
        <h2 className="sr-only">Engineering reference results</h2>
        {page.totalItems ? <div className="grid items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14">{page.items.map((entry) => <EngineeringCaseCard key={entry.id} entry={entry} />)}</div> : <div className="py-14 text-center"><h3 className="text-xl font-bold text-[#12263a]">No matching references</h3><p className="mt-3 text-sm text-[#526b7d]">No engineering reference matches this search and category.</p><button type="button" onClick={() => updateFilters(defaultEngineeringCaseFilters)} className="mt-4 min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button></div>}
      </div>
      <div className="mt-10 [&_nav]:border-0 [&_nav]:pb-0 [&_nav]:pt-2 [&_nav>a]:rounded-none [&_nav>span]:rounded-none"><Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/project-cases", params, number, "engineering-case-results")} /></div>
    </div>
  </section>;
}
