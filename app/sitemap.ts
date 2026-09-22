import type { MetadataRoute } from "next";
import { products } from "@/data/site";
import { siteUrl, staticRoutes } from "@/lib/seo/site-urls";
import { resources } from "@/lib/resources/catalog";
import { getProductSeo } from "@/lib/products/seo";
import { applicationExamples } from "@/data/applications";
import { interfaceTopics } from "@/data/interface-topics";

const siteContentLastModified = "2026-09-11T00:00:00.000Z";
const staticPageUpdates: Record<string, string> = {
  "": "2026-09-16T00:00:00.000Z",
  "/products": "2026-09-16T00:00:00.000Z",
  "/about": "2026-09-18T00:00:00.000Z",
  "/contact": "2026-09-18T00:00:00.000Z",
  "/solutions": "2026-09-18T00:00:00.000Z",
  "/applications": "2026-09-21T00:00:00.000Z",
  "/interfaces": "2026-09-21T00:00:00.000Z",
};
const productContentLastModified = "2026-09-16T00:00:00.000Z";
const resourcesLastModified = resources.reduce((latest, resource) => resource.modifiedAt > latest ? resource.modifiedAt : latest, "2026-08-28");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(route === "/resources" ? `${resourcesLastModified}T00:00:00.000Z` : staticPageUpdates[route] || siteContentLastModified),
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date(getProductSeo(product.slug)?.selection ? "2026-09-18T00:00:00.000Z" : productContentLastModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...resources.map((resource) => ({
      url: `${siteUrl}/resources/${resource.slug}`,
      lastModified: new Date(`${resource.modifiedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...applicationExamples.map((application) => ({
      url: `${siteUrl}/applications/${application.slug}`,
      lastModified: new Date(`${application.modifiedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...interfaceTopics.map((topic) => ({
      url: `${siteUrl}/interfaces/${topic.slug}`,
      lastModified: new Date(`${topic.modifiedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
