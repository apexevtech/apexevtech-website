"use client";

import type { Product } from "@/data/site";
import { useLanguage } from "@/components/LanguageProvider";
import { getProductConfiguration } from "@/lib/products/configuration";

export function ProductConfigurationSummary({ product }: { product: Product }) {
  const { t } = useLanguage();
  const configuration = getProductConfiguration(product, t);
  return (
    <dl className="mt-5 divide-y divide-slate-200 rounded-md border border-slate-200 bg-white px-5">
      {[
        ["Charging interface", configuration.interface],
        ["Electrical coverage", configuration.electricalRange],
        ["Load arrangement", configuration.loadArrangement],
        ["Options and accessories", configuration.options],
      ].map(([label, value]) => (
        <div key={label} className="py-4">
          <dt className="text-sm font-extrabold text-[#12263a]">{t(label)}</dt>
          <dd className="mt-1 text-sm leading-6 text-[#526b7d]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
