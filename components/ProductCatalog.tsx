"use client";

import type { Product } from "@/data/site";
import { ProductCard } from "@/components/ProductCard";

type ProductCatalogProps = {
  products: Product[];
  eyebrow: string;
  title: string;
};

export function ProductCatalog({ products, eyebrow, title }: ProductCatalogProps) {
  return (
    <>
      <div className="mb-8">
        <div className="mb-1 max-w-3xl">
          <p className="text-sm font-extrabold uppercase text-apex-blue">{eyebrow}</p>
          <h2 className="mt-2 text-3xl font-black leading-tight text-slate-900 md:text-4xl">{title}</h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </>
  );
}
