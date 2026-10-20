"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { ArrowRight, ChevronDown, ListChecks, Search, X } from "lucide-react";
import { CatalogControls } from "@/components/CatalogControls";
import { CatalogMetadataSync } from "@/components/CatalogMetadataSync";
import { Pagination } from "@/components/Pagination";
import { QueryStateSync } from "@/components/QueryStateSync";
import { SourceCitation } from "@/components/SourceCitation";
import { TrackedLink } from "@/components/TrackedLink";
import { applicationScenarioCategories, solutionBriefCategories, type TechnicalLibraryEntry } from "@/data/technical-library";
import { defaultLibraryFilters, getLibraryPage, getLibraryCategories, parseLibraryFilters, serializeLibraryFilters, type LibraryFilters } from "@/lib/library/filter";
import { buildPageHref } from "@/lib/navigation/pagination";
import { getCatalogMetadataState, libraryIndexTitle } from "@/lib/seo/catalog-metadata";

const views: Array<{ value: LibraryFilters["view"]; label: string; count: number }> = [
  { value: "all", label: "All materials", count: 24 },
  { value: "solutions", label: "Solutions", count: 6 },
  { value: "scenarios", label: "Applications", count: 18 },
];

export function TechnicalLibrary({ initialFilters = defaultLibraryFilters }: { initialFilters?: LibraryFilters }) {
  const [filters, setFilters] = useState<LibraryFilters>(initialFilters);
  const syncFilters = useCallback((params: URLSearchParams) => {
    const parsed = parseLibraryFilters(params);
    setFilters((current) => current.view === parsed.view && current.category === parsed.category && current.page === parsed.page && current.query.trim() === parsed.query
      ? { ...parsed, query: current.query }
      : parsed);
  }, []);

  function updateFilters(changes: Partial<LibraryFilters>, replace = false) {
    const next = { ...filters, ...changes, page: changes.page ?? 1 };
    if (changes.view && !getLibraryCategories(next.view).some((category) => category.id === next.category)) next.category = "all";
    setFilters(next);
    const url = new URL(window.location.href);
    url.search = serializeLibraryFilters(next, url.searchParams).toString();
    if (replace) window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    else window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  const page = getLibraryPage(filters);
  const { solutions, scenarios } = page;
  const count = page.totalItems;
  const hasFilters = filters.view !== "all" || filters.category !== "all" || Boolean(filters.query);

  return <section className="bg-white px-5 pb-6 pt-5 sm:pt-6 lg:px-8" aria-label="Technical library materials">
    <QueryStateSync onChange={syncFilters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/library", libraryIndexTitle, page.page, hasFilters)} />
    <div className="mx-auto max-w-7xl">
      <CatalogControls className="border-b border-slate-200 pb-3">
        <fieldset className="grid w-full max-w-lg grid-cols-3 border-b border-slate-200">
          <legend className="sr-only">Material type</legend>
          {views.map((view) => <label key={view.value} className="relative min-w-0 cursor-pointer">
            <input type="radio" name="library-view" value={view.value} checked={filters.view === view.value} onChange={() => updateFilters({ view: view.value })} className="peer sr-only" />
            <span className="flex min-h-12 items-center justify-center gap-1 border-b-2 border-transparent px-0.5 py-2 text-center text-xs font-bold text-[#526b7d] peer-checked:border-[#1268a8] peer-checked:text-[#1268a8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1479c9] sm:gap-2 sm:px-2 sm:text-sm">{view.label}<span aria-hidden="true" className="text-[11px] font-normal text-[#526b7d]">{view.count}</span></span>
          </label>)}
        </fieldset>
        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]">
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#385064]">Search materials<span className="relative min-w-0"><Search size={18} aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 text-[#526b7d]" /><input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Testing topic or requirement" className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white pl-10 pr-3 text-sm font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]" /></span></label>
          <label className="grid min-w-0 gap-2 text-xs font-bold text-[#385064]">Category<select value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })} className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]"><option value="all">All categories</option>{getLibraryCategories(filters.view).map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
        </div>
        <div className="mt-4 flex min-h-8 flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="min-w-0 flex-1 break-words text-sm text-[#526b7d]">{count ? `${page.start}-${page.end} of ${count} ${count === 1 ? "material" : "materials"}` : "0 materials"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultLibraryFilters)} className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8]"><X size={16} aria-hidden="true" />Reset filters</button> : null}
        </div>
      </CatalogControls>

      <div id="library-results" tabIndex={-1} className="scroll-mt-28">
      {solutions.length > 0 ? <LibraryGroup title="Solution briefs" id="solution-briefs" entries={solutions} categories={solutionBriefCategories} kind="solution" start={page.start} /> : null}
      {scenarios.length > 0 ? <LibraryGroup title="Application scenarios" id="application-scenarios" entries={scenarios} categories={applicationScenarioCategories} kind="application" start={page.start + solutions.length} /> : null}
      {count === 0 ? <div className="py-16 text-center"><h2 className="text-xl font-bold text-[#12263a]">No matching materials</h2><p className="mt-3 text-sm text-[#526b7d]">No brief matches this topic and category.</p><button type="button" onClick={() => updateFilters(defaultLibraryFilters)} className="mt-5 min-h-11 rounded-md border border-slate-300 px-5 text-sm font-bold text-[#1268a8]">Reset filters</button></div> : null}
      </div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/library", serializeLibraryFilters(filters), number, "library-results")} />
    </div>
  </section>;
}

function LibraryGroup({ title, id, entries, categories, kind, start }: { title: string; id: string; entries: TechnicalLibraryEntry[]; categories: Array<{ id: string; label: string }>; kind: "solution" | "application"; start: number }) {
  return <section className="mt-6" aria-labelledby={id}>
    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 pb-3"><h2 id={id} className="text-lg font-bold text-[#12263a]">{title}</h2><span className="text-xs text-[#526b7d]">{entries.length} on this page</span></div>
    {entries.map((entry, index) => <LibraryEntry key={entry.id} entry={entry} category={categories.find((category) => category.id === entry.categoryId)?.label || ""} kind={kind} number={start + index} />)}
  </section>;
}

export function LibraryEntry({ entry, category, kind, number }: { entry: TechnicalLibraryEntry; category: string; kind: "solution" | "application"; number: number }) {
  const image = entry.source.image;
  return <article id={`material-${entry.id}`} className="grid min-w-0 gap-x-5 border-b border-slate-200 py-6 sm:grid-cols-[28px_minmax(0,1fr)] lg:gap-x-7">
    <span aria-hidden="true" className="hidden pt-0.5 text-sm font-semibold tabular-nums text-[#7a8c9a] sm:block">{String(number).padStart(2, "0")}</span>
    <div className="min-w-0">
      <div className={`grid min-w-0 gap-4 ${image ? "md:grid-cols-[minmax(0,1fr)_192px] lg:grid-cols-[minmax(0,1fr)_224px] lg:gap-7" : ""}`}>
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#15803d]">{category}</p>
          <h3 className="mt-1.5 break-words text-lg font-bold leading-7 text-[#12263a] sm:text-xl">{entry.title}</h3>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#526b7d]">{entry.summary}</p>
          <TrackedLink href={entry.relatedHref} eventName="library_material_click" location="technical-library" eventParameters={{ material_id: entry.id, material_type: kind, material_category: entry.categoryId }} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline">{entry.relatedLabel}<ArrowRight size={16} className="shrink-0" aria-hidden="true" /></TrackedLink>
        </div>
        {image ? <figure className="w-full max-w-sm min-w-0 self-start md:pt-1"><div className="aspect-[16/9] overflow-hidden rounded-md border border-slate-200 bg-[#f7fafc]"><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 224px, (min-width: 768px) 192px, (min-width: 424px) 384px, calc(100vw - 40px)" className="h-full w-full object-contain" /></div></figure> : null}
      </div>
      <div className="mt-3 border-t border-slate-100">
        <details className="group/checklist min-w-0">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-sm font-semibold text-[#385064] [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><ListChecks size={16} aria-hidden="true" />Planning checklist</span><ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/checklist:rotate-180" /></summary>
          <div className="max-w-4xl pb-5 pl-6">
            <h4 className="mt-1 text-sm font-bold text-[#385064]">Requirements to confirm</h4>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#526b7d]">{entry.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
            <h4 className="mt-4 text-sm font-bold text-[#385064]">Review output</h4><p className="mt-2 text-sm leading-6 text-[#526b7d]">{entry.reviewOutput}</p>
            <p className="mt-4 text-xs leading-5 text-[#526b7d]"><strong className="font-semibold text-[#385064]">Scope:</strong> {entry.planningNote}</p>
          </div>
        </details>
        <details className="group/context min-w-0 border-t border-slate-100">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-xs font-semibold text-[#526b7d] [&::-webkit-details-marker]:hidden">Technical context<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/context:rotate-180" /></summary>
          <div className="max-w-4xl pb-5"><SourceCitation source={entry.source} compact showImage={false} showTitle={false} /></div>
        </details>
      </div>
    </div>
  </article>;
}
