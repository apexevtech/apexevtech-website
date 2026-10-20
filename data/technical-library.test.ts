import { describe, expect, it } from "vitest";
import {
  applicationScenarioCategories,
  applicationScenarios,
  solutionBriefCategories,
  solutionBriefs,
} from "@/data/technical-library";
import { getApplicationExample } from "@/data/applications";
import { getResource } from "@/lib/resources/catalog";
import { products } from "@/data/site";

const allEntries = [...solutionBriefs, ...applicationScenarios];

describe("APEX technical planning library", () => {
  it("provides six original solution briefs and eighteen application scenarios", () => {
    expect(solutionBriefs).toHaveLength(6);
    expect(applicationScenarios).toHaveLength(18);
    expect(new Set(allEntries.map((entry) => entry.id)).size).toBe(24);
    for (const entry of allEntries) {
      expect(entry.title.length).toBeGreaterThan(10);
      expect(entry.summary.length).toBeGreaterThan(100);
      expect(entry.requirements).toHaveLength(3);
      expect(entry.requirements.every((requirement) => requirement.length > 50)).toBe(true);
      expect(entry.reviewOutput.length).toBeGreaterThan(65);
      expect(entry.planningNote.length).toBeGreaterThan(90);
    }
  });

  it("uses non-overlapping solution and audience categories", () => {
    expect(solutionBriefCategories).toHaveLength(6);
    expect(applicationScenarioCategories).toHaveLength(4);
    const categoryIds = [...solutionBriefCategories, ...applicationScenarioCategories].map((category) => category.id);
    expect(new Set(categoryIds).size).toBe(10);
    expect(solutionBriefCategories.every((category) => category.id.startsWith("solution-"))).toBe(true);
    expect(applicationScenarioCategories.every((category) => category.id.startsWith("audience-"))).toBe(true);

    for (const [categories, entries] of [
      [solutionBriefCategories, solutionBriefs],
      [applicationScenarioCategories, applicationScenarios],
    ] as const) {
      expect(entries.every((entry) => categories.some((category) => category.id === entry.categoryId))).toBe(true);
      expect(categories.every((category) => entries.some((entry) => entry.categoryId === category.id))).toBe(true);
      expect(categories.every((category) => category.label.length > 5)).toBe(true);
    }
  });

  it("only connects planning content to existing APEX resources and architectures", () => {
    for (const entry of allEntries) {
      expect(entry.relatedHref).toMatch(/^\/(resources|applications|products)\/[a-z0-9-]+$/);
      expect(entry.relatedLabel.length).toBeGreaterThan(10);
      const [, section, slug] = entry.relatedHref.split("/");
      if (section === "resources") expect(getResource(slug)).toBeDefined();
      if (section === "applications") expect(getApplicationExample(slug)).toBeDefined();
      if (section === "products") expect(products.some((product) => product.slug === slug)).toBe(true);
    }
  });

  it("keeps original planning content free of customer case attribution, supplier media or delivery dates", () => {
    const content = JSON.stringify(allEntries.map((entry) => ({ ...entry, source: undefined })));
    expect(content).not.toMatch(/SAITER|saiter\.cn|case_detail|Shenzhen|Shanghai|Jiangsu|Changshu|Xuchang|China Quality|CCIC/i);
    expect(content).not.toMatch(/\b20\d{2}-\d{2}-\d{2}\b/);
    expect(content).not.toMatch(/customer testimonial|delivered to|certification achieved|measured improvement|proven results/i);
    for (const entry of allEntries) {
      expect(`${entry.title} ${entry.summary}`).not.toMatch(/European|Chinese|regional customer|institute|corporation|company/i);
      expect(entry).not.toHaveProperty("sourceUrl");
      expect(entry).not.toHaveProperty("sourceDate");
      expect(entry).not.toHaveProperty("customer");
      expect(entry).not.toHaveProperty("image");
      expect(entry).not.toHaveProperty("deliveryDate");
      expect(entry).not.toHaveProperty("testResult");
    }
  });

  it("cites each of the six solution pages and eighteen project pages exactly once", () => {
    const solutionPaths = [
      "/jjfn_1/1689151344388562944.html",
      "/jjfn_1/2.html",
      "/jjfn_1/3.html",
      "/jjfn_1/4.html",
      "/jjfn_1/5.html",
      "/jjfn_1/6.html",
    ];
    expect(solutionBriefs.map((entry) => new URL(entry.source.href).pathname)).toEqual(solutionPaths);
    expect(applicationScenarios.map((entry) => new URL(entry.source.href).pathname)).toEqual(
      Array.from({ length: 18 }, (_, index) => `/case_detail/${index + 1}.html`),
    );
    expect(new Set(allEntries.map((entry) => entry.source.href)).size).toBe(24);
    for (const { source } of allEntries) {
      expect(new URL(source.href).origin).toBe("https://www.saiter.cn");
      expect(source.publisher).toBe("SAITER");
      expect(source.title.length).toBeGreaterThan(10);
      expect(source.summary.trim().split(/\s+/).length).toBeGreaterThanOrEqual(25);
      expect(source.summary.trim().split(/\s+/).length).toBeLessThanOrEqual(45);
      expect(source.scopeNote).toMatch(/APEX/);
      expect(source.scopeNote).toMatch(/not|does not/);
      expect(Object.keys(source).sort()).toEqual(["href", "publisher", "scopeNote", "summary", "title"]);
    }
  });

  it("marks unsupported source topics and missing project evidence explicitly", () => {
    for (const id of ["field-diagnostics-planning", "custom-test-integration-planning"]) {
      const entry = solutionBriefs.find((item) => item.id === id);
      expect(entry?.source.scopeNote).toContain("Category reference only");
      expect(entry?.source.scopeNote).toContain("topic mismatch");
      expect(entry?.source.scopeNote).toContain("does not substantiate");
    }
    const sparseCase = applicationScenarios.find((entry) => entry.id === "third-party-measurement-plan");
    expect(sparseCase?.source.scopeNote).toContain("Title-level");
    expect(sparseCase?.source.summary).toContain("does not include a project narrative");
    for (const entry of applicationScenarios) {
      expect(entry.source.scopeNote).toMatch(/not (an? |evidence of an )APEX delivery/);
      expect(entry.source).not.toHaveProperty("customer");
      expect(entry.source).not.toHaveProperty("testResult");
    }
  });

  it("keeps battery and vehicle topics within an explicitly reviewed charger-project boundary", () => {
    const batteryBrief = solutionBriefs.find((entry) => entry.id === "battery-power-interface-planning");
    expect(batteryBrief?.planningNote).toContain("does not offer a battery test system");
    expect(batteryBrief?.relatedHref).toBe("/resources/choose-ev-charger-test-system");
    const vehicleScenario = applicationScenarios.find((entry) => entry.id === "vehicle-interaction-session-plan");
    expect(vehicleScenario?.planningNote).toContain("does not establish a vehicle development system offering");
    expect(allEntries.every((entry) => !entry.relatedHref.startsWith("/products/"))).toBe(true);
  });
});
