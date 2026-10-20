import { describe, expect, it } from "vitest";
import { generateMetadata as libraryMetadata } from "@/app/library/page";
import { generateMetadata as resourceMetadata } from "@/app/resources/page";

describe("paginated catalog metadata", () => {
  it("preserves the original root titles and canonicals", async () => {
    const library = await libraryMetadata({ searchParams: Promise.resolve({}) });
    const resources = await resourceMetadata({ searchParams: Promise.resolve({}) });
    expect(library.alternates?.canonical).toBe("/library");
    expect(resources.alternates?.canonical).toBe("/resources");
    expect(resources.title).toBe("EV Charger Test Equipment & Testing Guides");
  });

  it("gives valid unfiltered pages their own canonical URLs", async () => {
    for (const [generate, path] of [[libraryMetadata, "/library"], [resourceMetadata, "/resources"]] as const) {
      const metadata = await generate({ searchParams: Promise.resolve({ page: "2" }) });
      expect(metadata.alternates?.canonical).toBe(`${path}?page=2`);
      expect(metadata.title).toContain("Page 2");
    }
    const library = await libraryMetadata({ searchParams: Promise.resolve({ page: "999" }) });
    expect(library.alternates?.canonical).toBe("/library?page=4");
  });

  it("consolidates filtered variants to the main indexes", async () => {
    const library = await libraryMetadata({ searchParams: Promise.resolve({ view: "scenarios", page: "2" }) });
    const resources = await resourceMetadata({ searchParams: Promise.resolve({ type: "guides", page: "2" }) });
    expect(library.alternates?.canonical).toBe("/library");
    expect(resources.alternates?.canonical).toBe("/resources");
  });
});
