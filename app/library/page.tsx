import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
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
    <section className="border-b border-slate-200 bg-white px-5 py-5 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="text-sm text-[#1268a8]"><Link href="/" className="hover:underline">Home</Link><span className="mx-2" aria-hidden="true">/</span><span aria-current="page" className="text-[#526b7d]">Technical library</span></nav>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 sm:mt-5 sm:gap-5">
          <div className="max-w-3xl">
            <p className="mb-2 hidden items-center gap-2 text-xs font-bold uppercase text-[#1268a8] sm:flex"><BookOpen size={15} aria-hidden="true" />Engineering materials</p>
            <h1 className="text-2xl font-black leading-tight text-[#12263a] sm:text-3xl">APEX technical library</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#526b7d] sm:text-base">Test-scope and equipment planning for EV charger projects. These materials are not completed customer project records.</p>
          </div>
          <Link href="/contact#inquiry-form" className="inline-flex min-h-11 items-center justify-center gap-3 rounded-md bg-[#1479c9] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0f5f9f]">Discuss a test requirement<ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-xs text-[#526b7d] sm:mt-5"><span><strong className="font-bold text-[#12263a]">24</strong> materials</span><span className="hidden sm:inline">6 solution briefs</span><span className="hidden sm:inline">18 application scenarios</span><span className="sm:ml-auto">Updated <time dateTime="2026-10-20">20 Oct 2026</time></span></div>
      </div>
    </section>

    <TechnicalLibrary initialFilters={initialFilters} />

    <section className="border-t border-slate-200 bg-[#f3f8fa] px-5 py-8 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5">
        <div><h2 className="text-xl font-bold text-[#12263a]">Confirm the equipment configuration</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#526b7d]">Interfaces, software, instruments, loading and integration are subject to the agreed project scope. Published model specifications remain the equipment baseline.</p></div>
        <div className="flex flex-wrap gap-5 text-sm font-bold text-[#1268a8]"><Link href="/products" className="inline-flex min-h-11 items-center gap-2">Equipment catalog<ArrowRight size={16} aria-hidden="true" /></Link><Link href="/solutions#application-architectures" className="inline-flex min-h-11 items-center gap-2">Application architectures<ArrowRight size={16} aria-hidden="true" /></Link></div>
      </div>
    </section>
  </>;
}
