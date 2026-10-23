"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, FileText, ListChecks, Workflow } from "lucide-react";
import { SourceCitation } from "@/components/SourceCitation";
import { TrackedLink } from "@/components/TrackedLink";
import type { ResourceBrowserEntry } from "@/lib/resources/browser";
import { getResourceMaterialImage } from "@/lib/resources/images";
import { getEngineeringCaseMaterialDetailHref } from "@/lib/engineering-cases/detail-path";

const materialLabels = {
  guide: { label: "Technical guide", icon: BookOpen },
  source: { label: "Solution brief", icon: FileText },
  scenario: { label: "Application", icon: Workflow },
};

export function ResourceMaterial({ entry, category }: { entry: ResourceBrowserEntry; category: string }) {
  const { t } = useLanguage();
  const type = materialLabels[entry.kind];
  const material = entry.kind === "guide" ? undefined : entry.material;
  const scenarioHref = entry.kind === "scenario" ? getEngineeringCaseMaterialDetailHref(entry.id) : undefined;
  const image = getResourceMaterialImage(entry);
  const title = entry.kind === "guide" ? entry.resource.title : entry.material.title;
  const summary = entry.kind === "guide" ? entry.resource.description : entry.material.summary;
  const titleId = `material-${entry.id}-title`;
  const preview = <>
    <span className="block aspect-[8/5] overflow-hidden bg-[#f2f6f8]"><Image src={image.src} alt={t(image.alt)} width={image.width} height={image.height} sizes="(min-width: 1536px) 451px, (min-width: 1024px) calc((100vw - 184px) / 3), (min-width: 640px) calc((100vw - 80px) / 2), calc(100vw - 48px)" className="h-full w-full object-contain" /></span>
    <span className="mt-5 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5">
      <span className="inline-flex items-center gap-1.5 font-semibold text-[#1268a8]"><type.icon size={15} strokeWidth={2} aria-hidden="true" />{t(type.label)}</span>
      <span className="text-[#526b7d]">{t(category)}</span>
    </span>
    <span className="mt-2 flex min-h-14 items-start gap-3">
      <span id={titleId} role="heading" aria-level={3} className="min-h-14 min-w-0 flex-1 line-clamp-2 break-words text-lg font-semibold leading-7 text-[#12263a] transition-colors group-open/material:line-clamp-none group-hover/material:text-[#1268a8]">{t(title)}</span>
      {entry.kind === "guide" ? <ArrowRight size={18} strokeWidth={2} aria-hidden="true" className="mt-1.5 shrink-0 text-[#1268a8]" /> : <ChevronDown size={18} strokeWidth={2} aria-hidden="true" className="mt-1.5 shrink-0 text-[#1268a8] transition-transform group-open/material:rotate-180" />}
    </span>
    <span className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-[#526b7d] group-open/material:line-clamp-none">{t(summary)}</span>
  </>;

  return <article id={`material-${entry.id}`} data-material-type={entry.kind} aria-labelledby={titleId} className="min-w-0 scroll-mt-28 bg-white">
    {entry.kind === "guide" ? <>
      <Link href={`/resources/${entry.resource.slug}`} title={t(title)} aria-labelledby={titleId} className="group/material block min-w-0 outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1268a8]">{preview}</Link>
      <Link href={`/resources/${entry.resource.slug}`} className="mt-3 inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><span>{t("Read the guide")}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link>
    </> : <details className="group/material min-w-0">
      <summary aria-label={`${t("Material details:")} ${t(title)}`} className="block min-w-0 cursor-pointer list-none outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1268a8] [&::-webkit-details-marker]:hidden">{preview}</summary>
      <div className="min-w-0 pb-2 pt-3">
        {scenarioHref ? <Link href={scenarioHref} className="mb-2 inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><span>{t("View scenario brief")}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link> : null}
        <TrackedLink href={entry.material.relatedHref} eventName="library_material_click" location="resources" eventParameters={{ material_id: entry.id, material_type: entry.kind === "source" ? "solution" : "application", material_category: entry.originalCategoryId }} className="inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><span>{t(entry.material.relatedLabel)}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></TrackedLink>
        {material ? <div className="mt-3 border-t border-slate-100">
          <details className="group/checklist min-w-0">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-sm font-semibold text-[#385064] [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><ListChecks size={16} aria-hidden="true" />{t("Planning checklist")}</span><ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/checklist:rotate-180" /></summary>
            <div className="pb-5">
              <h4 className="mt-1 text-sm font-bold text-[#385064]">{t("Requirements to confirm")}</h4>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#526b7d]">{material.requirements.map((requirement) => <li key={requirement}>{t(requirement)}</li>)}</ul>
              <h4 className="mt-4 text-sm font-bold text-[#385064]">{t("Review output")}</h4>
              <p className="mt-2 text-sm leading-6 text-[#526b7d]">{t(material.reviewOutput)}</p>
              <p className="mt-4 text-xs leading-5 text-[#526b7d]"><strong className="font-semibold text-[#385064]">{t("Scope:")}</strong> {t(material.planningNote)}</p>
            </div>
          </details>
          <details className="group/context min-w-0 border-t border-slate-100">
            <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-xs font-semibold text-[#526b7d] [&::-webkit-details-marker]:hidden">{t("Technical context")}<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/context:rotate-180" /></summary>
            <div className="pb-5"><SourceCitation source={material.source} compact showImage={false} showTitle={false} /></div>
          </details>
        </div> : null}
      </div>
    </details>}
  </article>;
}
