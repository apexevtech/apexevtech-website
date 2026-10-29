import { describe, expect, it } from "vitest";
import { generateMetadata } from "@/app/(en)/project-cases/page";
import { getCatalogMetadataState } from "@/lib/seo/catalog-metadata";

describe("paginated catalog metadata", () => {
  it("preserves the Resources title inside the merged project hub", async () => {
    const resources = await generateMetadata({ searchParams: Promise.resolve({ section: "resources" }) });
    expect(resources.alternates?.canonical).toBe("/project-cases?section=resources");
    expect(resources.title).toBe("EV Charger Test Equipment & Testing Guides");
  });

  it("gives valid unfiltered pages their own canonical URLs", async () => {
    const metadata = await generateMetadata({ searchParams: Promise.resolve({ section: "resources", page: "2" }) });
    expect(metadata.alternates?.canonical).toBe("/project-cases?section=resources&page=2");
    expect(metadata.title).toContain("Page 2");
    const lastPage = await generateMetadata({ searchParams: Promise.resolve({ section: "resources", page: "999" }) });
    expect(lastPage.alternates?.canonical).toBe("/project-cases?section=resources&page=8");
  });

  it("consolidates all filtered and legacy variants to the unified index", async () => {
    for (const filters of [{ type: "guides" }, { type: "materials" }, { type: "scenarios" }, { view: "scenarios" }]) {
      const metadata = await generateMetadata({ searchParams: Promise.resolve({ section: "resources", ...filters, page: "2" }) });
      expect(metadata.alternates?.canonical).toBe("/project-cases?section=resources");
      expect(metadata.title).toBe("EV Charger Test Equipment & Testing Guides");
    }
  });

  it("publishes the Project Cases index and its valid engineering pages", async () => {
    const root = await generateMetadata({ searchParams: Promise.resolve({}) });
    expect(root.alternates?.canonical).toBe("/project-cases");
    expect(root.title).toBe("EV Charger Project Cases & Testing References");
    const second = await generateMetadata({ searchParams: Promise.resolve({ page: "2" }) });
    expect(second.alternates?.canonical).toBe("/project-cases?page=2");
    expect(second.title).toContain("Page 2");
    const last = await generateMetadata({ searchParams: Promise.resolve({ page: "999" }) });
    expect(last.alternates?.canonical).toBe("/project-cases?page=3");
  });

  it("consolidates filtered engineering case variants to their own index", async () => {
    for (const filters of [{ category: "independent-testing" }, { q: "charging" }]) {
      const metadata = await generateMetadata({ searchParams: Promise.resolve({ ...filters, page: "2" }) });
      expect(metadata.alternates?.canonical).toBe("/project-cases");
      expect(metadata.title).toBe("EV Charger Project Cases & Testing References");
    }
  });

  it("adds page numbers to an existing query without a duplicate question mark", () => {
    expect(getCatalogMetadataState("/project-cases?section=resources", "Resources", 2, false))
      .toEqual({ title: "Resources - Page 2", path: "/project-cases?section=resources&page=2" });
    expect(getCatalogMetadataState("/project-cases?section=resources", "Resources", 2, true))
      .toEqual({ title: "Resources", path: "/project-cases?section=resources" });
  });
});
