import { describe, expect, it } from "vitest";
import { getVerifiedSameAs } from "@/lib/seo/site-urls";

describe("verified entity profiles", () => {
  it("keeps only https URLs", () => {
    expect(getVerifiedSameAs("https://linkedin.com/company/apex,not-a-url,http://example.com")).toEqual([
      "https://linkedin.com/company/apex",
    ]);
  });
});
