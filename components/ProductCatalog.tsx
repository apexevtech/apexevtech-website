"use client";

import type { Product } from "@/data/site";
import { ProductCard } from "@/components/ProductCard";
import { CatalogControls } from "@/components/CatalogControls";
import { T, useLanguage } from "@/components/LanguageProvider";
import Link from "next/link";
import { Columns3 } from "lucide-react";

export type ProductCatalogComparison = {
  selectedSlugs: string[];
  ready: boolean;
  onToggle: (slug: string) => void;
  onClear: () => void;
};

type ProductCatalogProps = {
  products: Product[];
  eyebrow: string;
  title: string;
  comparison: ProductCatalogComparison;
};

export function ProductCatalog({ products, eyebrow, title, comparison }: ProductCatalogProps) {
  const { t } = useLanguage();
  return (
    <>
      <div className="mb-8">
        <div className="mb-1 max-w-3xl">
          <p className="text-sm font-extrabold uppercase text-apex-blue"><T>{eyebrow}</T></p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-900 md:text-3xl"><T>{title}</T></h2>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => {
          const selected = comparison.selectedSlugs.includes(product.slug);
          const full = comparison.selectedSlugs.length >= 3;
          return <article key={product.slug} className="flex min-w-0 flex-col" data-catalog-product={product.slug}>
            <div className="min-h-0 flex-1"><ProductCard product={product} /></div>
            <CatalogControls className="flex min-h-14 items-center justify-between gap-2 px-1 py-1">
              <label className={`inline-flex min-h-11 min-w-0 items-center gap-2.5 text-sm font-semibold leading-6 ${!comparison.ready || (full && !selected) ? "text-slate-500" : "cursor-pointer text-[#385064]"}`}>
                <input type="checkbox" aria-label={`${t(selected ? "Added to comparison" : "Add to comparison")}: ${product.model}`} aria-describedby="comparison-selection-status" checked={selected} disabled={!comparison.ready || (full && !selected)} onChange={() => comparison.onToggle(product.slug)} className="h-4 w-4 shrink-0 accent-[#1268a8]" />
                <span><T>{selected ? "Added to comparison" : "Add to comparison"}</T></span>
              </label>
              {selected ? <Link href="#compare" title={t("View comparison")} aria-label={`${t("View comparison")}: ${product.model}`} className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-[#1268a8] hover:bg-[#edf5fc]"><Columns3 size={20} aria-hidden="true" /></Link> : <span aria-hidden="true" className="h-11 w-11 shrink-0" />}
            </CatalogControls>
          </article>;
        })}
      </div>
    </>
  );
}
