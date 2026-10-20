import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SourceCitation } from "./SourceCitation";
import { applicationScenarios, solutionBriefs } from "@/data/technical-library";

const entries = [...solutionBriefs, ...applicationScenarios];

describe("on-site source material display", () => {
  it("renders all source titles as text without an outbound link or external-link hint", () => {
    for (const { source } of entries) {
      const html = renderToStaticMarkup(createElement(SourceCitation, { source, headingLevel: "h3" }));
      expect(html).toContain(source.title.replaceAll("&", "&amp;"));
      expect(html).toContain('aria-label="Material details"');
      expect(html).not.toMatch(/Source:|Source reference image|aria-label="Source reference"/i);
      expect(html).not.toMatch(/<a\b|target=|saiter\.cn|opens in a new tab|lucide-external-link/i);
    }
  });

  it("renders only local images with stable dimensions, alt text and no image links", () => {
    const pictured = entries.filter((entry) => entry.source.image);
    expect(pictured).toHaveLength(9);
    expect(solutionBriefs.every((entry) => entry.source.image)).toBe(true);
    for (const { source } of pictured) {
      const html = renderToStaticMarkup(createElement(SourceCitation, { source, compact: true }));
      expect(html).toContain("<img ");
      expect(html).toContain(`width="${source.image!.width}"`);
      expect(html).toContain(`height="${source.image!.height}"`);
      expect(html).toContain(source.image!.alt);
      expect(html).toContain("%2Fassets%2Flibrary%2F");
      expect(html).not.toMatch(/<a\b|https?:\/\/|saiter\.cn/i);
      expect(html).not.toMatch(/<figcaption\b|Source reference image/i);
    }
  });

  it("supports a flat list presentation with text before the thumbnail", () => {
    const source = solutionBriefs[0].source;
    const html = renderToStaticMarkup(createElement(SourceCitation, { source, presentation: "list", headingLevel: "h3" }));
    expect(html).toContain("md:grid-cols-[minmax(0,1fr)_240px]");
    expect(html).toContain("text-lg leading-7");
    expect(html).not.toMatch(/border-l-2|order-first/);
    expect(html.indexOf("<h3")).toBeLessThan(html.indexOf("<figure"));
  });

  it("can retain technical context without repeating a title or image", () => {
    const source = solutionBriefs[0].source;
    const html = renderToStaticMarkup(createElement(SourceCitation, { source, compact: true, showImage: false, showTitle: false }));
    expect(html).toContain(source.summary.replaceAll("&", "&amp;"));
    expect(html).toContain(source.scopeNote.replaceAll("&", "&amp;"));
    expect(html).not.toContain(source.title.replaceAll("&", "&amp;"));
    expect(html).not.toMatch(/<img\b|<figure\b/);
  });
});
