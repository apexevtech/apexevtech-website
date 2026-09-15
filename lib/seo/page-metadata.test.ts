import { describe, expect, it } from "vitest";
import { buildPageMetadata } from "@/lib/seo/page-metadata";

describe("page metadata", () => {
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
