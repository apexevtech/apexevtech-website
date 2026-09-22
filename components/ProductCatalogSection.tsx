"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { useEffect, useState } from "react";
import { ProductCatalog } from "@/components/ProductCatalog";
import { brochureCatalog, type Product } from "@/data/site";
import { filterProducts, parseProductFilter, type ProductFilter } from "@/lib/products/filter";

type SupplementalProduct = (typeof brochureCatalog)[number];

type ProductCatalogSectionProps = {
  products: Product[];
  supplementalCatalog: SupplementalProduct[];
};

const filterLabels: Record<ProductFilter, string> = {
  all: "All Products",
  dc: "DC Testers",
  ac: "AC Testers",
};

export function ProductCatalogSection({ products, supplementalCatalog }: ProductCatalogSectionProps) {
  const [filter, setFilter] = useState<ProductFilter>("all");

  useEffect(() => {
    const syncFilterWithUrl = () => {
      setFilter(parseProductFilter(new URLSearchParams(window.location.search).get("type")));
    };

    syncFilterWithUrl();
    window.addEventListener("popstate", syncFilterWithUrl);
    return () => window.removeEventListener("popstate", syncFilterWithUrl);
  }, []);

  function selectFilter(event: MouseEvent<HTMLAnchorElement>, option: ProductFilter) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    const href = option === "all" ? "/products#equipment" : `/products?type=${option}#equipment`;
    window.history.pushState(null, "", href);
    setFilter(option);
    document.getElementById("equipment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const filteredProducts = filterProducts(products, filter);
  const filteredSupplementalCatalog = filterProducts(supplementalCatalog, filter);

  return (
    <section id="equipment" className="scroll-mt-28 px-5 py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap gap-2" aria-label="Product type filter">
          {(Object.keys(filterLabels) as ProductFilter[]).map((option) => (
            <a
              key={option}
              href={option === "all" ? "/products#equipment" : `/products?type=${option}#equipment`}
              onClick={(event) => selectFilter(event, option)}
              aria-current={filter === option ? "page" : undefined}
              className={`rounded-md border px-4 py-2 text-sm font-bold transition-colors ${filter === option ? "border-[#1479c9] bg-[#1479c9] text-white" : "border-slate-300 bg-white text-[#385064] hover:border-[#1479c9] hover:text-[#1268a8]"}`}
            >
              {filterLabels[option]}
            </a>
          ))}
        </div>
        <p className="mb-4 text-sm text-[#526b7d]">{filteredProducts.length + filteredSupplementalCatalog.length} equipment models · {filterLabels[filter]}</p>
        <ProductCatalog eyebrow="Categories" title={filterLabels[filter]} products={filteredProducts} />
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredSupplementalCatalog.map((item) => (
            <article key={item.model} className="flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white transition hover:border-[#9edbe5]">
              <div className="relative aspect-[4/3] border-b border-slate-100 bg-[#f4f8fa]">
                <Image src={item.image} alt={`${item.model} ${item.title}`} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-5" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-black uppercase text-[#1268a8]">{item.category}</p>
                <h3 className="mt-2 text-lg font-black text-[#12263a]">{item.model}</h3>
                <p className="mt-1 font-semibold text-[#385064]">{item.title}</p>
                <p className="mt-auto pt-3 text-sm leading-6 text-[#526b7d]">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
