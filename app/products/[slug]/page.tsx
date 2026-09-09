import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { InquiryForm } from "@/components/InquiryForm";
import { PageHero } from "@/components/PageHero";
import { ProductDocumentDownload } from "@/components/ProductDocumentDownload";
import { SectionHeading } from "@/components/SectionHeading";
import { SpecTable } from "@/components/SpecTable";
import { products } from "@/data/site";
import { getResource } from "@/lib/resources/catalog";
import { StructuredData } from "@/components/StructuredData";
import { getProductSeo } from "@/lib/products/seo";

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
  return {
    title: seo?.title || `${product.model} ${product.category.split(" /")[0]} | APEX`,
    description: seo?.description || product.shortDescription,
    alternates: { canonical: `/products/${product.slug}` },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) {
    notFound();
  }
  const relatedResources = ["choose-ev-charger-test-system", "ev-charging-protocol-testing", "field-commissioning-test-equipment"]
    .map((resourceSlug) => getResource(resourceSlug))
    .filter((item): item is NonNullable<ReturnType<typeof getResource>> => Boolean(item));
  const seo = getProductSeo(product.slug);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.link-jl.com";
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
      <StructuredData data={breadcrumbData} />
      {seo ? <StructuredData data={{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: seo.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) }} /> : null}
      <PageHero compact eyebrow={product.category} title={product.model} subtitle={product.title} description={product.shortDescription} />

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex min-h-[460px] items-center justify-center rounded-md border border-slate-200 bg-[#eef4f7] p-8">
            <Image src={product.image} alt={`${product.model} ${product.title} for EV charger testing`} width={900} height={680} className="h-full w-full object-contain" />
          </div>
          <div>
            <SectionHeading eyebrow="Product Overview" title={product.title} description={product.overview} />
            {seo ? <p className="mb-6 leading-7 text-[#526b7d]">{seo.intro}</p> : null}
            <div className="grid gap-3 sm:grid-cols-2">
              {product.highlights.map((highlight) => (
                <div key={highlight} className="rounded-md border border-slate-200 bg-white p-4 font-extrabold text-slate-900">
                  {highlight}
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-md bg-[#1479c9] px-5 py-3 font-extrabold text-white hover:bg-[#0f5f9f]">
                Request a quote
              </Link>
              {product.document ? <ProductDocumentDownload href={product.document} model={product.model} /> : null}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-5 py-12 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading compact eyebrow="Key Features" title="Designed for reliable EV charger validation." />
            <div className="rounded-md border border-slate-200 bg-white p-5 sm:p-6">
              <ul className="divide-y divide-slate-100">
                {product.features.map((feature, index) => (
                  <li key={feature} className="flex gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-[#e8f7fa] text-[10px] font-black text-apex-blue">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-6 text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <SectionHeading compact eyebrow="Technical Specifications" title="Core specifications" />
            <SpecTable specs={product.specs} />
          </div>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Application Scenarios" title="Where this product is used" />
          <div className="grid gap-5 md:grid-cols-4">
            {product.applications.map((application) => (
              <div key={application} className="border-l-4 border-[#00a6c7] bg-[#102a43] p-6 font-black text-white">
                {application}
              </div>
            ))}
          </div>
        </div>
      </section>

      {seo ? <section className="px-5 py-14 lg:px-8"><div className="mx-auto max-w-7xl"><SectionHeading compact eyebrow="Product FAQ" title={`Common questions about ${product.model}`} /><div className="grid gap-6 md:grid-cols-3">{seo.faqs.map((faq) => <div key={faq.question} className="border-t-2 border-[#00a6c7] pt-4"><h3 className="font-black text-[#12263a]">{faq.question}</h3><p className="mt-2 text-sm leading-6 text-[#526b7d]">{faq.answer}</p></div>)}</div></div></section> : null}

      <section className="bg-slate-50 px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading eyebrow="Inquiry Form" title="Request pricing, lead time or technical support." />
            <p className="text-slate-600">Include your target standard, voltage/current range and testing environment for a faster recommendation.</p>
          </div>
          <InquiryForm context={`Product inquiry: ${product.model}`} />
        </div>
      </section>

      <section className="px-5 py-12 lg:px-8"><div className="mx-auto max-w-7xl"><h2 className="text-2xl font-black text-[#12263a]">Related engineering resources</h2><div className="mt-4 grid gap-4 md:grid-cols-3">{relatedResources.map((resource) => <Link key={resource.slug} href={`/resources/${resource.slug}`} className="border-t border-slate-200 pt-4 text-sm font-bold text-[#1479c9]">{resource.title}</Link>)}</div></div></section>
    </>
  );
}
