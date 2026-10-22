import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
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

      <nav aria-label="Product page sections" className="border-b border-slate-200 bg-white px-5 py-3 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-[#1268a8]">
          <Link href="#product-configuration" className="py-2 hover:underline"><T>Configuration</T></Link>
          <Link href="#key-features" className="py-2 hover:underline"><T>Features</T></Link>
          <Link href="#technical-specifications" className="py-2 hover:underline"><T>Specifications</T></Link>
          <Link href="#product-inquiry" className="py-2 hover:underline"><T>Request a quote</T></Link>
        </div>
      </nav>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative aspect-[4/3] self-start overflow-hidden rounded-md border border-slate-200 bg-[#eef4f7]">
            <Image src={product.image} alt={`${product.model} ${product.title} for EV charger testing`} fill priority sizes="(min-width: 1280px) 550px, (min-width: 1024px) calc(47vw - 56px), calc(100vw - 40px)" className="object-contain p-5 sm:p-8" />
          </div>
          <div id="product-configuration">
            <h2 className="text-2xl font-black text-[#12263a]"><T>Configuration at a glance</T></h2>
            <ProductConfigurationSummary product={product} />
            <p className="mt-4 text-xs leading-5 text-[#526b7d]"><T>Socket, measurement and load limits are different specifications. Confirm the complete test circuit and included options before ordering.</T></p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="#product-inquiry" className="rounded-md bg-[#1479c9] px-5 py-3 font-extrabold text-white hover:bg-[#0f5f9f]">
                <T>Request a quote</T>
              </Link>
              {product.document ? <ProductDocumentDownload href={product.document} model={product.model} /> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Product Overview" title={product.title} description={product.overview} />
          {seo ? <p className="mb-6 max-w-4xl leading-7 text-[#526b7d]"><T>{seo.intro}</T></p> : null}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {product.highlights.map((highlight) => <div key={highlight} className="rounded-md border border-slate-200 bg-white p-4 font-extrabold text-slate-900"><T>{highlight}</T></div>)}
          </div>
        </div>
      </section>

      {seo?.selection ? (
        <section className="px-5 pb-12 lg:px-8">
          <div className="mx-auto max-w-7xl rounded-md border border-slate-200 bg-white p-6 sm:p-8">
            <h2 className="text-2xl font-black text-[#12263a]"><T>Choose the right test configuration</T></h2>
            <div className="mt-5 grid gap-6 md:grid-cols-3">
              {[
                ["Interface and workflow", seo.selection.workflow],
                ["External load and connection limits", seo.selection.load],
                ["Options and accessories", seo.selection.options],
              ].map(([title, text]) => (
                <div key={title}>
                  <h3 className="font-black text-[#12263a]"><T>{title}</T></h3>
                  <p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{text}</T></p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-bold text-[#1268a8]">
              {seo.selection.alternatives.map((alternative) => (
                <Link key={alternative.slug} href={`/products/${alternative.slug}`}><T>{alternative.label}</T> →</Link>
              ))}
              <Link href="#product-inquiry"><T>Discuss your configuration →</T></Link>
            </div>
          </div>
        </section>
      ) : null}

      <section className="px-5 pb-12 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-md border border-slate-200 bg-[#f3f8fa] p-6 sm:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-[#1268a8]"><T>Procurement checklist</T></p>
          <h2 className="mt-2 text-2xl font-black text-[#12263a]"><T>Confirm the delivered configuration before ordering</T></h2>
          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              ["Interface and standards", "Confirm the connector, market, protocol and exact standard editions required by the charger and test plan."],
              ["Electrical and load path", "Separate socket, cable and measurement ratings from the source or external load used during sustained power tests."],
              ["Evidence and options", "List required metering accuracy, message or waveform capture, fault cases, report fields and optional modules."],
              ["Acceptance and support", "Agree supplied accessories, software, factory acceptance checks, commissioning, training and support boundaries."],
            ].map(([title, text]) => <div key={title} className="border-t-2 border-[#00a6c7] pt-4"><h3 className="font-black text-[#12263a]"><T>{title}</T></h3><p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{text}</T></p></div>)}
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <Link href="#product-inquiry" className="rounded-md bg-[#1479c9] px-5 py-3 text-sm font-black text-white hover:bg-[#0f5f9f]"><T>Send configuration requirements</T></Link>
            <Link href={`/products?compare=${product.slug}#compare`} className="text-sm font-black text-[#1268a8]"><T>Compare</T> {product.model} →</Link>
            <Link href="/resources/ev-charger-test-equipment-guide" className="text-sm font-black text-[#1268a8]"><T>Read the equipment buying guide →</T></Link>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div id="key-features">
            <SectionHeading compact eyebrow="Key Features" title="Designed for reliable EV charger validation." />
            <div className="rounded-md border border-slate-200 bg-white p-5 sm:p-6">
              <ul className="divide-y divide-slate-100">
                {product.features.map((feature, index) => (
                  <li key={feature} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[#e8f7fa] text-[10px] font-black text-apex-blue">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-6 text-slate-700"><T>{feature}</T></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div id="technical-specifications">
            <SectionHeading compact eyebrow="Technical Specifications" title="Core specifications" />
            <SpecTable specs={product.specs} />
            <div className="mt-5 rounded-md border-l-4 border-[#00a6c7] bg-white p-5">
              <h3 className="font-black text-[#12263a]"><T>Need this model configured for your charger?</T></h3>
              <p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>Send the connector, target standard, voltage/current range and test workflow. The form below already includes</T> {product.model} <T>as the inquiry context.</T></p>
              <Link href="#product-inquiry" className="mt-4 inline-flex rounded-md bg-[#1479c9] px-5 py-3 text-sm font-black text-white hover:bg-[#0f5f9f]"><T>Request a configuration review</T></Link>
            </div>
          </div>
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

      {seo ? <section className="px-5 py-14 lg:px-8"><div className="mx-auto max-w-7xl"><SectionHeading compact eyebrow="Product FAQ" title={`Common questions about ${product.model}`} /><div className="grid gap-6 md:grid-cols-3">{seo.faqs.map((faq) => <div key={faq.question} className="border-t-2 border-[#00a6c7] pt-4"><h3 className="font-black text-[#12263a]"><T>{faq.question}</T></h3><p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{faq.answer}</T></p></div>)}</div></div></section> : null}

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

      <section id="product-inquiry" className="scroll-mt-28 bg-slate-50 px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Inquiry Form" title="Request pricing, lead time or technical support." />
            <p className="text-slate-600"><T>Include your target standard, voltage/current range and testing environment for a faster recommendation.</T></p>
          </div>
          <InquiryForm context={`Product inquiry: ${product.model}`} />
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="text-2xl font-black text-[#12263a]"><T>Related engineering resources</T></h2><div className="mt-4 grid gap-4 md:grid-cols-3">{relatedResources.map((resource) => <Link key={resource.slug} href={`/resources/${resource.slug}`} className="border-t border-slate-200 pt-4 text-sm font-bold text-[#1268a8]"><T>{resource.title}</T></Link>)}</div></div></section>
    </>
  );
}
