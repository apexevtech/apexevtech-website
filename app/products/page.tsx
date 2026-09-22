import Link from "next/link";
import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCatalogSection } from "@/components/ProductCatalogSection";
import { ProductComparison } from "@/components/ProductComparison";
import { brochureCatalog, products } from "@/data/site";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "EV Charger Test Equipment: AC, DC & Laboratory Systems",
  description: "Compare APEX AC and DC EVSE testers, portable charger analyzers and integrated laboratory systems by connector, test workflow and external-load requirements.",
  path: "/products",
});

const existingProductModels = new Set(products.map((product) => product.model));
const supplementalCatalog = brochureCatalog.filter((item) => !existingProductModels.has(item.model));

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="EV charger testing equipment for manufacturers, laboratories and field teams."
        description="Explore industrial AC/DC charger testers, EV charger analyzers, NACS interface testers and regenerative DC loads for charging pile validation."
      />
      <section className="px-5 pt-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-black text-[#12263a]">Choose equipment for your test workflow</h2>
          <p className="mt-3 max-w-3xl leading-7 text-[#526b7d]">Start with the charger interface and test environment. Connector coverage, measurement options and the power-load arrangement are configuration decisions.</p>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {[
              { title: "AC EVSE testing", text: "Compare AC testers for control-pilot checks, charging states, metering and field inspection.", href: "/products?type=ac#equipment", label: "Explore AC testers" },
              { title: "DC charger testing", text: "Select the required GB/T, CCS2 or CHAdeMO interface, then confirm voltage, current and external-load requirements.", href: "/products?type=dc#equipment", label: "Explore DC testers" },
              { title: "Integrated laboratory validation", text: "Coordinate interface simulation, power equipment, communication capture and reports for repeatable development tests.", href: "/products/ast-9000", label: "Explore AST-9000" },
            ].map((item) => <article key={item.title} className="rounded-md border border-slate-200 bg-white p-6"><h3 className="text-lg font-black text-[#12263a]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-[#526b7d]">{item.text}</p><Link href={item.href} className="mt-5 inline-flex font-bold text-[#1268a8]">{item.label} →</Link></article>)}
          </div>
          <div className="mt-6 flex flex-wrap gap-5 text-sm font-bold text-[#1268a8]"><Link href="/resources/choose-ev-charger-test-system">Read the equipment selection guide →</Link><Link href="/resources/field-commissioning-test-equipment">Plan portable field testing →</Link><Link href="/contact#inquiry-form">Ask an engineer about your configuration →</Link></div>
        </div>
      </section>
      <ProductComparison products={products} />
      <ProductCatalogSection
        products={products}
        supplementalCatalog={supplementalCatalog}
      />
    </>
  );
}
