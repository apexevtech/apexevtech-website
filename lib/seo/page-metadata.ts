import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo/site-urls";
import type { Language } from "@/lib/i18n/preference";
import { localizePageMetadata } from "@/lib/seo/localized-metadata";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  article?: { publishedAt: string; modifiedAt: string };
  language?: Language;
};

export function buildPageMetadata({ title, description, path, article, image = "/assets/hero/test-lab-systems.webp", language = "en" }: PageMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

  return localizePageMetadata({
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: article ? "article" : "website",
      ...(article ? { publishedTime: article.publishedAt, modifiedTime: article.modifiedAt } : {}),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }, language);
}
