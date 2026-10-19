import Image from "next/image";
import { TrackedLink } from "@/components/TrackedLink";
import { products } from "@/data/site";
import { resourceEquipmentPaths } from "@/data/resource-equipment";
import { buildCatalogInquiryHref } from "@/lib/inquiries/catalog-scope";

export function ResourceEquipmentPaths({ resourceSlug }: { resourceSlug: string }) {
  const equipment = resourceEquipmentPaths[resourceSlug];
  if (!equipment) return null;
  return (
    <section className="print-hide mt-8 border-y border-slate-200 py-6" aria-labelledby="equipment-paths-title">
      <h2 id="equipment-paths-title" className="text-2xl font-black text-[#12263a]">Which test system fits your charger?</h2>
      <p className="mt-3 text-sm leading-6 text-[#526b7d]">Start with the charger type and test environment, then confirm the connector, electrical range and included functions.</p>
      <div className={`mt-5 grid gap-4 ${equipment.paths.length > 1 ? "sm:grid-cols-3" : ""}`}>
        {equipment.paths.map((path) => {
          const product = products.find((item) => item.slug === path.slug)!;
          return (
            <article key={path.slug} className={`flex min-w-0 flex-col rounded-md border border-slate-200 p-4 ${equipment.paths.length === 1 ? "sm:grid sm:grid-cols-[220px_1fr] sm:gap-x-6" : ""}`}>
              <div className={`relative aspect-[4/3] w-full ${equipment.paths.length === 1 ? "sm:row-span-3" : ""}`}>
                <Image src={product.image} alt={product.model} fill sizes="(min-width: 640px) 240px, calc(100vw - 74px)" className="object-contain p-3" />
              </div>
              <h3 className="mt-3 font-black text-[#12263a]">{path.title}</h3>
              <p className="mb-4 mt-2 text-sm leading-6 text-[#526b7d]">{path.scope}</p>
              <div className="mt-auto grid gap-1">
                <TrackedLink href={path.href} eventName="guide_equipment_click" location="guide-selection-path" eventParameters={{ resource_slug: resourceSlug, product_model: product.model }} className="inline-flex min-h-11 items-center py-2 text-sm font-bold text-[#1268a8] hover:underline">{path.label}</TrackedLink>
                {product.document ? <TrackedLink href={product.document} download prefetch={false} eventName="catalog_download" location="guide-original-specifications" eventParameters={{ resource_slug: resourceSlug, model: product.model }} className="inline-flex min-h-11 items-center py-2 text-sm text-[#385064] underline underline-offset-4">Original specifications (Word)</TrackedLink> : null}
              </div>
            </article>
          );
        })}
      </div>
      {equipment.note ? <p className="mt-5 text-sm leading-6 text-[#385064]">{equipment.note}</p> : null}
      {equipment.inquiryFilters ? <TrackedLink href={buildCatalogInquiryHref(equipment.inquiryFilters)} eventName="guide_inquiry_click" location="guide-interface-configuration" eventParameters={{ resource_slug: resourceSlug }} className="mt-4 inline-flex min-h-11 items-center rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white hover:bg-[#0f5f9f]">{resourceSlug === "sae-j3400-nacs-testing" ? "Request a NACS DC configuration review" : "Review my CCS2 test configuration"}</TrackedLink> : null}
    </section>
  );
}
