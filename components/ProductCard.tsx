import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/site";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_10px_30px_rgba(18,38,58,0.06)] transition hover:-translate-y-1 hover:border-[#9edbe5] hover:shadow-[0_18px_42px_rgba(18,38,58,0.12)]"
    >
      <div className="flex aspect-[4/3] items-center justify-center border-b border-slate-100 bg-[#f4f8fa] p-5">
        <Image
          src={product.image}
          alt={`${product.model} ${product.title}`}
          width={520}
          height={390}
          className="h-full w-full object-contain transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-black uppercase leading-4 text-[#1479c9]">{product.category}</p>
        <h3 className="mt-2 text-lg font-black text-[#12263a]">{product.model}</h3>
        <p className="mt-0.5 text-sm font-semibold text-[#385064]">{product.title}</p>
        <p className="mt-2 text-[11px] font-bold uppercase leading-4 text-slate-500">
          Key coverage: {product.highlights.slice(0, 3).join(" · ")}
        </p>
        <p className="mt-3 text-sm leading-5 text-slate-600">{product.shortDescription}</p>
        <span className="mt-auto inline-flex self-start items-center gap-2 border-b-2 border-[#1479c9] pb-1 text-sm font-bold text-[#1479c9] transition group-hover:border-[#00a6c7] group-hover:text-[#0f5f9f]">
          View specifications <span aria-hidden="true">↗</span>
        </span>
      </div>
    </Link>
  );
}
