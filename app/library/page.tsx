import type { Metadata } from "next";
import Link from "next/link";
import { TechnicalLibrary } from "@/components/TechnicalLibrary";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { getLibraryPage, parseLibraryFilters } from "@/lib/library/filter";
import { searchParamsFromRecord } from "@/lib/navigation/pagination";
import { getCatalogMetadataState, libraryIndexTitle } from "@/lib/seo/catalog-metadata";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = parseLibraryFilters(searchParamsFromRecord(await searchParams));
  const page = getLibraryPage(filters).page;
  const filtered = filters.view !== "all" || filters.category !== "all" || Boolean(filters.query);
  return buildPageMetadata({
    ...getCatalogMetadataState("/library", libraryIndexTitle, page, filtered),
    description: "Explore APEX solution briefs and application planning checklists for EV charger laboratories, production testing, field diagnostics and energy integration.",
  });
}

export default async function LibraryPage({ searchParams }: Props) {
  const initialFilters = parseLibraryFilters(searchParamsFromRecord(await searchParams));
  return <>
    <section className="border-b border-slate-200 bg-white px-5 py-6 sm:py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#1268a8]"><Link href="/" className="hover:underline">Home</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page" className="text-[#526b7d]">Technical library</span></nav>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 sm:mt-6 sm:gap-5">
          <div className="max-w-3xl"><p className="hidden text-xs font-bold uppercase text-[#1268a8] sm:block">Solutions and application planning</p><h1 className="text-2xl font-black leading-tight text-[#12263a] sm:mt-2 sm:text-3xl md:text-4xl">APEX technical library</h1><p className="mt-3 leading-6 text-[#526b7d] sm:mt-4 sm:leading-7">SAITER source references with APEX planning checklists. Third-party project reports are not APEX delivery records.</p></div>
          <Link href="/contact#inquiry-form" className="inline-flex min-h-12 items-center justify-center rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f5f9f]">Discuss a test requirement</Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#526b7d] sm:mt-6"><span>6 solution briefs / 18 scenarios</span><span>Updated <time dateTime="2026-10-20">20 Oct 2026</time></span></div>
      </div>
    </section>

    <TechnicalLibrary initialFilters={initialFilters} />

    <section className="border-t border-slate-200 bg-[#f3f8fa] px-5 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <div><h2 className="text-xl font-bold text-[#12263a]">Confirm the equipment configuration</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#526b7d]">Interfaces, software, instruments, loading and integration are subject to the agreed project scope. Published model specifications remain the equipment baseline.</p></div>
        <div className="flex flex-wrap gap-4 text-sm font-bold text-[#1268a8]"><Link href="/products" className="inline-flex min-h-11 items-center underline underline-offset-4">Equipment catalog</Link><Link href="/applications" className="inline-flex min-h-11 items-center underline underline-offset-4">Application architectures</Link></div>
      </div>
    </section>
  </>;
}
