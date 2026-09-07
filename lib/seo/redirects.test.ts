import { describe, expect, it } from "vitest";
import { legacyRedirects } from "@/lib/seo/redirects";

describe("legacy URL redirects", () => {
  it("redirects the malformed root URLs reported by Search Console", () => {
    expect(legacyRedirects).toEqual([
      { source: "/&", destination: "/", permanent: true },
      { source: "/$", destination: "/", permanent: true },
    ]);
  });
});
