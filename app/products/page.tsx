import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { ProductCatalog } from "@/components/ProductCatalog";
import { brochureCatalog, products } from "@/data/site";
import { filterProducts, parseProductFilter, type ProductFilter } from "@/lib/products/filter";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse APEX EV charger testers, EVSE analyzers, charging simulators and regenerative DC loads.",
  alternates: { canonical: "/products" },
};

const existingProductModels = new Set(products.map((product) => product.model));
const supplementalCatalog = brochureCatalog.filter((item) => !existingProductModels.has(item.model));

type ProductsPageProps = {
  searchParams: Promise<{ type?: string }>;
};

const filterLabels: Record<ProductFilter, string> = {
  all: "All Products",
  dc: "DC Testers",
  ac: "AC Testers",
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { type } = await searchParams;
  const filter = parseProductFilter(type);
  const filteredProducts = filterProducts(products, filter);
  const filteredSupplementalCatalog = filterProducts(supplementalCatalog, filter);

  return (
    <>
      <PageHero
        eyebrow="Products"
        title="EV charger testing equipment for manufacturers, laboratories and field teams."
        description={`Explore ${filter === "all" ? "industrial AC/DC charger testers, EV charger analyzers, NACS interface testers and regenerative DC loads" : `${filterLabels[filter].toLowerCase()} and related EVSE analysis systems`} for charging pile validation.`}
      />
      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap gap-2" aria-label="Product type filter">
            {(Object.keys(filterLabels) as ProductFilter[]).map((option) => (
              <a
                key={option}
                href={option === "all" ? "/products" : `/products?type=${option}`}
                aria-current={filter === option ? "page" : undefined}
                className={`rounded-md border px-4 py-2 text-sm font-bold transition-colors ${filter === option ? "border-[#1479c9] bg-[#1479c9] text-white" : "border-slate-300 bg-white text-[#385064] hover:border-[#1479c9] hover:text-[#1479c9]"}`}
              >
                {filterLabels[option]}
              </a>
            ))}
          </div>
          <ProductCatalog eyebrow="Categories" title={filterLabels[filter]} products={filteredProducts} />
          <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredSupplementalCatalog.map((item) => (
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
