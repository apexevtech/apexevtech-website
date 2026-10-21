"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight, FileText, Home, Layers3, RotateCcw, Search, Workflow, X } from "lucide-react";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogMetadataSync } from "@/components/CatalogMetadataSync";
import { Pagination } from "@/components/Pagination";
import { QueryStateSync } from "@/components/QueryStateSync";
import { ResourceHashNavigation } from "@/components/ResourceHashNavigation";
import { ResourceMaterial } from "@/components/ResourceMaterial";
import { StructuredData } from "@/components/StructuredData";
import { buildPageHref } from "@/lib/navigation/pagination";
import { defaultResourceBrowserFilters, getResourceBrowserCategories, getResourceBrowserCategoryLabel, getResourceBrowserPage, parseResourceBrowserFilters, resourceBrowserEntries, serializeResourceBrowserFilters, type ResourceBrowserFilters } from "@/lib/resources/browser";
import { buildResourceIndexStructuredData } from "@/lib/seo/resource-index-structured-data";
import { siteUrl } from "@/lib/seo/site-urls";
import { getCatalogMetadataState, resourceIndexTitle } from "@/lib/seo/catalog-metadata";

const materialTypes = [
  { value: "all", label: "All materials", icon: Layers3, count: resourceBrowserEntries.length },
  { value: "guides", label: "Guides", icon: BookOpen, count: resourceBrowserEntries.filter((entry) => entry.kind === "guide").length },
  { value: "sources", label: "Solution briefs", icon: FileText, count: resourceBrowserEntries.filter((entry) => entry.kind === "source").length },
  { value: "scenarios", label: "Applications", icon: Workflow, count: resourceBrowserEntries.filter((entry) => entry.kind === "scenario").length },
] satisfies Array<{ value: ResourceBrowserFilters["type"]; label: string; icon: typeof Layers3; count: number }>;

export function ResourceBrowser({ initialFilters }: { initialFilters: ResourceBrowserFilters }) {
  const [filters, setFilters] = useState(initialFilters);
  const syncFilters = useCallback((params: URLSearchParams) => {
    const parsed = parseResourceBrowserFilters(params);
    setFilters((current) => current.type === parsed.type && current.category === parsed.category && current.page === parsed.page && current.query.trim() === parsed.query
      ? { ...parsed, query: current.query }
      : parsed);
    const normalized = serializeResourceBrowserFilters(parsed, params);
    if (normalized.toString() !== params.toString()) {
      window.history.replaceState(null, "", `${window.location.pathname}${normalized.size ? `?${normalized}` : ""}${window.location.hash}`);
    }
  }, []);

  useEffect(() => {
    // Keep rapid back/forward navigation aligned with the visible filters.
    const syncHistory = () => syncFilters(new URLSearchParams(window.location.search));
    window.addEventListener("popstate", syncHistory);
    return () => window.removeEventListener("popstate", syncHistory);
  }, [syncFilters]);

  function updateFilters(changes: Partial<ResourceBrowserFilters>, replace = false) {
    const next = { ...filters, ...changes, page: changes.page ?? 1 };
    if (changes.type) next.category = parseResourceBrowserFilters(serializeResourceBrowserFilters(next)).category;
    next.page = getResourceBrowserPage(next).page;
    setFilters(next);
    const url = new URL(window.location.href);
    url.search = serializeResourceBrowserFilters(next, url.searchParams).toString();
    if (changes.page) url.hash = "resource-results";
    const href = `${url.pathname}${url.search}${url.hash}`;
    if (replace) window.history.replaceState(null, "", href);
    else window.history.pushState(null, "", href);
  }

  const page = getResourceBrowserPage(filters);
  const hasFilters = filters.type !== "all" || filters.category !== "all" || Boolean(filters.query);
  const params = serializeResourceBrowserFilters(filters);
  const pageHref = buildPageHref("/resources", params, page.page, "resource-results");
  const visibleGuides = page.items.flatMap((entry) => entry.kind === "guide" ? [entry.resource] : []);
  const selectedType = filters.type === "materials" ? "all" : filters.type;
  const SelectedTypeIcon = materialTypes.find((type) => type.value === selectedType)?.icon ?? Layers3;
  const currentCategories = getResourceBrowserCategories(filters.type);
  const legacyCategory = filters.category !== "all" && !currentCategories.some((category) => category.id === filters.category);

  return <section className="bg-white" aria-label="Resource materials">
    <QueryStateSync onChange={syncFilters} />
    <ResourceHashNavigation filters={filters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/resources", resourceIndexTitle, page.page, hasFilters)} />
    <StructuredData data={buildResourceIndexStructuredData(visibleGuides, siteUrl, pageHref)} />
    <CatalogControls className="bg-[#f3f4f5] px-6 lg:px-11">
      <div className="mx-auto flex min-h-[72px] max-w-[1448px] items-center justify-between gap-3 sm:gap-5">
        <nav aria-label="Breadcrumb" className="flex shrink-0 items-center gap-2 text-xs leading-5 text-[#64737e]">
          <Link href="/" title="Home" className="flex min-h-11 min-w-8 items-center hover:text-[#1268a8]"><Home size={16} strokeWidth={1.5} aria-hidden="true" /><span className="sr-only">Home</span></Link>
          <ChevronRight size={12} aria-hidden="true" /><span aria-current="page" className="hidden sm:inline">Resources</span>
        </nav>
        <label className="flex min-w-0 items-center gap-2 text-[#1268a8] lg:hidden">
          <span className="sr-only">Material type</span>
          <SelectedTypeIcon size={22} strokeWidth={2} aria-hidden="true" className="shrink-0" />
          <select value={filters.type} onChange={(event) => updateFilters({ type: event.target.value as ResourceBrowserFilters["type"] })} className="min-h-11 min-w-0 max-w-full border-0 bg-transparent py-2 pl-1 pr-6 text-sm font-semibold text-[#1268a8] outline-offset-2 focus-visible:outline-[#1268a8]">
            {filters.type === "materials" ? <option value="materials">Planning materials (24)</option> : null}
            {materialTypes.map((type) => <option key={type.value} value={type.value}>{type.label} ({type.count})</option>)}
          </select>
        </label>
        <fieldset className="hidden self-stretch lg:flex">
          <legend className="sr-only">Material type</legend>
          {materialTypes.map((type) => <label key={type.value} className="relative min-w-0 cursor-pointer">
            <input type="radio" name="resource-type" value={type.value} checked={selectedType === type.value} onChange={() => updateFilters({ type: type.value })} onClick={() => { if (filters.type === "materials" && type.value === "all") updateFilters({ type: "all" }); }} className="peer sr-only" />
            <span className="flex h-full min-h-[72px] items-center justify-center gap-2 border-b-4 border-transparent px-4 py-3 text-center text-lg font-semibold leading-6 text-[#385064] transition-colors hover:bg-[#eaf0f5] hover:text-[#1268a8] peer-checked:border-[#1268a8] peer-checked:bg-[#e7f1fb] peer-checked:text-[#1268a8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-3px] peer-focus-visible:outline-[#1479c9]"><type.icon size={24} strokeWidth={2} aria-hidden="true" className="shrink-0" /><span className="whitespace-nowrap">{type.label}</span><span aria-hidden="true" className="text-xs font-medium tabular-nums text-[#64737e]">{type.count}</span></span>
          </label>)}
        </fieldset>
      </div>
    </CatalogControls>
    <div className="mx-auto max-w-[1536px] px-6 pb-10 pt-7 sm:pt-9 lg:px-11 lg:pb-14">
      <CatalogControls className="mb-7 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 sm:mb-10">
        <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1">
          <p role="status" aria-live="polite" className="min-w-0 break-words text-xs leading-6 text-[#74828d]">{page.totalItems ? `${page.start}-${page.end} of ${page.totalItems} materials` : "0 materials"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="inline-flex min-h-11 items-center gap-2 text-xs font-medium text-[#1268a8] hover:underline"><RotateCcw size={14} aria-hidden="true" />Reset filters</button> : null}
          {filters.type === "materials" ? <button type="button" aria-label="Remove planning materials filter" onClick={() => updateFilters({ type: "all" })} className="inline-flex min-h-9 max-w-full items-center gap-2 rounded border border-slate-300 px-2.5 text-xs font-medium text-[#385064]">Planning materials<X size={14} aria-hidden="true" className="shrink-0" /></button> : null}
        </div>
        <div className="grid w-full min-w-0 gap-x-6 gap-y-3 sm:ml-auto sm:w-[480px] sm:grid-cols-[minmax(0,200px)_minmax(0,256px)]">
          <label className="flex min-w-0 items-center"><span className="sr-only">Topic</span><select value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })} className="min-h-11 w-full min-w-0 border-0 border-b border-[#dce2e6] bg-white py-2 pl-0 pr-6 text-sm text-[#526b7d] outline-none focus:border-[#1268a8]"><option value="all">All topics</option>{legacyCategory ? <option value={filters.category}>{getResourceBrowserCategoryLabel(filters.category)}</option> : null}{currentCategories.map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
          <label className="relative flex min-w-0 items-center"><span className="sr-only">Search materials</span><Search size={17} strokeWidth={1.5} aria-hidden="true" className="pointer-events-none absolute left-0 text-[#74828d]" /><input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Search materials" className="min-h-11 w-full min-w-0 border-0 border-b border-[#dce2e6] bg-white py-2 pl-7 pr-1 text-sm text-[#385064] outline-none placeholder:text-[#74828d] focus:border-[#1268a8]" /></label>
        </div>
      </CatalogControls>

      <div id="resource-results" tabIndex={-1} className="scroll-mt-28 outline-none">
        <div id="library-results" className="scroll-mt-28" />
        <div id="solution-briefs" className="scroll-mt-28" />
        <div id="application-scenarios" className="scroll-mt-28" />
        <h2 className="sr-only">Resource results</h2>
        {page.totalItems ? <div className="grid items-start gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-14">{page.items.map((entry) => <ResourceMaterial key={entry.id} entry={entry} category={getResourceBrowserCategoryLabel(entry.categoryId)} />)}</div>
          : <div className="py-14 text-center"><h3 className="text-xl font-bold text-[#12263a]">No matching materials</h3><p className="mt-3 text-sm text-[#526b7d]">No material matches this search and category.</p><button type="button" onClick={() => updateFilters(defaultResourceBrowserFilters)} className="mt-4 min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button></div>}
      </div>
      <div className="mt-10 [&_nav]:border-0 [&_nav]:pb-0 [&_nav]:pt-2 [&_nav>a]:rounded-none [&_nav>span]:rounded-none"><Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/resources", params, number, "resource-results")} /></div>
    </div>
  </section>;
}
