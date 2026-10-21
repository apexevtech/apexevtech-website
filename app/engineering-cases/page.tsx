import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { EngineeringCaseBrowser } from "@/components/EngineeringCaseBrowser";
import { engineeringCaseIndexTitle, parseEngineeringCaseFilters } from "@/lib/engineering-cases/filter";
import { searchParamsFromRecord } from "@/lib/navigation/pagination";
import { getCatalogMetadataState } from "@/lib/seo/catalog-metadata";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

type EngineeringCasesPageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };
const description = "Explore partner-published EV charger engineering references for vehicle engineering, independent testing, public inspection and charger manufacturing.";

export async function generateMetadata({ searchParams }: EngineeringCasesPageProps): Promise<Metadata> {
  const filters = parseEngineeringCaseFilters(searchParamsFromRecord(await searchParams));
  const hasFilters = filters.category !== "all" || Boolean(filters.query);
  return buildPageMetadata({ ...getCatalogMetadataState("/engineering-cases", engineeringCaseIndexTitle, filters.page, hasFilters), description, image: "/assets/library/case-1-system.png" });
}

export default async function EngineeringCasesPage({ searchParams }: EngineeringCasesPageProps) {
  const filters = parseEngineeringCaseFilters(searchParamsFromRecord(await searchParams));
  return <>
    <section className="border-b border-slate-200 bg-white px-5 pb-7 pt-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#526b7d]"><Link href="/" className="inline-flex min-h-8 items-center hover:text-[#1268a8]">Home</Link><ChevronRight size={13} aria-hidden="true" /><span aria-current="page">Engineering cases</span></nav>
        <h1 className="mt-3 text-2xl font-black leading-tight text-[#12263a] sm:text-3xl">Engineering case references</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-[#526b7d]">Partner-published technical references; not verified APEX delivery records.</p>
      </div>
    </section>
    <EngineeringCaseBrowser initialFilters={filters} />
    <section className="border-t border-slate-200 bg-[#f3f8fa] px-5 py-6 lg:px-8" aria-label="Related technical materials">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2">
        <Link href="/solutions" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline">Testing solutions<ArrowRight size={16} aria-hidden="true" /></Link>
        <Link href="/resources" className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline">Technical resources<ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
    </section>
  </>;
}
