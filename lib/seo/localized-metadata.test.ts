import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import { resources } from "@/data/resources";
import { applicationExamples } from "@/data/applications";
import { interfaceTopics } from "@/data/interface-topics";
import { projectBriefs } from "@/data/project-briefs";
import { priorityProductSeo } from "@/lib/products/seo";
import { getCatalogMetadataState, projectCasesIndexTitle, resourceIndexTitle } from "./catalog-metadata";
import { buildPageMetadata } from "./page-metadata";
import { localizePageMetadata } from "./localized-metadata";
import { siteUrl } from "./site-urls";

describe("localized page metadata", () => {
  it("gives each supported language its own canonical and reciprocal canonical alternates", () => {
    const english = buildPageMetadata({ title: "EV Charger Test Equipment & Testing Guides", description: "Test solutions", path: "/project-cases?section=resources&page=2", image: "/assets/social/resources.png" });
    const chinese = localizePageMetadata(english, "zh");
    expect(english.title).toBe("EV Charger Test Equipment & Testing Guides");
    expect(english.alternates?.canonical).toBe("/project-cases?section=resources&page=2");
    expect(chinese.title).toBe("充电桩测试设备与技术指南");
    expect(chinese.alternates?.canonical).toBe("/zh/project-cases?section=resources&page=2");
    expect(chinese.alternates?.languages).toEqual({
      en: `${siteUrl}/project-cases?section=resources&page=2`,
      "zh-Hans": `${siteUrl}/zh/project-cases?section=resources&page=2`,
      "x-default": `${siteUrl}/project-cases?section=resources&page=2`,
    });
    expect(english.alternates?.languages).toEqual(chinese.alternates?.languages);
    expect(chinese.openGraph?.url).toBe(`${siteUrl}/zh/project-cases?section=resources&page=2`);
    expect(chinese.openGraph?.images).toEqual(english.openGraph?.images);
    expect(chinese.twitter?.images).toEqual(english.twitter?.images);
    expect(localizePageMetadata(chinese, "zh")).toEqual(chinese);
  });

  it("translates paginated collection titles without inventing filtered canonical pages", () => {
    for (const [path, title] of [["/project-cases", projectCasesIndexTitle], ["/project-cases?section=resources", resourceIndexTitle]]) {
      const page = localizePageMetadata(buildPageMetadata({ ...getCatalogMetadataState(path, title, 2, false), description: "Test solutions" }), "zh");
      expect(page.title).toMatch(/第 2 页$/);
      expect(page.alternates?.canonical).toContain("page=2");
      const filtered = localizePageMetadata(buildPageMetadata({ ...getCatalogMetadataState(path, title, 2, true), description: "Test solutions" }), "zh");
      expect(filtered.title).not.toContain("第 2 页");
      expect(filtered.alternates?.canonical).toBe(`/zh${path}`);
      expect(JSON.stringify(filtered.alternates)).not.toContain("page=2");
    }
  });

  it("supports title templates and absolute titles while preserving English metadata", () => {
    const title = "APEX EV Charger Test Lab Equipment & AC/DC EVSE Systems";
    const absolute: Metadata = { title: { absolute: title }, alternates: { canonical: "/" }, openGraph: { title: "EV Charger Test Equipment & EVSE Testing Solutions | APEX", images: ["/assets/social/home.png"] } };
    expect(localizePageMetadata(absolute, "en").title).toEqual(absolute.title);
    expect(localizePageMetadata(absolute, "zh").title).toEqual({ absolute: "APEX 充电测试实验室设备与交直流充电测试系统" });
    expect(localizePageMetadata(absolute, "zh").openGraph?.title).toBe("电动汽车充电测试设备与充电设施测试方案 | APEX");
    const template: Metadata = { title: { default: title, template: "%s | APEX" }, alternates: { canonical: "/" } };
    expect(localizePageMetadata(template, "zh").title).toEqual({ default: "APEX 充电测试实验室设备与交直流充电测试系统", template: "%s | APEX" });
  });

  it("does not advertise untranslated or unsupported pages as Chinese alternates", () => {
    for (const path of ["/resources/unknown", "/api/inquiries", "/downloads/spec.docx", "https://example.com/products"]) {
      const metadata = localizePageMetadata({ title: "Unknown", alternates: { canonical: path } }, "zh");
      expect(metadata.alternates?.canonical).toBe(path);
      expect(metadata.alternates?.languages).toBeUndefined();
    }
  });

  it("covers the full detail-page metadata without translating models, units or images", () => {
    const entries = [
      ...resources.map((entry) => ({ ...entry, path: `/resources/${entry.slug}` })),
      ...applicationExamples.map((entry) => ({ ...entry, path: `/applications/${entry.slug}` })),
      ...interfaceTopics.map((entry) => ({ ...entry, path: `/interfaces/${entry.slug}` })),
      ...projectBriefs.map((entry) => ({ ...entry, path: `/project-cases/${entry.caseSlug}` })),
      ...Object.entries(priorityProductSeo).map(([slug, entry]) => ({ ...entry, path: `/products/${slug}` })),
    ];
    expect(entries).toHaveLength(47);
    for (const entry of entries) {
      const chinese = buildPageMetadata({ title: entry.title, description: entry.description, path: entry.path, language: "zh" });
      expect.soft(chinese.title, entry.path).toMatch(/[\u3400-\u9fff]/);
      expect.soft(chinese.description, entry.path).toMatch(/[\u3400-\u9fff]/);
      expect(chinese.alternates?.canonical).toBe(`/zh${entry.path}`);
      expect(chinese.openGraph?.images).toEqual(["/assets/hero/test-lab-systems.webp"]);
    }
  });
});
