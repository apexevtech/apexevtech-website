import type { MetadataRoute } from "next";
import { products } from "@/data/site";
import { siteUrl, staticRoutes } from "@/lib/seo/site-urls";
import { resources } from "@/lib/resources/catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
    ...resources.map((resource) => ({
      url: `${siteUrl}/resources/${resource.slug}`,
      lastModified: new Date(`${resource.modifiedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
