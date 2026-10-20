"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { siteUrl } from "@/lib/seo/site-urls";

export function CatalogMetadataSync({ title, path }: { title: string; path: string }) {
  const router = useRouter();
  useEffect(() => {
    const canonical = new URL(path, siteUrl).href;
    const matches = () => document.title === `${title} | APEX`
      && document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href === canonical;
    if (matches()) return;
    // History-based filters stay immediate; refresh only when the server-owned head needs updating.
    const timer = window.setTimeout(() => { if (!matches()) router.refresh(); }, 200);
    return () => window.clearTimeout(timer);
  }, [title, path, router]);
  return null;
}
