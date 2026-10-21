import { describe, expect, it } from "vitest";
import { getVerifiedSameAs, staticRoutes } from "@/lib/seo/site-urls";

describe("canonical static routes", () => {
  it("lists the merged project index instead of redirected catalog indexes", () => {
    expect(staticRoutes).toContain("/project-cases");
    expect(staticRoutes).not.toContain("/resources");
    expect(staticRoutes).not.toContain("/engineering-cases");
    expect(staticRoutes).not.toContain("/library");
  });
});

describe("verified entity profiles", () => {
  it("keeps only https URLs", () => {
    expect(getVerifiedSameAs("https://linkedin.com/company/apex,not-a-url,http://example.com")).toEqual([
      "https://linkedin.com/company/apex",
    ]);
  });
});
