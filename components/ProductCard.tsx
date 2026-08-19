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
      className="group flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-industrial"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-5">
        <Image
          src={product.image}
          alt={`${product.model} ${product.title}`}
          width={520}
          height={390}
          className="h-full w-full object-contain transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-[11px] font-extrabold uppercase leading-4 text-apex-blue">{product.category}</p>
        <h3 className="mt-1 text-lg font-black text-slate-900">{product.model}</h3>
        <p className="mt-0.5 text-sm font-semibold text-slate-700">{product.title}</p>
        <p className="mt-2 text-[11px] font-bold uppercase leading-4 text-slate-500">
          Key coverage: {product.highlights.slice(0, 3).join(" · ")}
        </p>
        <p className="mt-3 text-sm leading-5 text-slate-600">{product.shortDescription}</p>
        <span className="mt-auto inline-flex self-start items-center gap-2 rounded-md bg-apex-blue px-3.5 py-2 text-sm font-bold text-white transition group-hover:bg-blue-700">
          Detailed Information <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}
