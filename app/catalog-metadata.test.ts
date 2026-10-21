import { describe, expect, it } from "vitest";
import { generateMetadata as resourceMetadata } from "@/app/resources/page";
import { generateMetadata as caseMetadata } from "@/app/engineering-cases/page";

describe("paginated catalog metadata", () => {
  it("preserves the original Resources title and canonical after consolidation", async () => {
    const resources = await resourceMetadata({ searchParams: Promise.resolve({}) });
    expect(resources.alternates?.canonical).toBe("/resources");
    expect(resources.title).toBe("EV Charger Test Equipment & Testing Guides");
  });

  it("gives valid unfiltered pages their own canonical URLs", async () => {
    const metadata = await resourceMetadata({ searchParams: Promise.resolve({ page: "2" }) });
    expect(metadata.alternates?.canonical).toBe("/resources?page=2");
    expect(metadata.title).toContain("Page 2");
    const lastPage = await resourceMetadata({ searchParams: Promise.resolve({ page: "999" }) });
    expect(lastPage.alternates?.canonical).toBe("/resources?page=8");
  });

  it("consolidates all filtered and legacy variants to the unified index", async () => {
    for (const filters of [{ type: "guides" }, { type: "materials" }, { type: "scenarios" }, { view: "scenarios" }]) {
      const metadata = await resourceMetadata({ searchParams: Promise.resolve({ ...filters, page: "2" }) });
      expect(metadata.alternates?.canonical).toBe("/resources");
      expect(metadata.title).toBe("EV Charger Test Equipment & Testing Guides");
    }
  });

  it("publishes the independent engineering case index and its valid pages", async () => {
    const root = await caseMetadata({ searchParams: Promise.resolve({}) });
    expect(root.alternates?.canonical).toBe("/engineering-cases");
    expect(root.title).toBe("EV Charger Engineering Case References");
    const second = await caseMetadata({ searchParams: Promise.resolve({ page: "2" }) });
    expect(second.alternates?.canonical).toBe("/engineering-cases?page=2");
    expect(second.title).toContain("Page 2");
    const last = await caseMetadata({ searchParams: Promise.resolve({ page: "999" }) });
    expect(last.alternates?.canonical).toBe("/engineering-cases?page=3");
  });

  it("consolidates filtered engineering case variants to their own index", async () => {
    for (const filters of [{ category: "independent-testing" }, { q: "charging" }]) {
      const metadata = await caseMetadata({ searchParams: Promise.resolve({ ...filters, page: "2" }) });
      expect(metadata.alternates?.canonical).toBe("/engineering-cases");
      expect(metadata.title).toBe("EV Charger Engineering Case References");
    }
  });
});
