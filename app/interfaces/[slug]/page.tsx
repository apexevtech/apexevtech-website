import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StructuredData } from "@/components/StructuredData";
import { getInterfaceTopic, interfaceTopics } from "@/data/interface-topics";
import { products } from "@/data/site";
import { getResource } from "@/lib/resources/catalog";
import { buildInterfaceStructuredData } from "@/lib/seo/interface-structured-data";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return interfaceTopics.map((topic) => ({ slug: topic.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const topic = getInterfaceTopic((await params).slug); return topic ? buildPageMetadata({ title: topic.title, description: topic.description, path: `/interfaces/${topic.slug}`, article: { publishedAt: topic.publishedAt, modifiedAt: topic.modifiedAt } }) : {}; }

export default async function InterfacePage({ params }: Props) {
  const topic = getInterfaceTopic((await params).slug); if (!topic) notFound();
  const relatedProducts = products.filter((product) => topic.relatedProductSlugs.includes(product.slug));
  const relatedResources = topic.relatedResourceSlugs.map((slug) => getResource(slug)).filter((resource) => Boolean(resource));
  const { pageData, breadcrumbData, faqData } = buildInterfaceStructuredData(topic, siteUrl);
  return <>
    <StructuredData data={pageData} /><StructuredData data={breadcrumbData} /><StructuredData data={faqData} />
    <article>
      <header className="bg-[#102a43] px-5 py-14 text-white lg:px-8"><div className="mx-auto max-w-5xl"><nav aria-label="Breadcrumb" className="text-sm text-sky-300"><Link href="/">Home</Link> / <Link href="/interfaces">Interfaces</Link> / <span aria-current="page">{topic.name}</span></nav><p className="mt-9 text-sm font-black uppercase tracking-wide text-sky-300">{topic.name} charger testing</p><h1 className="mt-3 text-4xl font-black leading-tight md:text-5xl">{topic.title}</h1><p className="mt-5 max-w-4xl text-lg leading-8 text-slate-200">{topic.summary}</p></div></header>
      <section className="mx-auto max-w-5xl px-5 py-12 lg:px-8"><h2 className="text-3xl font-black text-[#12263a]">Define the test scope</h2><div className="mt-7 grid gap-4 sm:grid-cols-2">{topic.scope.map((item) => <div key={item} className="border-l-4 border-[#00a6c7] bg-[#f3f8fa] p-5 font-bold text-[#385064]">{item}</div>)}</div></section>
      <section className="bg-slate-50 px-5 py-14 lg:px-8"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-black text-[#12263a]">Plan the equipment and evidence</h2><ol className="mt-8 grid gap-6 md:grid-cols-2">{topic.planningSteps.map((step, index) => <li key={step.title} className="rounded-md border border-slate-200 bg-white p-6"><span className="text-sm font-black text-[#1268a8]">STEP {index + 1}</span><h3 className="mt-2 text-xl font-black text-[#12263a]">{step.title}</h3><p className="mt-3 text-sm leading-6 text-[#526b7d]">{step.detail}</p></li>)}</ol></div></section>
      <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8"><h2 className="text-3xl font-black text-[#12263a]">{topic.name} test equipment</h2><p className="mt-3 max-w-3xl leading-7 text-[#526b7d]">Compare interface ratings, included functions, options and the external power path against the actual charger and procedure.</p><div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{relatedProducts.map((product) => <Link key={product.slug} href={`/products/${product.slug}`} className="rounded-md border border-slate-200 p-6 hover:border-[#1479c9]"><span className="text-lg font-black text-[#1268a8]">{product.model} →</span><span className="mt-2 block font-bold text-[#12263a]">{product.title}</span><span className="mt-3 block text-sm leading-6 text-[#526b7d]">{product.shortDescription}</span></Link>)}</div></section>
      <section className="border-y border-slate-200 bg-[#f3f8fa] px-5 py-14 lg:px-8"><div className="mx-auto max-w-5xl"><h2 className="text-3xl font-black text-[#12263a]">Technical planning guides</h2><div className="mt-6 grid gap-4 md:grid-cols-3">{relatedResources.map((resource) => resource ? <Link key={resource.slug} href={`/resources/${resource.slug}`} className="rounded-md border border-slate-200 bg-white p-5 font-bold text-[#1268a8] hover:border-[#1479c9]">{resource.title} →</Link> : null)}</div></div></section>
      <section className="mx-auto max-w-5xl px-5 py-14 lg:px-8"><h2 className="text-3xl font-black text-[#12263a]">Common questions</h2>{topic.faqs.map((faq) => <div key={faq.question} className="mt-6 border-t border-slate-200 pt-5"><h3 className="font-black text-[#12263a]">{faq.question}</h3><p className="mt-2 leading-7 text-[#526b7d]">{faq.answer}</p></div>)}<div className="mt-10 rounded-md bg-[#102a43] p-7 text-white"><h2 className="text-2xl font-black">Confirm your {topic.name} test configuration</h2><p className="mt-3 text-slate-300">Send the charger rating, protocol editions, workflow and required evidence for a project-specific recommendation.</p><Link href="/contact#inquiry-form" className="mt-5 inline-flex rounded-md bg-[#1479c9] px-5 py-3 font-black text-white">Talk to an engineer</Link></div></section>
    </article>
  </>;
}
