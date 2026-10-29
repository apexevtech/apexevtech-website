import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { projectBriefs } from "@/data/project-briefs";
import { getProjectBrief, getResourceProjectBriefs } from "@/lib/engineering-cases/briefs";
import ResourcePage from "@/app/(en)/resources/[slug]/page";
import { RelatedProjectBriefs } from "./RelatedProjectBriefs";

describe("related scenario brief links", () => {
  it("connects each primary guide to its specific reference without replacing guide content", async () => {
    for (const brief of projectBriefs) {
      const { entry } = getProjectBrief(brief.caseSlug)!;
      expect(getResourceProjectBriefs(entry.relatedResourceSlug).map((reference) => reference.brief.caseSlug)).toEqual([brief.caseSlug]);
      const html = renderToStaticMarkup(createElement(RelatedProjectBriefs, { resourceSlug: entry.relatedResourceSlug }));
      expect(html).toContain(`href="/project-cases/${brief.caseSlug}"`);
      expect(html).toContain("Related scenario brief");
      const article = renderToStaticMarkup(await ResourcePage({ params: Promise.resolve({ slug: entry.relatedResourceSlug }) }));
      expect(article).toContain(`href="/project-cases/${brief.caseSlug}"`);
      expect(article).toContain('id="related-project-briefs"');
      expect(article).toContain("Common questions");
      expect(article).toContain("Equipment for this test scope");
    }
  });

  it("does not show an unrelated reference on other guides", () => {
    for (const slug of ["unknown", "choose-ev-charger-test-system", "sae-j3400-nacs-testing"]) {
      expect(getResourceProjectBriefs(slug)).toEqual([]);
      expect(renderToStaticMarkup(createElement(RelatedProjectBriefs, { resourceSlug: slug }))).toBe("");
    }
  });
});
