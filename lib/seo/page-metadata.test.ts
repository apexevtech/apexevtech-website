import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

describe("page metadata", () => {
  it("describes resource shares as articles with matching dates", () => {
    const metadata = buildPageMetadata({
      title: "Engineering guide",
      description: "Charger testing guidance",
      path: "/resources/guide",
      article: { publishedAt: "2026-08-28", modifiedAt: "2026-09-16" },
    });
    expect(metadata.openGraph).toMatchObject({
      type: "article", publishedTime: "2026-08-28", modifiedTime: "2026-09-16",
      url: "https://www.link-jl.com/resources/guide",
    });
  });
  it("keeps social URLs aligned with the page canonical", () => {
    const metadata = buildPageMetadata({
      title: "Solutions",
      description: "Test solutions",
      path: "/solutions",
    });

    expect(metadata.alternates?.canonical).toBe("/solutions");
    expect(metadata.openGraph?.url).toBe("https://www.link-jl.com/solutions");
    expect(metadata.twitter?.images).toContain("/assets/hero/test-lab-systems.webp");
  });
});
