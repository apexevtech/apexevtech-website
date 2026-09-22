import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import { applicationExamples, getApplicationExample } from "@/data/applications";
import { products } from "@/data/site";
import { getResource } from "@/lib/resources/catalog";
import { buildApplicationStructuredData } from "@/lib/seo/application-structured-data";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return applicationExamples.map((application) => ({ slug: application.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const application = getApplicationExample((await params).slug);
  return application ? buildPageMetadata({ title: application.title, description: application.description, path: `/applications/${application.slug}`, image: application.image, article: { publishedAt: application.publishedAt, modifiedAt: application.modifiedAt } }) : {};
}

export default async function ApplicationPage({ params }: Props) {
  const application = getApplicationExample((await params).slug);
  if (!application) notFound();
  const relatedProducts = products.filter((product) => application.relatedProductSlugs.includes(product.slug));
  const relatedResources = application.relatedResourceSlugs.map((slug) => getResource(slug)).filter((resource) => Boolean(resource));
  const { articleData, breadcrumbData } = buildApplicationStructuredData(application, siteUrl);
  const containImage = application.slug === "evse-production-end-of-line-architecture";

  return <>
    <StructuredData data={articleData} />
    <StructuredData data={breadcrumbData} />
    <article>
      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[#1268a8]"><Link href="/">Home</Link> / <Link href="/applications">Applications</Link> / <span aria-current="page">{application.title}</span></nav>
        <div className="mt-9 grid items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-[#1268a8]">{application.category}</p>
            <h1 className="mt-3 text-4xl font-black leading-tight text-[#12263a] md:text-5xl">{application.title}</h1>
            <p className="mt-5 text-lg leading-8 text-[#526b7d]">{application.summary}</p>
            <p className="mt-6 inline-flex rounded bg-[#e7f0f5] px-3 py-2 text-xs font-black uppercase tracking-wide text-[#385064]">Reference application architecture</p>
          </div>
          <div className={`relative aspect-[16/10] overflow-hidden rounded-lg ${containImage ? "bg-white" : "bg-slate-100"}`}><Image src={application.image} alt={application.imageAlt} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className={containImage ? "object-contain p-4" : "object-cover"} /></div>
        </div>
      </div>

      <section className="bg-[#f3f8fa] px-5 py-12 lg:px-8"><div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-2">
        <div><h2 className="text-2xl font-black text-[#12263a]">Who this workflow is for</h2><ul className="mt-5 grid gap-3 text-[#526b7d]">{application.intendedFor.map((item) => <li key={item}>✓ {item}</li>)}</ul></div>
        <div><h2 className="text-2xl font-black text-[#12263a]">Engineering objectives</h2><ul className="mt-5 grid gap-3 text-[#526b7d]">{application.objectives.map((item) => <li key={item}>✓ {item}</li>)}</ul></div>
      </div></section>

      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><h2 className="text-3xl font-black text-[#12263a]">Reference system configuration</h2><p className="mt-3 max-w-3xl leading-7 text-[#526b7d]">Final ratings, instruments, options and facility interfaces must be agreed against the actual test plan.</p><div className="mt-8 grid gap-5 md:grid-cols-2">{application.configuration.map((item) => <div key={item.component} className="rounded-md border border-slate-200 p-6"><h3 className="font-black text-[#12263a]">{item.component}</h3><p className="mt-2 text-sm leading-6 text-[#526b7d]">{item.purpose}</p></div>)}</div></section>

      <section className="bg-[#102a43] px-5 py-14 text-white lg:px-8"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-black">Suggested execution workflow</h2><ol className="mt-8 grid gap-7">{application.workflow.map((item, index) => <li key={item.step} className="grid gap-3 sm:grid-cols-[3rem_1fr]"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00a6c7] font-black">{index + 1}</span><div><h3 className="font-black">{item.step}</h3><p className="mt-2 leading-7 text-slate-300">{item.detail}</p></div></li>)}</ol></div></section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-2 lg:px-8"><div><h2 className="text-2xl font-black text-[#12263a]">Expected project outputs</h2><ul className="mt-5 grid gap-3 text-[#526b7d]">{application.outputs.map((item) => <li key={item}>✓ {item}</li>)}</ul></div><div><h2 className="text-2xl font-black text-[#12263a]">Confirm before configuration</h2><ul className="mt-5 grid gap-3 text-[#526b7d]">{application.confirmBeforeProject.map((item) => <li key={item}>✓ {item}</li>)}</ul></div></section>

      <section className="border-y border-slate-200 bg-slate-50 px-5 py-14 lg:px-8"><div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2"><div><h2 className="text-2xl font-black text-[#12263a]">Relevant equipment</h2><div className="mt-5 grid gap-4">{relatedProducts.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-md border border-slate-200 bg-white p-5 hover:border-[#1479c9]"><span className="font-black text-[#1268a8]">{product.model} →</span><span className="mt-1 block text-sm text-[#526b7d]">{product.title}</span></Link>)}</div></div><div><h2 className="text-2xl font-black text-[#12263a]">Planning guides</h2><div className="mt-5 grid gap-4">{relatedResources.map((resource) => resource ? <Link key={resource.slug} href={`/resources/${resource.slug}`} className="rounded-md border border-slate-200 bg-white p-5 font-bold text-[#1268a8] hover:border-[#1479c9]">{resource.title} →</Link> : null)}</div></div></div></section>

      <section className="px-5 py-14 text-center lg:px-8"><h2 className="text-3xl font-black text-[#12263a]">Configure this workflow for your project</h2><p className="mx-auto mt-4 max-w-2xl leading-7 text-[#526b7d]">Share the charger interface, standards, electrical range, test environment and evidence requirements with an APEX engineer.</p><Link href="/contact#inquiry-form" className="mt-6 inline-flex rounded-md bg-[#1479c9] px-6 py-3 font-black text-white hover:bg-[#0f5f9f]">Talk to an engineer</Link></section>
    </article>
  </>;
}
