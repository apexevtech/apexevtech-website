import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { engineeringCaseCategories, engineeringCases } from "@/data/engineering-cases";
import { getResource } from "@/lib/resources/catalog";

describe("engineering case references", () => {
  it("preserves all eighteen references with unique stable ids and readable slugs", () => {
    expect(engineeringCases).toHaveLength(18);
    expect(engineeringCases.map((entry) => entry.id)).toEqual(
      Array.from({ length: 18 }, (_, index) => `case-${index + 1}`),
    );
    expect(new Set(engineeringCases.map((entry) => entry.slug)).size).toBe(18);
    expect(new Set(engineeringCases.map((entry) => entry.title)).size).toBe(18);
    for (const entry of engineeringCases) {
      expect(entry.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)+$/);
      expect(entry.title.length).toBeGreaterThan(15);
      expect(entry.summary.split(/\s+/).length).toBeGreaterThanOrEqual(20);
      expect(entry.summary.split(/\s+/).length).toBeLessThanOrEqual(35);
      expect(entry.technicalFocus.length).toBeGreaterThanOrEqual(2);
      expect(entry.technicalFocus.length).toBeLessThanOrEqual(3);
      expect(entry.technicalFocus.every((topic) => topic.trim().length > 5)).toBe(true);
    }
  });

  it("retains the four public audience groupings without recategorizing references", () => {
    expect(engineeringCaseCategories.map((category) => category.id)).toEqual([
      "vehicle-engineering", "independent-testing", "public-inspection", "charger-manufacturing",
    ]);
    expect(engineeringCaseCategories.map((category) => category.label)).toEqual([
      "Vehicle Manufacturers", "Certification Bodies", "Government Agencies", "Charger Manufacturers",
    ]);
    const categoryCases = Object.fromEntries(engineeringCaseCategories.map((category) => [
      category.id,
      engineeringCases.filter((entry) => entry.categoryId === category.id).map((entry) => entry.id),
    ]));
    expect(categoryCases).toEqual({
      "vehicle-engineering": ["case-15", "case-16"],
      "independent-testing": ["case-4", "case-5", "case-6", "case-7", "case-8", "case-9", "case-10", "case-11", "case-12", "case-13"],
      "public-inspection": ["case-2", "case-3"],
      "charger-manufacturing": ["case-1", "case-14", "case-17", "case-18"],
    });
    expect(engineeringCaseCategories.every((category) => category.label.length > 8)).toBe(true);
  });

  it("links each reference to an existing technical guide", () => {
    for (const entry of engineeringCases) {
      expect(getResource(entry.relatedResourceSlug)).toBeDefined();
      expect(entry.relatedResourceSlug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("avoids customer attribution, model lists, external links and invented results", () => {
    const content = JSON.stringify(engineeringCases);
    expect(content).not.toMatch(/https?:|saiter\.cn|case_detail|SAITER|APEX|\bST-\d|\bST-HC|\bAST-/i);
    expect(content).not.toMatch(/Shenzhen|Shanghai|Jiangsu|Changshu|Xuchang|CQC|CCIC|China Quality|China Inspection/i);
    expect(content).not.toMatch(/delivered to|certification achieved|proven results|\d+\s?%|\d+\s?kW|\d+\s?kWh/i);
    for (const entry of engineeringCases) {
      expect(entry).not.toHaveProperty("customer");
      expect(entry).not.toHaveProperty("publisher");
      expect(entry).not.toHaveProperty("sourceUrl");
      expect(entry).not.toHaveProperty("deliveryDate");
      expect(entry).not.toHaveProperty("testResult");
    }
    const publicModule = readFileSync(join(process.cwd(), "data/engineering-cases.ts"), "utf8");
    expect(publicModule).not.toMatch(/https?:|saiter\.cn|docs\/operations|\.json["']/i);
  });

  it("preserves sparse-reference and historical-standard boundaries with the technical scope", () => {
    expect(engineeringCases.find((entry) => entry.id === "case-5")?.summary).toContain("No readable project narrative");
    expect(engineeringCases.find((entry) => entry.id === "case-8")?.summary).toContain("no completed testing outcome is inferred");
    expect(engineeringCases.find((entry) => entry.id === "case-7")?.summary).toContain("historical standards");
    expect(engineeringCases.find((entry) => entry.id === "case-14")?.summary).toContain("production batches and serial numbers");
    expect(engineeringCases.find((entry) => entry.id === "case-18")?.summary).toContain("measurement instruments, controllers, power equipment and analysis software");
  });

  it("uses matching local authorized images with accurate intrinsic dimensions", async () => {
    const { default: sharp } = await import("sharp");
    const illustratedEntries = engineeringCases.filter((entry) => entry.image);
    expect(illustratedEntries.map((entry) => entry.id)).toEqual(engineeringCases.map((entry) => entry.id));
    expect(illustratedEntries).toHaveLength(18);
    expect(new Set(illustratedEntries.map((entry) => entry.image!.src)).size).toBe(18);
    const existingImagePaths: Record<string, string> = {
      "case-1": "/assets/library/case-1-system.png",
      "case-2": "/assets/engineering-cases/case-2-portable-system.webp",
      "case-5": "/assets/engineering-cases/case-5-laboratory-system.webp",
      "case-11": "/assets/library/case-11-system.jpg",
      "case-14": "/assets/library/case-14-system.png",
    };
    for (const { id, image } of illustratedEntries) {
      expect(image).toBeDefined();
      if (!image) continue;
      expect(image.src).toBe(existingImagePaths[id] ?? `/assets/engineering-cases/${id}-system.webp`);
      expect(image.src).toMatch(new RegExp(`^/assets/(library|engineering-cases)/${id}-(?:portable-|laboratory-)?system\\.(png|jpg|webp)$`));
      expect(image.alt.length).toBeGreaterThan(15);
      expect(image.alt).not.toMatch(/APEX|customer|delivered|certified/i);
      const file = join(process.cwd(), "public", image.src);
      expect(existsSync(file)).toBe(true);
      const metadata = await sharp(file).metadata();
      if (image.src.startsWith("/assets/engineering-cases/")) expect(metadata.format).toBe("webp");
      expect(metadata.width).toBe(image.width);
      expect(metadata.height).toBe(image.height);
    }
  });
});
