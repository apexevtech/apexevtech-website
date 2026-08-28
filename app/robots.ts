import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo/site-urls";

const aiAgents = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      ...aiAgents.map((userAgent) => ({ userAgent, allow: "/" })),
      {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
