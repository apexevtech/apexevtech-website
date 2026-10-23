import type { MetadataRoute } from "next";
import { products } from "@/data/site";
import { siteUrl, staticRoutes } from "@/lib/seo/site-urls";
import { resources } from "@/lib/resources/catalog";
import { applicationExamples } from "@/data/applications";
import { interfaceTopics } from "@/data/interface-topics";
import { defaultEngineeringCaseFilters, getEngineeringCasePage } from "@/lib/engineering-cases/filter";
import { projectBriefs } from "@/data/project-briefs";
import { getProjectBrief } from "@/lib/engineering-cases/briefs";

const siteContentLastModified = "2026-10-08T00:00:00.000Z";
const staticPageUpdates: Record<string, string> = {
  "": "2026-10-10T00:00:00.000Z",
  "/products": "2026-10-08T00:00:00.000Z",
  "/about": "2026-09-22T00:00:00.000Z",
  "/contact": "2026-09-22T00:00:00.000Z",
  "/solutions": "2026-10-20T00:00:00.000Z",
  "/project-cases": "2026-10-23T00:00:00.000Z",
  "/interfaces": "2026-09-22T00:00:00.000Z",
  "/privacy-policy": "2026-10-09T00:00:00.000Z",
};
const productContentLastModified = "2026-10-08T00:00:00.000Z";
const productPageUpdates: Record<string, string> = {
  "st-hcac-gb-ua-ea": "2026-10-09T00:00:00.000Z",
};

const staticPageImages: Record<string, string[]> = {
  "": ["/assets/hero/test-lab-systems.webp"],
  "/products": products.map((product) => product.image),
  "/solutions": applicationExamples.map((application) => application.image),
  "/project-cases": getEngineeringCasePage(defaultEngineeringCaseFilters).items.flatMap((entry) => entry.image ? [entry.image.src] : []),
};

function absoluteImageUrls(paths: string[] | undefined) {
  return paths?.map((path) => new URL(path, siteUrl).toString());
}

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: new Date(staticPageUpdates[route] || siteContentLastModified),
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : 0.7,
      images: absoluteImageUrls(staticPageImages[route]),
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: new Date(productPageUpdates[product.slug] || productContentLastModified),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: absoluteImageUrls([product.image]),
    })),
    ...projectBriefs.flatMap(({ caseSlug }) => {
      const reference = getProjectBrief(caseSlug);
      return reference ? [{
        url: `${siteUrl}/project-cases/${caseSlug}`,
        lastModified: new Date(`${reference.brief.modifiedAt}T00:00:00.000Z`),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        images: absoluteImageUrls([reference.image.src]),
      }] : [];
    }),
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
      images: absoluteImageUrls([application.image]),
    })),
    ...interfaceTopics.map((topic) => ({
      url: `${siteUrl}/interfaces/${topic.slug}`,
      lastModified: new Date(`${topic.modifiedAt}T00:00:00.000Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
