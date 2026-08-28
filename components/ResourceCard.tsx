import Link from "next/link";
import type { Resource } from "@/data/resources";

export function ResourceCard({ resource }: { resource: Resource }) {
  return <article className="border-t border-slate-200 py-6"><p className="text-xs font-black uppercase tracking-wide text-[#1479c9]">{resource.intent}</p><h2 className="mt-2 text-xl font-black text-[#12263a]"><Link href={`/resources/${resource.slug}`} className="hover:text-[#1479c9]">{resource.title}</Link></h2><p className="mt-2 text-sm leading-6 text-[#526b7d]">{resource.description}</p><Link href={`/resources/${resource.slug}`} className="mt-4 inline-block text-sm font-bold text-[#1479c9]">Read the guide →</Link></article>;
}
