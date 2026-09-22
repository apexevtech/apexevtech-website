import { describe, expect, it } from "vitest";
import { buildStructuredData } from "@/lib/seo/structured-data";

describe("structured SEO data", () => {
  it("describes the active company and site", () => {
    const data = buildStructuredData("https://www.link-jl.com");

    expect(data).toEqual([
      expect.objectContaining({
        "@type": "Organization",
        name: "Apex Power Systems (Nanjing) Co., Ltd.",
        url: "https://www.link-jl.com",
        logo: "https://www.link-jl.com/assets/apex-logo.webp",
        email: "gu@apexps-nj.com",
        contactPoint: expect.objectContaining({ contactType: "sales and technical inquiries" }),
      }),
      expect.objectContaining({
        "@type": "WebSite",
        name: "APEX EV Charging Test & Validation Solutions",
        url: "https://www.link-jl.com",
      }),
    ]);
  });
});
