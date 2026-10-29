import { describe, expect, it } from "vitest";
import { messages } from "@/lib/i18n/zh";
import { translateText } from "@/lib/i18n/translate";
import { localizeStructuredData } from "./localized-structured-data";
import { siteUrl } from "./site-urls";

const t = (value: string) => translateText(value, "zh", messages);

describe("localized structured data", () => {
  it("localizes visible Article and FAQ strings and their canonical page URLs", () => {
    const source = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "EV Charger Test Equipment & Testing Guides",
      description: "EV charging protocol diagnosis",
      inLanguage: "en",
      url: `${siteUrl}/resources/ev-charging-protocol-testing`,
      mainEntityOfPage: `${siteUrl}/resources/ev-charging-protocol-testing`,
      image: `${siteUrl}/assets/social/resources.png`,
      author: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: "APEX", url: `${siteUrl}/` },
      publisher: { "@id": `${siteUrl}/#organization` },
      mainEntity: [{ "@type": "Question", name: "Is decoded protocol data enough for fault analysis?", acceptedAnswer: { "@type": "Answer", text: "Not always. Keep raw traffic and timestamps because message timing, repetition and encoding details may be needed to explain a failure." } }],
    };
    const result = localizeStructuredData(source, "zh", t);
    expect(result.headline).toBe("充电桩测试设备与技术指南");
    expect(result.description).toBe("充电协议诊断");
    expect(result.url).toBe(`${siteUrl}/zh/resources/ev-charging-protocol-testing`);
    expect(result.mainEntityOfPage).toBe(result.url);
    expect(result.inLanguage).toBe("zh-Hans");
    expect(result.mainEntity[0].name).toMatch(/[\u3400-\u9fff]/);
    expect(result.mainEntity[0].acceptedAnswer.text).toMatch(/[\u3400-\u9fff]/);
    expect(result.image).toBe(source.image);
    expect(result.author["@id"]).toBe(source.author["@id"]);
    expect(result.publisher["@id"]).toBe(source.publisher["@id"]);
    expect(result.author.name).toBe("APEX");
    expect(source.inLanguage).toBe("en");
  });

  it("preserves technical identifiers, external profiles, assets and unsupported destinations", () => {
    const source = {
      "@context": "https://schema.org", "@type": "Product", name: "ST-9980EA-HPC", model: "ST-9980EA-HPC", sku: "ST-9980EA-HPC", identifier: "ISO 15118", value: "1000 V / 500 A",
      image: "/assets/products/test.webp", logo: "/assets/apex-logo.webp", sameAs: ["https://example.com/company/apex"],
      subjectOf: [{ url: "/downloads/test.docx" }, { url: `${siteUrl}/resources/unknown` }, { url: "https://example.com/resources/ev-charging-protocol-testing" }],
    };
    expect(localizeStructuredData(source, "zh", t)).toEqual(source);
    expect(localizeStructuredData(source, "en", t)).toBe(source);
  });

  it("localizes page and breadcrumb URLs while preserving query and item anchors", () => {
    const source = { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", name: "Technical materials", item: `${siteUrl}/project-cases?section=resources&page=8` }, { "@type": "ListItem", name: "Home", item: "/" }] };
    const localized = localizeStructuredData(source, "zh", t);
    expect(localized.itemListElement[0]).toMatchObject({ name: "技术资料", item: `${siteUrl}/zh/project-cases?section=resources&page=8` });
    expect(localized.itemListElement[1]).toMatchObject({ name: "首页", item: "/zh" });
    expect(localizeStructuredData({ "@type": "ItemList", url: "/project-cases?page=3#engineering-case-results" }, "zh", t).url).toBe("/zh/project-cases?page=3#engineering-case-results");
  });
});
