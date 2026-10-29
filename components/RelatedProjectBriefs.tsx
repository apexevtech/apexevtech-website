import Link from "@/components/LocaleLink";
import { ArrowRight, BriefcaseBusiness } from "lucide-react";
import { T } from "@/components/LanguageProvider";
import { getResourceProjectBriefs } from "@/lib/engineering-cases/briefs";

export function RelatedProjectBriefs({ resourceSlug }: { resourceSlug: string }) {
  const references = getResourceProjectBriefs(resourceSlug);
  if (!references.length) return null;
  return <section className="print-hide mt-8 border-t border-slate-200 pt-6" aria-labelledby="related-project-briefs">
    <h2 id="related-project-briefs" className="flex items-center gap-2 text-xl font-semibold leading-7 text-[#12263a]"><BriefcaseBusiness size={21} aria-hidden="true" className="shrink-0 text-[#1268a8]" /><T>Related scenario brief</T></h2>
    <ul className="mt-3">{references.map(({ brief, entry }) => <li key={entry.slug}><Link href={`/project-cases/${entry.slug}`} className="inline-flex min-h-11 items-center gap-3 py-2 text-sm font-semibold leading-7 text-[#1268a8] hover:underline"><span><T>{brief.title}</T></span><ArrowRight size={17} aria-hidden="true" className="shrink-0" /></Link></li>)}</ul>
  </section>;
}
