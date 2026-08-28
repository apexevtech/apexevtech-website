import type { MetadataRoute } from "next";
import { products } from "@/data/site";
import { siteUrl, staticRoutes } from "@/lib/seo/site-urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-08-28T00:00:00.000Z");

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
