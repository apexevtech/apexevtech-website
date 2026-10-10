import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/data/site";
import type { ResourceDecisionTable } from "@/data/resources";

type ResourceDecisionSupportProps = {
  decisionTable: ResourceDecisionTable;
  representativeProduct?: Product;
};

export function ResourceDecisionSupport({ decisionTable, representativeProduct }: ResourceDecisionSupportProps) {
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <p className="text-sm font-black uppercase tracking-wide text-[#1268a8]">{decisionTable.eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black text-[#12263a]">{decisionTable.title}</h2>
      <p className="mt-3 leading-7 text-[#526b7d]">{decisionTable.description}</p>

      {representativeProduct ? (
        <Link href={`/products/${representativeProduct.slug}`} className="mt-6 grid overflow-hidden rounded-md border border-slate-200 bg-[#f4f8fa] sm:grid-cols-[220px_1fr]">
          <div className="relative min-h-48 bg-white">
            <Image src={representativeProduct.image} alt={`${representativeProduct.model} ${representativeProduct.title}`} fill sizes="(min-width: 640px) 220px, calc(100vw - 42px)" className="object-contain p-5" />
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-wide text-[#1268a8]">Representative APEX equipment</p>
            <h3 className="mt-2 text-xl font-black text-[#12263a]">{representativeProduct.model}</h3>
            <p className="mt-2 text-sm leading-6 text-[#526b7d]">{representativeProduct.shortDescription}</p>
            <span className="mt-4 inline-flex text-sm font-black text-[#1268a8]">Review published specifications →</span>
          </div>
        </Link>
      ) : null}

      <div className="mt-6 grid gap-3 sm:hidden">
        {decisionTable.rows.map((row) => (
          <article key={row[0]} className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-black text-[#12263a]">{row[0]}</h3>
            <dl className="mt-3 grid gap-3 text-sm">
              <div>
                <dt className="font-black text-[#1268a8]">{decisionTable.columns[1]}</dt>
                <dd className="mt-1 leading-6 text-[#526b7d]">{row[1]}</dd>
              </div>
              <div>
                <dt className="font-black text-[#1268a8]">{decisionTable.columns[2]}</dt>
                <dd className="mt-1 leading-6 text-[#526b7d]">{row[2]}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-6 hidden overflow-hidden rounded-md border border-slate-200 sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#102a43] text-white">
            <tr>{decisionTable.columns.map((column) => <th key={column} scope="col" className="px-4 py-3 font-black">{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {decisionTable.rows.map((row) => (
              <tr key={row[0]} className="align-top">
                {row.map((cell, index) => <td key={cell} className={`px-4 py-4 leading-6 ${index === 0 ? "font-black text-[#12263a]" : "text-[#526b7d]"}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 border-l-4 border-[#00a6c7] bg-[#f3f8fa] p-4 text-sm leading-6 text-[#385064]"><strong>Scope note:</strong> {decisionTable.note}</p>
    </section>
  );
}
