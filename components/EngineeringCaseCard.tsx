import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CarFront, ChevronDown, Factory, FlaskConical, ShieldCheck } from "lucide-react";
import type { EngineeringCase } from "@/data/engineering-cases";

const categoryIcons = {
  "vehicle-engineering": CarFront,
  "independent-testing": FlaskConical,
  "public-inspection": ShieldCheck,
  "charger-manufacturing": Factory,
};

export function EngineeringCaseCard({ entry }: { entry: EngineeringCase }) {
  const Icon = categoryIcons[entry.categoryId];
  const titleId = `${entry.slug}-title`;

  return <article id={entry.slug} aria-labelledby={titleId} className="min-w-0 scroll-mt-28 bg-white">
    <details className="group/case min-w-0">
      <summary aria-label={`Technical details: ${entry.title}`} className="block min-w-0 cursor-pointer list-none outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1268a8] [&::-webkit-details-marker]:hidden">
        <span className="block aspect-[8/5] overflow-hidden bg-[#f2f6f8]">
          {entry.image ? <Image src={entry.image.src} alt={entry.image.alt} width={entry.image.width} height={entry.image.height} sizes="(min-width: 1536px) 451px, (min-width: 1024px) calc((100vw - 184px) / 3), (min-width: 640px) calc((100vw - 80px) / 2), calc(100vw - 48px)" className="h-full w-full object-contain transition-transform duration-300 group-hover/case:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover/case:scale-100" /> : <span className="flex h-full flex-col justify-between gap-3 p-5 text-[#385064] sm:p-6">
            <span className="flex items-center justify-between gap-4"><Icon size={32} strokeWidth={1.3} aria-hidden="true" /><span className="text-xs font-medium">Technical scope</span></span>
            <span className="line-clamp-2 text-sm leading-6">{entry.technicalFocus[0]}</span>
          </span>}
        </span>
        <span className="mt-6 flex min-h-7 items-start gap-3">
          <span id={titleId} role="heading" aria-level={3} className="min-w-0 flex-1 line-clamp-1 text-xl font-medium leading-7 text-[#354b5d] transition-colors group-open/case:line-clamp-none group-hover/case:text-[#1268a8]">{entry.title}</span>
          <ChevronDown size={17} strokeWidth={1.5} aria-hidden="true" className="mt-1.5 shrink-0 text-[#1268a8] transition-transform group-open/case:rotate-180" />
        </span>
        <span className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-[#657987] group-open/case:line-clamp-none">{entry.summary}</span>
      </summary>
      <div className="min-w-0 pb-2 pt-3">
        <h3 className="text-sm font-semibold leading-6 text-[#12263a]">Technical focus</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-[#526b7d]">{entry.technicalFocus.map((focus) => <li key={focus}>{focus}</li>)}</ul>
        <Link href={`/resources/${entry.relatedResourceSlug}`} className="mt-4 inline-flex min-h-11 max-w-full items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><span>Related testing guide</span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link>
      </div>
    </details>
  </article>;
}
