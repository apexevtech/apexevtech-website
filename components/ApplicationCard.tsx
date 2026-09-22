import Image from "next/image";
import Link from "next/link";
import type { ApplicationExample } from "@/data/applications";

export function ApplicationCard({ application, headingLevel = "h2", priority = false }: { application: ApplicationExample; headingLevel?: "h2" | "h3"; priority?: boolean }) {
  const Heading = headingLevel;
  const containImage = application.slug === "evse-production-end-of-line-architecture";
  return <article className="overflow-hidden rounded-md border border-slate-200 bg-white transition hover:border-[#9edbe5] hover:shadow-md hover:shadow-slate-900/5">
    <Link href={`/applications/${application.slug}`} className={`relative block aspect-[16/9] overflow-hidden ${containImage ? "bg-white" : "bg-slate-100"}`}>
      <Image src={application.image} alt={application.imageAlt} fill priority={priority} sizes="(min-width: 768px) 50vw, 100vw" className={containImage ? "object-contain p-3" : "object-cover"} />
    </Link>
    <div className="p-6">
      <p className="text-xs font-black uppercase tracking-wide text-[#1268a8]">{application.category}</p>
      <Heading className="mt-2 text-2xl font-black text-[#12263a]"><Link href={`/applications/${application.slug}`} className="hover:text-[#1268a8]">{application.title}</Link></Heading>
      <p className="mt-3 leading-7 text-[#526b7d]">{application.description}</p>
      <Link href={`/applications/${application.slug}`} className="mt-5 inline-flex text-sm font-black text-[#1268a8]">View the application architecture →</Link>
    </div>
  </article>;
}
