import type { ReactNode } from "react";
import SiteDocument, { baseSiteMetadata } from "@/components/SiteDocument";
import { localizePageMetadata } from "@/lib/seo/localized-metadata";

export const metadata = localizePageMetadata(baseSiteMetadata, "en");

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return <SiteDocument language="en">{children}</SiteDocument>;
}
