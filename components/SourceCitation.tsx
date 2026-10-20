import { ExternalLink } from "lucide-react";
import type { TechnicalLibrarySource } from "@/data/technical-library";

export function SourceCitation({ source, compact = false, headingLevel }: { source: TechnicalLibrarySource; compact?: boolean; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel || "p";
  return <aside aria-label="Source reference" className={`${compact ? "mt-3" : "mt-5 border-l-2 border-[#00a6c7] pl-4"} min-w-0 text-sm`}>
    <p className="text-xs font-bold uppercase text-[#15803d]">Source: {source.publisher}</p>
    <Heading className={headingLevel ? "text-xl font-black leading-7" : undefined}><a href={source.href} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex min-h-11 max-w-full items-center gap-2 break-words font-bold text-[#1268a8] underline underline-offset-4"><span className="min-w-0">{source.title}</span><ExternalLink size={15} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></Heading>
    <p className="mt-1 leading-6 text-[#526b7d]">{source.summary}</p>
    <p className="mt-2 text-xs leading-5 text-[#526b7d]">{source.scopeNote}</p>
  </aside>;
}
