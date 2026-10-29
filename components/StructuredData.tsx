"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { localizeStructuredData } from "@/lib/seo/localized-structured-data";

export function StructuredData({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  const { language, t } = useLanguage();
  const localized = localizeStructuredData(data, language, t);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localized).replace(/</g, "\\u003c") }} />;
}
