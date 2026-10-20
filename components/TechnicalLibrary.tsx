"use client";

import { useCallback, useState } from "react";
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

const views: Array<{ value: LibraryFilters["view"]; label: string }> = [
  { value: "all", label: "All materials" },
  { value: "solutions", label: "Solutions" },
  { value: "scenarios", label: "Applications" },
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

  return <section className="px-5 py-8 lg:px-8" aria-label="Technical library materials">
    <QueryStateSync onChange={syncFilters} />
    <CatalogMetadataSync {...getCatalogMetadataState("/library", libraryIndexTitle, page.page, hasFilters)} />
    <div className="mx-auto max-w-7xl">
      <CatalogControls className="border-b border-slate-200 pb-6">
        <fieldset className="grid w-full max-w-lg grid-cols-3 rounded-md border border-slate-300 bg-white p-1">
          <legend className="sr-only">Material type</legend>
          {views.map((view) => <label key={view.value} className="relative min-w-0 cursor-pointer">
            <input type="radio" name="library-view" value={view.value} checked={filters.view === view.value} onChange={() => updateFilters({ view: view.value })} className="peer sr-only" />
            <span className="flex min-h-11 items-center justify-center rounded px-2 py-2 text-center text-sm font-bold text-[#385064] peer-checked:bg-[#1268a8] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#1479c9]">{view.label}</span>
          </label>)}
        </fieldset>
        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]">
          <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">Search materials<input type="search" value={filters.query} maxLength={120} onChange={(event) => updateFilters({ query: event.target.value }, true)} placeholder="Testing topic or requirement" className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]" /></label>
          <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">Category<select value={filters.category} onChange={(event) => updateFilters({ category: event.target.value })} className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 font-normal outline-none focus:border-[#1479c9] focus:ring-1 focus:ring-[#1479c9]"><option value="all">All categories</option>{getLibraryCategories(filters.view).map((category) => <option key={category.id} value={category.id}>{category.label}</option>)}</select></label>
        </div>
        <div className="mt-4 flex min-h-8 flex-wrap items-center justify-between gap-3">
          <p role="status" aria-live="polite" className="min-w-0 flex-1 break-words text-sm text-[#526b7d]">{count ? `${page.start}-${page.end} of ${count} ${count === 1 ? "material" : "materials"}` : "0 materials"}{filters.query ? ` matching "${filters.query}"` : ""}</p>
          {hasFilters ? <button type="button" onClick={() => updateFilters(defaultLibraryFilters)} className="min-h-11 text-sm font-bold text-[#1268a8] underline underline-offset-4">Reset filters</button> : null}
        </div>
      </CatalogControls>

      <div id="library-results" tabIndex={-1} className="scroll-mt-28">
      {solutions.length > 0 ? <LibraryGroup title="Solution briefs" id="solution-briefs" entries={solutions} categories={solutionBriefCategories} kind="solution" /> : null}
      {scenarios.length > 0 ? <LibraryGroup title="Application scenarios" id="application-scenarios" entries={scenarios} categories={applicationScenarioCategories} kind="application" /> : null}
      {count === 0 ? <div className="py-16 text-center"><h2 className="text-xl font-bold text-[#12263a]">No matching materials</h2><p className="mt-3 text-sm text-[#526b7d]">No brief matches this topic and category.</p><button type="button" onClick={() => updateFilters(defaultLibraryFilters)} className="mt-5 min-h-11 rounded-md border border-slate-300 px-5 text-sm font-bold text-[#1268a8]">Reset filters</button></div> : null}
      </div>
      <Pagination page={page.page} totalPages={page.totalPages} hrefForPage={(number) => buildPageHref("/library", serializeLibraryFilters(filters), number, "library-results")} />
    </div>
  </section>;
}

function LibraryGroup({ title, id, entries, categories, kind }: { title: string; id: string; entries: TechnicalLibraryEntry[]; categories: Array<{ id: string; label: string }>; kind: "solution" | "application" }) {
  return <section className="mt-8" aria-labelledby={id}>
    <div className="flex items-baseline gap-3 border-b border-slate-300 pb-3"><h2 id={id} className="text-xl font-black text-[#12263a]">{title}</h2><span className="text-sm text-[#526b7d]">{entries.length}</span></div>
    {entries.map((entry) => <article id={`material-${entry.id}`} key={entry.id} className="grid min-w-0 gap-3 border-b border-slate-200 py-6 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-8">
      <div className="text-sm"><p className="font-bold text-[#385064]">{categories.find((category) => category.id === entry.categoryId)?.label}</p><p className="mt-2 text-xs font-semibold uppercase text-[#15803d]">{kind === "solution" ? "Solution brief" : "Application planning"}</p></div>
      <div className="min-w-0">
        <h3 className="break-words text-lg font-bold leading-7 text-[#12263a]">{entry.title}</h3>
        <SourceCitation source={entry.source} />
        <details className="mt-4 max-w-4xl border-l-2 border-slate-200 pl-4">
          <summary className="min-h-11 cursor-pointer py-2.5 text-sm font-bold text-[#1268a8]">APEX planning checklist</summary>
          <p className="mt-2 text-sm leading-6 text-[#526b7d]">{entry.summary}</p>
          <h4 className="mt-3 text-sm font-bold text-[#385064]">Requirements to confirm</h4>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#526b7d]">{entry.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
          <h4 className="mt-4 text-sm font-bold text-[#385064]">Review output</h4><p className="mt-2 text-sm leading-6 text-[#526b7d]">{entry.reviewOutput}</p>
          <p className="mt-4 text-sm leading-6 text-[#526b7d]"><strong className="font-bold text-[#385064]">Scope:</strong> {entry.planningNote}</p>
        </details>
        <TrackedLink href={entry.relatedHref} eventName="library_material_click" location="technical-library" eventParameters={{ material_id: entry.id, material_type: kind, material_category: entry.categoryId }} className="mt-3 inline-flex min-h-11 items-center text-sm font-bold text-[#1268a8] underline underline-offset-4">{entry.relatedLabel}</TrackedLink>
      </div>
    </article>)}
  </section>;
}
