"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { siteUrl } from "@/lib/seo/site-urls";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeHref } from "@/lib/i18n/urls";

export function CatalogMetadataSync({ title, path }: { title: string; path: string }) {
  const router = useRouter();
  const { language, t } = useLanguage();
  const paginated = title.match(/^(.*) - Page (\d+)$/);
  const localizedTitle = language === "zh" && paginated ? `${t(paginated[1])} - 第 ${paginated[2]} 页` : t(title);
  const localizedPath = localizeHref(path, language);
  useEffect(() => {
    const canonical = new URL(localizedPath, siteUrl).href;
    const matches = () => document.title === `${localizedTitle} | APEX`
      && document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href === canonical;
    if (matches()) return;
    // History-based filters stay immediate; refresh only when the server-owned head needs updating.
    const timer = window.setTimeout(() => { if (!matches()) router.refresh(); }, 200);
    return () => window.clearTimeout(timer);
  }, [localizedTitle, localizedPath, router]);
  return null;
}
