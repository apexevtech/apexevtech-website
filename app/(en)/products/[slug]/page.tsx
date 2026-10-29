import type { Metadata } from "next";
import Image from "next/image";
import Link from "@/components/LocaleLink";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ChevronDown, ClipboardCheck, ListChecks, MessageSquare, Settings2, TableProperties } from "lucide-react";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { ProductDocumentDownload } from "@/components/ProductDocumentDownload";
import { SectionHeading } from "@/components/SectionHeading";
import { SpecTable } from "@/components/SpecTable";
import { products, solutions } from "@/data/site";
import { getProductResources } from "@/lib/resources/catalog";
import { solutionLinks } from "@/data/solution-links";
import { StructuredData } from "@/components/StructuredData";
import { getProductSeo } from "@/lib/products/seo";
import { siteUrl } from "@/lib/seo/site-urls";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { ProductViewEvent } from "@/components/ProductViewEvent";
import { getProductApplications } from "@/data/applications";
import { getProductInterfaceTopics } from "@/data/interface-topics";
import { ProductConfigurationSummary } from "@/components/ProductConfigurationSummary";
import { T } from "@/components/LanguageProvider";

type ProductDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    return {};
  }
  const seo = getProductSeo(product.slug);
  return buildPageMetadata({
    title: seo?.title || product.seoTitle || `${product.model} ${product.category.split(" /")[0]}`,
    description: seo?.description || product.shortDescription,
    path: `/products/${product.slug}`,
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    notFound();
  }
  const relatedResources = getProductResources(product.slug);
  const relatedSolutions = solutions.filter((solution) => solutionLinks[solution.slug]?.productSlugs.includes(product.slug));
  const relatedApplications = getProductApplications(product.slug);
  const relatedInterfaceTopics = getProductInterfaceTopics(product.slug);
  const seo = getProductSeo(product.slug);
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Products", item: `${siteUrl}/products` },
      { "@type": "ListItem", position: 3, name: product.model, item: `${siteUrl}/products/${product.slug}` },
    ],
  };

  return (
    <>
      <ProductViewEvent product={product} />
      <StructuredData data={breadcrumbData} />
      {seo ? <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: seo.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} /> : null}
      <PageHero compact eyebrow={product.category} title={product.model} subtitle={product.title} description={product.shortDescription} />

      <nav aria-label="Product page sections" className="border-b border-slate-200 bg-white px-5 py-2 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 sm:flex sm:flex-wrap sm:gap-x-8">
          {[
            { href: "#product-configuration", label: "Configuration", icon: Settings2 },
            { href: "#technical-specifications", label: "Specifications", icon: TableProperties },
            { href: "#key-features", label: "Features", icon: ListChecks },
            { href: "#product-inquiry", label: "Request a quote", icon: MessageSquare },
          ].map(({ href, label, icon: Icon }) => <Link key={href} href={href} className="inline-flex min-h-11 min-w-0 items-center gap-2 py-2 text-sm font-semibold leading-5 text-[#1268a8] hover:underline"><Icon size={18} aria-hidden="true" className="shrink-0" /><T>{label}</T></Link>)}
        </div>
      </nav>

      <section className="px-5 py-8 sm:py-10 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.95fr_1.05fr] lg:gap-10">
          <div className="relative aspect-[4/3] self-start overflow-hidden rounded-md border border-slate-200 bg-[#eef4f7]">
            <Image src={product.image} alt={`${product.model} ${product.title} for EV charger testing`} fill priority sizes="(min-width: 1280px) 550px, (min-width: 1024px) calc(47vw - 56px), calc(100vw - 40px)" className="object-contain p-5 sm:p-8" />
          </div>
          <div id="product-configuration" className="min-w-0 scroll-mt-28">
            <h2 className="text-2xl font-bold leading-8 text-[#12263a]"><T>Configuration at a glance</T></h2>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="#product-inquiry" className="inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1479c9] px-5 py-3 text-sm font-semibold leading-6 text-white hover:bg-[#0f5f9f]">
                <MessageSquare size={18} aria-hidden="true" className="shrink-0" /><T>Request a quote</T>
              </Link>
              {product.document ? <ProductDocumentDownload href={product.document} model={product.model} /> : null}
            </div>
            <ProductConfigurationSummary product={product} />
            <p className="mt-4 text-xs leading-5 text-[#526b7d]"><T>Socket, measurement and load limits are different specifications. Confirm the complete test circuit and included options before ordering.</T></p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-5 py-10 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <div className={`grid gap-10 ${seo?.selection ? "lg:grid-cols-2" : ""}`}>
            <div id="technical-specifications" className="min-w-0 scroll-mt-28">
              <SectionHeading compact eyebrow="Technical Specifications" title="Core specifications" />
              <SpecTable specs={product.specs} />
            </div>
            {seo?.selection ? <div className="min-w-0">
              <h2 className="text-2xl font-semibold leading-8 text-[#12263a]"><T>Choose the right test configuration</T></h2>
              <div className="mt-5 divide-y divide-slate-200">
                {[
                  ["Interface and workflow", seo.selection.workflow],
                  ["External load and connection limits", seo.selection.load],
                  ["Options and accessories", seo.selection.options],
                ].map(([title, text]) => <div key={title} className="py-4 first:pt-0">
                  <h3 className="font-semibold leading-6 text-[#12263a]"><T>{title}</T></h3>
                  <p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{text}</T></p>
                </div>)}
              </div>
              <div className="mt-4 flex flex-col items-start gap-3 text-sm font-semibold leading-6 text-[#1268a8]">
                {seo.selection.alternatives.map((alternative) => <Link key={alternative.slug} href={`/products/${alternative.slug}`} className="inline-flex min-h-11 items-center gap-2 hover:underline"><span><T>{alternative.label}</T></span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link>)}
              </div>
              <Link href="#product-inquiry" className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f5f9f]"><MessageSquare size={18} aria-hidden="true" className="shrink-0" /><T>Request a configuration review</T></Link>
            </div> : null}
          </div>
          <details className="group/procurement mt-8 border-t border-slate-200">
            <summary className="flex min-h-14 cursor-pointer list-none items-center gap-3 py-4 font-semibold leading-6 text-[#12263a] [&::-webkit-details-marker]:hidden">
              <ClipboardCheck size={20} aria-hidden="true" className="shrink-0 text-[#1268a8]" /><span className="flex-1"><T>Procurement checklist</T></span><ChevronDown size={18} aria-hidden="true" className="shrink-0 text-[#1268a8] transition-transform group-open/procurement:rotate-180" />
            </summary>
            <h3 className="mt-2 text-lg font-semibold leading-7 text-[#12263a]"><T>Confirm the delivered configuration before ordering</T></h3>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                ["Interface and standards", "Confirm the connector, market, protocol and exact standard editions required by the charger and test plan."],
                ["Electrical and load path", "Separate socket, cable and measurement ratings from the source or external load used during sustained power tests."],
                ["Evidence and options", "List required metering accuracy, message or waveform capture, fault cases, report fields and optional modules."],
                ["Acceptance and support", "Agree supplied accessories, software, factory acceptance checks, commissioning, training and support boundaries."],
              ].map(([title, text]) => <div key={title} className="border-t-2 border-[#00a6c7] pt-4"><h4 className="font-semibold text-[#12263a]"><T>{title}</T></h4><p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{text}</T></p></div>)}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link href="#product-inquiry" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#1268a8] hover:underline"><T>Send configuration requirements</T></Link>
              <Link href={`/products?compare=${product.slug}#compare`} className="inline-flex min-h-11 items-center text-sm font-semibold text-[#1268a8] hover:underline"><T>Compare</T> {product.model} →</Link>
              <Link href="/resources/ev-charger-test-equipment-guide" className="inline-flex min-h-11 items-center text-sm font-semibold text-[#1268a8] hover:underline"><T>Read the equipment buying guide →</T></Link>
            </div>
          </details>
        </div>
      </section>

      <section className="px-5 py-10 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="min-w-0">
            <SectionHeading compact eyebrow="Product Overview" title={product.title} description={product.overview} />
            {seo ? <p className="text-sm leading-7 text-[#526b7d]"><T>{seo.intro}</T></p> : null}
            <ul className="mt-6 grid gap-3 border-t border-slate-200 pt-5 sm:grid-cols-2">
              {product.highlights.map((highlight) => <li key={highlight} className="flex items-start gap-2 text-sm font-semibold leading-6 text-[#12263a]"><Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-[#1268a8]" /><span><T>{highlight}</T></span></li>)}
            </ul>
          </div>
          <div id="key-features" className="min-w-0 scroll-mt-28">
            <SectionHeading compact eyebrow="Key Features" title="Designed for reliable EV charger validation." />
            <ul className="divide-y divide-slate-200">
              {product.features.map((feature, index) => (
                <li key={feature} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center text-xs font-semibold text-[#1268a8]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm leading-6 text-slate-700"><T>{feature}</T></span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="product-inquiry" className="scroll-mt-28 border-y border-slate-200 bg-slate-50 px-5 py-10 lg:px-8 lg:py-12">
        <div className="mx-auto grid max-w-7xl gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <div>
            <SectionHeading compact eyebrow="Inquiry Form" title="Request pricing, lead time or technical support." />
            <p className="text-sm leading-7 text-slate-600"><T>Include your target standard, voltage/current range and testing environment for a faster recommendation.</T></p>
          </div>
          <InquiryForm context={`Product inquiry: ${product.model}`} />
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Application Scenarios" title="Where this product is used" />
          <div className="grid gap-5 md:grid-cols-4">
            {product.applications.map((application) => (
              <div key={application} className="border-l-4 border-[#00a6c7] bg-[#102a43] p-6 font-black text-white">
                <T>{application}</T>
              </div>
            ))}
          </div>
        </div>
      </section>

      {seo ? <section className="px-5 pb-12 lg:px-8"><div className="mx-auto max-w-7xl"><SectionHeading compact eyebrow="Product FAQ" title={`Common questions about ${product.model}`} /><div className="divide-y divide-slate-200 border-y border-slate-200">{seo.faqs.map((faq) => <details key={faq.question} className="group/faq"><summary className="flex min-h-14 cursor-pointer list-none items-center gap-4 py-4 text-sm font-semibold leading-6 text-[#12263a] [&::-webkit-details-marker]:hidden"><span role="heading" aria-level={3} className="flex-1"><T>{faq.question}</T></span><ChevronDown size={18} aria-hidden="true" className="shrink-0 text-[#1268a8] transition-transform group-open/faq:rotate-180" /></summary><p className="max-w-4xl pb-5 text-sm leading-7 text-[#526b7d]"><T>{faq.answer}</T></p></details>)}</div></div></section> : null}

      <section className="px-5 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-black text-[#12263a]"><T>Test workflows and application solutions</T></h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {relatedSolutions.map((solution) => (
              <Link key={solution.slug} href={`/solutions#${solution.slug}`} className="rounded-md border border-slate-200 bg-white p-5 hover:border-[#1479c9]">
                <h3 className="font-black text-[#1268a8]"><T>{solution.title}</T> →</h3>
                <p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{solution.value}</T></p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {relatedInterfaceTopics.length ? <section className="px-5 pb-12 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="text-2xl font-black text-[#12263a]"><T>Interface testing guides</T></h2><div className="mt-5 grid gap-4 md:grid-cols-2">{relatedInterfaceTopics.map((topic) => <Link key={topic.slug} href={`/interfaces/${topic.slug}`} className="rounded-md border border-slate-200 p-5 hover:border-[#1479c9]"><h3 className="font-black text-[#1268a8]"><T>{topic.name}</T><T>: equipment and workflow →</T></h3><p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{topic.description}</T></p></Link>)}</div></div></section> : null}

      <section className="bg-[#f3f8fa] px-5 py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-black text-[#12263a]"><T>Reference application architectures</T></h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-[#526b7d]"><T>See how this equipment can fit into a laboratory, production or field workflow. Final configuration depends on the actual test scope.</T></p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {relatedApplications.map((application) => <Link key={application.slug} href={`/applications/${application.slug}`} className="rounded-md border border-slate-200 bg-white p-5 hover:border-[#1479c9]"><h3 className="font-black text-[#1268a8]"><T>{application.title}</T> →</h3><p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{application.description}</T></p></Link>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="text-2xl font-black text-[#12263a]"><T>Related engineering resources</T></h2><div className="mt-4 grid gap-4 md:grid-cols-3">{relatedResources.map((resource) => <Link key={resource.slug} href={`/resources/${resource.slug}`} className="border-t border-slate-200 pt-4 text-sm font-bold text-[#1268a8]"><T>{resource.title}</T></Link>)}</div></div></section>
    </>
  );
}
