import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import { getRelatedResources, getResource, resources } from "@/lib/resources/catalog";
import { products } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return resources.map((resource) => ({ slug: resource.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const resource = getResource((await params).slug); return resource ? { title: resource.title, description: resource.description, alternates: { canonical: `/resources/${resource.slug}` } } : {}; }

export default async function ResourcePage({ params }: Props) {
  const resource = getResource((await params).slug); if (!resource) notFound();
  const related = getRelatedResources(resource);
  const relatedProducts = products.filter((product) => resource.relatedProductSlugs.includes(product.slug));
  const articleData = { "@context": "https://schema.org", "@type": "Article", headline: resource.title, description: resource.description, datePublished: resource.publishedAt, dateModified: resource.modifiedAt, mainEntityOfPage: `https://www.link-jl.com/resources/${resource.slug}` };
  const faqData = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: resource.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) };
  return <><StructuredData data={articleData} /><StructuredData data={faqData} /><article className="mx-auto max-w-4xl px-5 py-14 lg:px-8"><nav className="text-sm text-[#1479c9]"><Link href="/resources">Resources</Link> / {resource.title}</nav><p className="mt-8 text-sm font-black uppercase text-[#1479c9]">{resource.topic}</p><h1 className="mt-3 text-4xl font-black leading-tight text-[#12263a]">{resource.title}</h1><p className="mt-5 border-l-4 border-[#00a6c7] bg-[#f3f8fa] p-5 text-lg leading-8 text-[#385064]">{resource.summaryAnswer}</p><div className="mt-10 grid gap-10">{resource.sections.map((section) => <section key={section.heading}><h2 className="text-2xl font-black text-[#12263a]">{section.heading}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-3 leading-7 text-[#526b7d]">{paragraph}</p>)}{section.checklist ? <ul className="mt-4 grid gap-2 text-sm text-[#385064]">{section.checklist.map((item) => <li key={item}>✓ {item}</li>)}</ul> : null}</section>)}</div><section className="mt-12 border-t border-slate-200 pt-8"><h2 className="text-2xl font-black text-[#12263a]">Common questions</h2>{resource.faqs.map((faq) => <div key={faq.question} className="mt-5"><h3 className="font-black text-[#12263a]">{faq.question}</h3><p className="mt-2 leading-7 text-[#526b7d]">{faq.answer}</p></div>)}</section><section className="mt-12 grid gap-8 border-t border-slate-200 pt-8 md:grid-cols-2"><div><h2 className="text-xl font-black text-[#12263a]">Related guides</h2>{related.map((item) => <Link key={item.slug} href={`/resources/${item.slug}`} className="mt-3 block text-sm font-bold text-[#1479c9]">{item.title}</Link>)}</div><div><h2 className="text-xl font-black text-[#12263a]">Discuss your test scope</h2><p className="mt-3 text-sm leading-6 text-[#526b7d]">Share your connector, standard, electrical range and workflow with an APEX engineer.</p><Link href="/contact" className="mt-4 inline-flex rounded-md bg-[#1479c9] px-5 py-3 text-sm font-extrabold text-white">Talk to an engineer</Link>{relatedProducts.length ? <p className="mt-4 text-xs text-slate-500">Related equipment: {relatedProducts.map((product) => product.model).join(", ")}</p> : null}</div></section></article></>;
}
