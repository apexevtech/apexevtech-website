import type { ReactNode } from "react";
import SiteDocument, { baseSiteMetadata } from "@/components/SiteDocument";
import { localizePageMetadata } from "@/lib/seo/localized-metadata";

export const metadata = localizePageMetadata(baseSiteMetadata, "zh");

export default function ChineseLayout({ children }: { children: ReactNode }) {
  return <SiteDocument language="zh">{children}</SiteDocument>;
}
