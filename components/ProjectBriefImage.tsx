"use client";

import Image from "next/image";
import type { EngineeringCase } from "@/data/engineering-cases";
import { useLanguage } from "@/components/LanguageProvider";

export function ProjectBriefImage({ image }: { image: NonNullable<EngineeringCase["image"]> }) {
  const { t } = useLanguage();
  return <Image src={image.src} alt={t(image.alt)} width={image.width} height={image.height} priority sizes="(min-width: 808px) 768px, calc(100vw - 40px)" className="h-auto w-full object-contain" />;
}
