import { describe, expect, it } from "vitest";
import { generateMetadata as resourceMetadata } from "@/app/resources/page";

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
});
