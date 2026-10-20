import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { applicationScenarios, solutionBriefs } from "@/data/technical-library";
import { LibraryEntry } from "./TechnicalLibrary";

describe("technical library material layout", () => {
  it("keeps the brief summary prominent and supporting context expandable", () => {
    const entry = solutionBriefs[0];
    const html = renderToStaticMarkup(createElement(LibraryEntry, {
      entry, category: "EVSE laboratory", kind: "solution", number: 1,
    }));

    expect(html).toContain('id="material-evse-laboratory-planning"');
    expect(html).toContain("01</span>");
    expect(html.indexOf(entry.summary)).toBeLessThan(html.indexOf("<details"));
    expect(html).toContain("Planning checklist");
    expect(html).toContain("Technical context");
    expect(html).toContain(entry.planningNote);
    expect(html).toContain(entry.source.scopeNote);
    expect(html).not.toMatch(/<details[^>]*\bopen\b/);
    expect((html.match(/<h3\b/g) || [])).toHaveLength(1);
    expect(html).not.toContain(entry.source.title);
  });

  it("shows each authorized local image once without outbound destinations", () => {
    for (const entry of [...solutionBriefs, ...applicationScenarios]) {
      const html = renderToStaticMarkup(createElement(LibraryEntry, {
        entry, category: "Testing", kind: "application", number: 7,
      }));
      expect((html.match(/<img\b/g) || []).length).toBe(entry.source.image ? 1 : 0);
      expect(html).toContain(`href="${entry.relatedHref}"`);
      expect(html).not.toMatch(/saiter\.cn|href="https?:|Source:|Source reference image/i);
      expect(html).toContain(entry.source.scopeNote.replaceAll("&", "&amp;"));
    }
  });
});
