"use client";

import Image from "next/image";
import { useLanguage } from "@/components/LanguageProvider";
import type { TechnicalLibrarySource } from "@/data/technical-library";

export function SourceCitation({ source, compact = false, headingLevel, presentation, showImage = true, showTitle = true }: {
  source: TechnicalLibrarySource;
  compact?: boolean;
  headingLevel?: "h2" | "h3";
  presentation?: "list";
  showImage?: boolean;
  showTitle?: boolean;
}) {
  const { t } = useLanguage();
  const Heading = headingLevel || "p";
  const image = showImage ? source.image : undefined;
  const isList = presentation === "list";
  return <aside aria-label={t("Material details")} className={`${isList ? "" : compact ? "mt-3" : "mt-5 border-l-2 border-[#00a6c7] pl-4"} min-w-0 text-sm`}>
    <div className={image ? `grid gap-4 ${isList ? "md:grid-cols-[minmax(0,1fr)_240px]" : !compact ? "lg:grid-cols-[minmax(0,1fr)_240px]" : ""}` : undefined}>
      <div className="min-w-0">
        {showTitle ? <Heading className={`break-words font-bold text-[#12263a] ${isList ? "text-lg leading-7" : headingLevel ? "text-xl leading-7" : "text-base leading-6"}`}>{t(source.title)}</Heading> : null}
        <p className="mt-2 leading-6 text-[#526b7d]">{t(source.summary)}</p>
        <p className="mt-2 text-xs leading-5 text-[#526b7d]">{t(source.scopeNote)}</p>
      </div>
      {image ? <figure className={`min-w-0 ${isList ? "" : `order-first ${compact ? "" : "lg:order-last"}`}`}>
        <div className="aspect-[16/9] overflow-hidden rounded-md border border-slate-200 bg-white"><Image src={image.src} alt={t(image.alt)} width={image.width} height={image.height} sizes={isList ? "(min-width: 768px) 240px, calc(100vw - 40px)" : compact ? "(min-width: 1280px) 592px, (min-width: 768px) 45vw, calc(100vw - 40px)" : "(min-width: 1024px) 240px, calc(100vw - 60px)"} className="h-full w-full object-contain" /></div>
      </figure> : null}
    </div>
  </aside>;
}
