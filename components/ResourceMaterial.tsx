import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, FileText, ListChecks, Workflow } from "lucide-react";
import { SourceCitation } from "@/components/SourceCitation";
import { TrackedLink } from "@/components/TrackedLink";
import type { ResourceBrowserEntry } from "@/lib/resources/browser";

const materialLabels = {
  guide: { label: "Technical guide", icon: BookOpen },
  source: { label: "Solution brief", icon: FileText },
  scenario: { label: "Application", icon: Workflow },
};

export function ResourceMaterial({ entry, category, number }: { entry: ResourceBrowserEntry; category: string; number: number }) {
  const type = materialLabels[entry.kind];
  const material = entry.kind === "guide" ? undefined : entry.material;
  const image = material?.source.image;

  return <article id={`material-${entry.id}`} data-material-type={entry.kind} className="grid min-w-0 scroll-mt-28 gap-x-5 py-6 sm:grid-cols-[28px_minmax(0,1fr)] lg:gap-x-7 lg:py-7">
    <span aria-hidden="true" className="hidden pt-0.5 text-sm font-semibold tabular-nums text-[#7a8c9a] sm:block">{String(number).padStart(2, "0")}</span>
    <div className="min-w-0">
      <div className={`grid min-w-0 gap-4 ${image ? "md:grid-cols-[minmax(0,1fr)_192px] lg:grid-cols-[minmax(0,1fr)_224px] lg:gap-7" : ""}`}>
        <div className="min-w-0">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-5">
            <p className="inline-flex items-center gap-1.5 font-semibold text-[#1268a8]"><type.icon size={14} aria-hidden="true" />{type.label}</p>
            <p className="font-medium text-[#15803d]">{category}</p>
          </div>
          {entry.kind === "guide" ? <>
            <h3 className="mt-1.5 max-w-4xl break-words text-lg font-bold leading-7 text-[#12263a]"><Link href={`/resources/${entry.resource.slug}`} className="hover:text-[#1268a8]">{entry.resource.title}</Link></h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[#526b7d]">{entry.resource.description}</p>
            <Link href={`/resources/${entry.resource.slug}`} className="mt-2 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-[#1268a8] hover:underline">Read the guide<ArrowRight size={16} aria-hidden="true" /></Link>
          </> : <>
            <h3 className="mt-1.5 max-w-4xl break-words text-lg font-bold leading-7 text-[#12263a]">{entry.material.title}</h3>
            <p className="mt-2 max-w-4xl text-sm leading-6 text-[#526b7d]">{entry.material.summary}</p>
            <TrackedLink href={entry.material.relatedHref} eventName="library_material_click" location="resources" eventParameters={{ material_id: entry.id, material_type: entry.kind === "source" ? "solution" : "application", material_category: entry.originalCategoryId }} className="mt-2 inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-bold leading-6 text-[#1268a8] hover:underline"><span>{entry.material.relatedLabel}</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></TrackedLink>
          </>}
        </div>
        {image ? <figure className="w-full max-w-sm min-w-0 self-start md:pt-1"><div className="aspect-[16/9] overflow-hidden rounded-md border border-slate-200 bg-[#f7fafc]"><Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 1024px) 224px, (min-width: 768px) 192px, (min-width: 424px) 384px, calc(100vw - 40px)" className="h-full w-full object-contain" /></div></figure> : null}
      </div>
      {material ? <div className="mt-3 border-t border-slate-100">
        <details className="group/checklist min-w-0">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-sm font-semibold text-[#385064] [&::-webkit-details-marker]:hidden"><span className="flex items-center gap-2"><ListChecks size={16} aria-hidden="true" />Planning checklist</span><ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/checklist:rotate-180" /></summary>
          <div className="max-w-4xl pb-5 sm:pl-6">
            <h4 className="mt-1 text-sm font-bold text-[#385064]">Requirements to confirm</h4>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-[#526b7d]">{material.requirements.map((requirement) => <li key={requirement}>{requirement}</li>)}</ul>
            <h4 className="mt-4 text-sm font-bold text-[#385064]">Review output</h4>
            <p className="mt-2 text-sm leading-6 text-[#526b7d]">{material.reviewOutput}</p>
            <p className="mt-4 text-xs leading-5 text-[#526b7d]"><strong className="font-semibold text-[#385064]">Scope:</strong> {material.planningNote}</p>
          </div>
        </details>
        <details className="group/context min-w-0 border-t border-slate-100">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-2.5 text-xs font-semibold text-[#526b7d] [&::-webkit-details-marker]:hidden">Technical context<ChevronDown size={16} aria-hidden="true" className="shrink-0 transition-transform group-open/context:rotate-180" /></summary>
          <div className="max-w-4xl pb-5"><SourceCitation source={material.source} compact showImage={false} showTitle={false} /></div>
        </details>
      </div> : null}
    </div>
  </article>;
}
