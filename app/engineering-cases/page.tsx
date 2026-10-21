import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
  return buildPageMetadata({ ...getCatalogMetadataState("/engineering-cases", engineeringCaseIndexTitle, filters.page, hasFilters), description, image: "/assets/engineering-cases/cases-banner.webp" });
}

export default async function EngineeringCasesPage({ searchParams }: EngineeringCasesPageProps) {
  const filters = parseEngineeringCaseFilters(searchParamsFromRecord(await searchParams));
  return <>
    <section className="relative isolate flex h-[180px] items-center justify-center overflow-hidden bg-[#5c7377] px-5 text-center sm:h-[300px] lg:h-[min(54vh,560px)]">
      <Image src="/assets/engineering-cases/cases-banner.webp" alt="Partner laboratory reference with EV charging test cabinets and measurement equipment" fill preload sizes="100vw" className="-z-20 object-cover object-[center_52%]" />
      <div className="absolute inset-0 -z-10 bg-black/25" aria-hidden="true" />
      <div className="max-w-3xl text-white">
        <h1 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-[40px]">Engineering Cases</h1>
        <p className="mt-3 text-sm font-normal leading-6 sm:mt-4 sm:text-lg">Laboratory, production and field testing</p>
      </div>
    </section>
    <EngineeringCaseBrowser initialFilters={filters} />
    <section className="border-t border-[#e8edef] bg-[#f5f7f8] px-6 py-8 lg:px-11" aria-label="Related technical materials">
      <div className="mx-auto flex max-w-[1448px] flex-wrap items-center justify-between gap-x-8 gap-y-4">
        <p className="max-w-2xl text-xs leading-6 text-[#60717d]">Partner-published technical references; not verified APEX delivery records.</p>
        <div className="flex flex-wrap gap-x-8 gap-y-2">
          <Link href="/solutions" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1268a8] hover:underline">Testing solutions<ArrowRight size={16} aria-hidden="true" /></Link>
          <Link href="/resources" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[#1268a8] hover:underline">Technical resources<ArrowRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  </>;
}
