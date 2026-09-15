import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo/site-urls";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
};

export function buildPageMetadata({ title, description, path, image = "/assets/hero/test-lab-systems.webp" }: PageMetadataInput): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
