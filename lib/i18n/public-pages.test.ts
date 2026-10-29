import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { resources } from "@/data/resources";
import { applicationExamples } from "@/data/applications";
import { interfaceTopics } from "@/data/interface-topics";
import { engineeringCaseDetailSlugs } from "@/lib/engineering-cases/detail-path";
import { staticRoutes } from "@/lib/seo/site-urls";
import { localizedPagePaths } from "./public-pages";

describe("published translated route registry", () => {
  it("matches the 55 canonical public pages without importing their content at runtime", () => {
    const expected = [
      ...staticRoutes.map((path) => path || "/"),
      ...products.map((product) => `/products/${product.slug}`),
      ...resources.map((resource) => `/resources/${resource.slug}`),
      ...applicationExamples.map((application) => `/applications/${application.slug}`),
      ...interfaceTopics.map((topic) => `/interfaces/${topic.slug}`),
      ...engineeringCaseDetailSlugs.map((slug) => `/project-cases/${slug}`),
    ];
    expect(localizedPagePaths).toHaveLength(55);
    expect(new Set(localizedPagePaths).size).toBe(55);
    expect([...localizedPagePaths].sort()).toEqual(expected.sort());
    expect(localizedPagePaths).not.toContain("/resources");
    expect(localizedPagePaths).not.toContain("/library");
    expect(localizedPagePaths.every((path) => !/[?#]/.test(path))).toBe(true);
  });
});
