import { T } from "@/components/LanguageProvider";
import Link from "@/components/LocaleLink";
import type { Resource } from "@/data/resources";

export function ResourceCard({ resource, headingLevel = "h2" }: { resource: Resource; headingLevel?: "h2" | "h3" }) {
  const Heading = headingLevel;
  return <article className="border-t border-slate-200 py-6"><p className="text-xs font-black uppercase tracking-wide text-[#1268a8]"><T>{resource.intent}</T></p><Heading className="mt-2 text-xl font-black text-[#12263a]"><Link href={`/resources/${resource.slug}`} className="hover:text-[#1268a8]"><T>{resource.title}</T></Link></Heading><p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{resource.description}</T></p><Link href={`/resources/${resource.slug}`} className="mt-4 inline-block text-sm font-bold text-[#1268a8]"><T>{"Read the guide →"}</T></Link></article>;
}
