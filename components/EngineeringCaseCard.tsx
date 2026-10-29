"use client";

import Image from "next/image";
import Link from "@/components/LocaleLink";
import { ArrowRight, CarFront, ChevronDown, Factory, FlaskConical, ShieldCheck } from "lucide-react";
import type { EngineeringCase } from "@/data/engineering-cases";
import { useLanguage } from "@/components/LanguageProvider";
import { TrackedLink } from "@/components/TrackedLink";
import { buildReferenceCaseInquiryHref } from "@/lib/inquiries/reference-case";
import { getEngineeringCaseDetailHref } from "@/lib/engineering-cases/detail-path";

const categoryIcons = {
  "vehicle-engineering": CarFront,
  "independent-testing": FlaskConical,
  "public-inspection": ShieldCheck,
  "charger-manufacturing": Factory,
};

export function EngineeringCaseCard({ entry }: { entry: EngineeringCase }) {
  const { t } = useLanguage();
  const Icon = categoryIcons[entry.categoryId];
  const titleId = `${entry.slug}-title`;
  const detailHref = getEngineeringCaseDetailHref(entry.slug);

  return <article id={entry.slug} aria-labelledby={titleId} className="min-w-0 scroll-mt-28 bg-white">
    <details className="group/case min-w-0">
      <summary aria-label={`${t("Technical details:")} ${t(entry.title)}`} className="block min-w-0 cursor-pointer list-none outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1268a8] [&::-webkit-details-marker]:hidden">
        <span className="block aspect-[8/5] overflow-hidden bg-[#f2f6f8]">
          {entry.image ? <Image src={entry.image.src} alt={t(entry.image.alt)} width={entry.image.width} height={entry.image.height} sizes="(min-width: 1536px) 451px, (min-width: 1024px) calc((100vw - 184px) / 3), (min-width: 640px) calc((100vw - 80px) / 2), calc(100vw - 48px)" className="h-full w-full object-contain" /> : <span className="flex h-full flex-col justify-between gap-3 p-5 text-[#385064] sm:p-6">
            <span className="flex items-center justify-between gap-4"><Icon size={32} strokeWidth={1.3} aria-hidden="true" /><span className="text-xs font-medium">{t("Technical scope")}</span></span>
            <span className="line-clamp-2 text-sm leading-6">{t(entry.technicalFocus[0])}</span>
          </span>}
        </span>
        <span className="mt-5 flex min-h-14 items-start gap-3">
          <span id={titleId} role="heading" aria-level={3} className="min-h-14 min-w-0 flex-1 line-clamp-2 break-words text-lg font-semibold leading-7 text-[#12263a] transition-colors group-open/case:line-clamp-none group-hover/case:text-[#1268a8]">{t(entry.title)}</span>
          <ChevronDown size={18} strokeWidth={2} aria-hidden="true" className="mt-1.5 shrink-0 text-[#1268a8] transition-transform group-open/case:rotate-180" />
        </span>
        <span className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#526b7d] group-open/case:line-clamp-none">{t(entry.summary)}</span>
      </summary>
      <div className="min-w-0 pb-2 pt-3">
        <p className="mb-3 text-xs leading-5 text-[#60717d]">{t("Reference scenario. Final configuration is subject to engineering review.")}</p>
        <h3 className="text-sm font-semibold leading-6 text-[#12263a]">{t("Technical focus")}</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-[#526b7d]">{entry.technicalFocus.map((focus) => <li key={focus}>{t(focus)}</li>)}</ul>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          {detailHref ? <Link href={detailHref} className="inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><span>{t("View scenario brief")}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link> : null}
          <TrackedLink href={buildReferenceCaseInquiryHref(entry.slug)} eventName="case_inquiry_click" location="engineering-case" eventParameters={{ reference_case: entry.slug }} className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-md bg-[#1268a8] px-4 py-2 text-sm font-semibold leading-6 text-white transition-colors hover:bg-[#0f5f9f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1268a8]"><span>{t("Discuss a similar configuration")}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></TrackedLink>
          <Link href={`/resources/${entry.relatedResourceSlug}`} className="inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><span>{t("Related testing guide")}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link>
        </div>
      </div>
    </details>
  </article>;
}
