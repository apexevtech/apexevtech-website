"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Product } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";

type ProductCardProps = {
  product: Product;
  sizes?: string;
};

export function ProductCard({ product, sizes = "(min-width: 1280px) 350px, (min-width: 768px) calc(50vw - 72px), calc(100vw - 82px)" }: ProductCardProps) {
  const { t } = useLanguage();
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_2px_8px_rgba(18,38,58,0.03)] transition-[border-color,box-shadow] hover:border-[#8bb3cf] hover:shadow-[0_4px_14px_rgba(18,38,58,0.07)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1268a8] motion-reduce:transition-none"
    >
      <div className="flex aspect-[4/3] items-center justify-center border-b border-slate-100 bg-[#f4f8fa] p-5">
        <Image
          src={product.image}
          alt={`${product.model} ${t(product.title)}`}
          width={520}
          height={390}
          sizes={sizes}
          className="h-full w-full object-contain"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold leading-5 text-[#1268a8]">{t(product.category)}</p>
        <h3 className="mt-2 text-lg font-black text-[#12263a]">{product.model}</h3>
        <p className="mt-0.5 text-sm font-semibold text-[#385064]">{t(product.title)}</p>
        <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">
          {t("Key coverage:")} {product.highlights.slice(0, 3).map(t).join(" · ")}
        </p>
        <p className="mt-3 text-sm leading-6 text-slate-600">{t(product.shortDescription)}</p>
        <span className="mt-auto inline-flex min-h-11 self-start items-center gap-2 pt-5 text-sm font-semibold text-[#1268a8] underline decoration-2 underline-offset-4 transition-colors group-hover:text-[#0f5f9f] motion-reduce:transition-none">
          {t("View specifications")} <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" className="shrink-0" />
        </span>
      </div>
    </Link>
  );
}
