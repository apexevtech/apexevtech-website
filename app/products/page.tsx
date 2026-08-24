import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { brochureCatalog, products } from "@/data/site";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse APEX EV charger testers, EVSE analyzers, charging simulators and regenerative DC loads.",
  alternates: { canonical: "/products" },
};

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
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ProductCatalog eyebrow="Categories" title="Product categories" products={products} />
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {supplementalCatalog.map((item) => (
              <article key={item.model} className="flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition hover:border-[#9edbe5]">
                <div className="relative aspect-[4/3] border-b border-slate-100 bg-[#f4f8fa]">
                  <Image src={item.image} alt={`${item.model} ${item.title}`} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-5" />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-black uppercase text-[#1479c9]">{item.category}</p>
                  <h3 className="mt-2 text-lg font-black text-[#12263a]">{item.model}</h3>
                  <p className="mt-1 font-semibold text-[#385064]">{item.title}</p>
                  <p className="mt-auto pt-3 text-sm leading-6 text-[#526b7d]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
