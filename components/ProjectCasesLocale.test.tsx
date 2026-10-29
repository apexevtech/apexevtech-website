import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { engineeringCases } from "@/data/engineering-cases";
import { projectMessages } from "@/lib/i18n/messages-projects";
import { defaultEngineeringCaseFilters } from "@/lib/engineering-cases/filter";
import { getEngineeringCaseDetailHref } from "@/lib/engineering-cases/detail-path";
import { defaultResourceBrowserFilters, resourceBrowserEntries } from "@/lib/resources/browser";
import { EngineeringCaseBrowser } from "./EngineeringCaseBrowser";
import { EngineeringCaseCard } from "./EngineeringCaseCard";
import { ResourceBrowser } from "./ResourceBrowser";
import { ResourceMaterial } from "./ResourceMaterial";

vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  return { useLanguage: () => ({ language: "zh", t: (text: string) => translateText(text, "zh", messages) }) };
});

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }), useSearchParams: () => new URLSearchParams() }));

describe("Chinese project case display", () => {
  it("localizes engineering cards and guide destinations while preserving anchors and inquiry context", () => {
    const entry = engineeringCases[0];
    const html = renderToStaticMarkup(createElement(EngineeringCaseCard, { entry }));
    expect(html).toContain(projectMessages[entry.title]);
    expect(html).toContain(projectMessages[entry.summary]);
    expect(html).toContain(`alt="${projectMessages[entry.image!.alt]}"`);
    expect(html).toContain(`aria-label="技术详情： ${projectMessages[entry.title]}"`);
    expect(html).toContain(`id="${entry.slug}"`);
    expect(html).toContain(`href="/zh/resources/${entry.relatedResourceSlug}"`);
    expect(html).toContain(`href="/zh/contact?case=${entry.slug}#inquiry-form"`);
    expect(html).not.toContain("/zh/zh/");
    expect(html).toContain("咨询类似配置");
    expect(html).toContain("参考场景，最终配置需经工程评审。");
    expect(html).not.toContain("Discuss a similar configuration");
    for (const text of entry.technicalFocus) expect(html).toContain(`<li>${projectMessages[text]}</li>`);
  });

  it("localizes the complete planning disclosure and retains honest source limitations", () => {
    const entry = resourceBrowserEntries.find((item) => item.kind === "source")!;
    const html = renderToStaticMarkup(createElement(ResourceMaterial, { entry, category: "Laboratory & production" }));
    expect(html).toContain("实验室与生产");
    for (const text of [entry.material.title, entry.material.summary, ...entry.material.requirements, entry.material.reviewOutput, entry.material.planningNote, entry.material.source.summary, entry.material.source.scopeNote]) expect(html).toContain(projectMessages[text]);
    expect(html).toContain("不作为 APEX 交付证明");
    expect(html).toContain(`href="/zh${entry.material.relatedHref}"`);
  });

  it("provides Chinese destinations only for the three published scenario briefs", () => {
    for (const entry of engineeringCases) {
      const html = renderToStaticMarkup(createElement(EngineeringCaseCard, { entry }));
      const detailHref = getEngineeringCaseDetailHref(entry.slug);
      expect(html).not.toContain("View scenario brief");
      if (detailHref) {
        expect(html).toContain("查看场景简介");
        expect(html).toContain(`href="/zh${detailHref}"`);
      } else {
        expect(html).not.toContain("查看场景简介");
        expect(html).not.toContain(`href="/zh/project-cases/${entry.slug}"`);
        expect(html).not.toContain(`href="/project-cases/${entry.slug}"`);
      }
      expect(html).toContain("咨询类似配置");
      expect(html).toContain("相关测试指南");
    }
  });

  it("localizes engineering filters, search, count and structured-data names and destinations", () => {
    const html = renderToStaticMarkup(createElement(EngineeringCaseBrowser, { initialFilters: defaultEngineeringCaseFilters }));
    expect(html).toContain("共 18 个案例，显示 1-6");
    expect(html).toContain('placeholder="搜索案例"');
    expect(html).toContain("认证机构");
    expect(html).toContain("政府机构");
    const data = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
    expect(data.name).toBe("充电桩项目案例与测试参考");
    expect(data.url).toBe("https://www.link-jl.com/zh/project-cases#engineering-case-results");
    expect(data.numberOfItems).toBe(6);
    expect(data.itemListElement).toHaveLength(6);
    for (const [index, item] of data.itemListElement.entries()) {
      expect(item.name).toBe(projectMessages[engineeringCases[index].title]);
      expect(item.url).toBe(`https://www.link-jl.com/zh/project-cases#${engineeringCases[index].slug}`);
      expect(item.position).toBe(index + 1);
    }
  });

  it("shows translated material tabs and Chinese empty states", () => {
    const html = renderToStaticMarkup(createElement(ResourceBrowser, { initialFilters: { ...defaultResourceBrowserFilters, query: "没有匹配的示例-258" } }));
    expect(html).toContain("共 0 份资料");
    expect(html).toContain('placeholder="搜索资料"');
    expect(html).toContain("所有资料");
    expect(html).toContain("解决方案简介");
    expect(html).toContain("未找到匹配资料");
    expect(html).not.toContain("<article");
  });
});
