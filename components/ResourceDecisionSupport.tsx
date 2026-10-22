import { T } from "@/components/LanguageProvider";
import Image from "next/image";
import type { Product } from "@/data/site";
import type { ResourceDecisionTable } from "@/data/resources";
import { TrackedLink } from "@/components/TrackedLink";

type ResourceDecisionSupportProps = {
  decisionTable: ResourceDecisionTable;
  representativeProduct?: Product;
  resourceSlug: string;
};

export function ResourceDecisionSupport({ decisionTable, representativeProduct, resourceSlug }: ResourceDecisionSupportProps) {
  return (
    <section className="mt-12 border-t border-slate-200 pt-8">
      <p className="text-sm font-black uppercase tracking-wide text-[#1268a8]"><T>{decisionTable.eyebrow}</T></p>
      <h2 className="mt-2 text-2xl font-black text-[#12263a]"><T>{decisionTable.title}</T></h2>
      <p className="mt-3 leading-7 text-[#526b7d]"><T>{decisionTable.description}</T></p>

      {representativeProduct ? (
        <TrackedLink href={`/products/${representativeProduct.slug}`} eventName="guide_equipment_click" location="guide-worksheet" eventParameters={{ resource_slug: resourceSlug, product_model: representativeProduct.model }} className="mt-6 grid overflow-hidden rounded-md border border-slate-200 bg-[#f4f8fa] sm:grid-cols-[220px_1fr]">
          <div className="relative min-h-48 bg-white">
            <Image src={representativeProduct.image} alt={`${representativeProduct.model} ${representativeProduct.title}`} fill sizes="(min-width: 640px) 220px, calc(100vw - 42px)" className="object-contain p-5" />
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-xs font-black uppercase tracking-wide text-[#1268a8]"><T>{"Representative APEX equipment"}</T></p>
            <h3 className="mt-2 text-xl font-black text-[#12263a]"><T>{representativeProduct.model}</T></h3>
            <p className="mt-2 text-sm leading-6 text-[#526b7d]"><T>{representativeProduct.shortDescription}</T></p>
            <span className="mt-4 inline-flex text-sm font-black text-[#1268a8]"><T>{"Review published specifications →"}</T></span>
          </div>
        </TrackedLink>
      ) : null}

      <div className="resource-decision-mobile mt-6 grid gap-3 sm:hidden">
        {decisionTable.rows.map((row) => (
          <article key={row[0]} className="rounded-md border border-slate-200 bg-white p-4">
            <h3 className="font-black text-[#12263a]"><T>{row[0]}</T></h3>
            <dl className="mt-3 grid gap-3 text-sm">
              <div>
                <dt className="font-black text-[#1268a8]"><T>{decisionTable.columns[1]}</T></dt>
                <dd className="mt-1 leading-6 text-[#526b7d]"><T>{row[1]}</T></dd>
              </div>
              <div>
                <dt className="font-black text-[#1268a8]"><T>{decisionTable.columns[2]}</T></dt>
                <dd className="mt-1 leading-6 text-[#526b7d]"><T>{row[2]}</T></dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="resource-decision-table mt-6 hidden overflow-hidden rounded-md border border-slate-200 sm:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[#102a43] text-white">
            <tr>{decisionTable.columns.map((column) => <th key={column} scope="col" className="px-4 py-3 font-black"><T>{column}</T></th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {decisionTable.rows.map((row) => (
              <tr key={row[0]} className="align-top">
                {row.map((cell, index) => <td key={cell} className={`px-4 py-4 leading-6 ${index === 0 ? "font-black text-[#12263a]" : "text-[#526b7d]"}`}><T>{cell}</T></td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 border-l-4 border-[#00a6c7] bg-[#f3f8fa] p-4 text-sm leading-6 text-[#385064]"><strong><T>{"Scope note:"}</T></strong> <T>{decisionTable.note}</T></p>
    </section>
  );
}
