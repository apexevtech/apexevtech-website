import Image from "next/image";
import type { TechnicalLibrarySource } from "@/data/technical-library";

export function SourceCitation({ source, compact = false, headingLevel }: { source: TechnicalLibrarySource; compact?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel || "p";
  return <aside aria-label="Material details" className={`${compact ? "mt-3" : "mt-5 border-l-2 border-[#00a6c7] pl-4"} min-w-0 text-sm`}>
    <div className={source.image ? `grid gap-4 ${compact ? "" : "lg:grid-cols-[minmax(0,1fr)_240px]"}` : undefined}>
      <div className="min-w-0">
        <Heading className={`break-words font-bold text-[#12263a] ${headingLevel ? "text-xl leading-7" : "text-base leading-6"}`}>{source.title}</Heading>
        <p className="mt-2 leading-6 text-[#526b7d]">{source.summary}</p>
        <p className="mt-2 text-xs leading-5 text-[#526b7d]">{source.scopeNote}</p>
      </div>
      {source.image ? <figure className={`min-w-0 order-first ${compact ? "" : "lg:order-last"}`}>
        <div className="aspect-[16/9] overflow-hidden rounded-md border border-slate-200 bg-white"><Image src={source.image.src} alt={source.image.alt} width={source.image.width} height={source.image.height} sizes={compact ? "(min-width: 1280px) 592px, (min-width: 768px) 45vw, calc(100vw - 40px)" : "(min-width: 1024px) 240px, calc(100vw - 60px)"} className="h-full w-full object-contain" /></div>
      </figure> : null}
    </div>
  </aside>;
}
