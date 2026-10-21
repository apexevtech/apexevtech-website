import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { engineeringCases } from "@/data/engineering-cases";
import { EngineeringCaseCard } from "./EngineeringCaseCard";

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

describe("engineering case gallery cards", () => {
  it("renders one matched local image per illustrated reference without cropping equipment", () => {
    const pictured = engineeringCases.filter((entry) => entry.image);
    expect(pictured).toHaveLength(5);
    for (const entry of pictured) {
      const html = renderToStaticMarkup(createElement(EngineeringCaseCard, { entry }));
      expect(html.match(/<img\b/g)).toHaveLength(1);
      expect(html).toContain(escape(entry.image!.alt));
      expect(html).toContain(encodeURIComponent(entry.image!.src));
      expect(html).toContain('class="h-full w-full object-contain');
      expect(html).toContain(`width="${entry.image!.width}"`);
      expect(html).toContain(`height="${entry.image!.height}"`);
      expect(html).not.toContain("Technical scope");
      expect(html).not.toMatch(/object-cover|<figcaption\b|(?:href|src)="https?:\/\/|saiter\.cn/i);
    }
  });

  it("uses actual technical focus rather than unrelated images for references without a photo", () => {
    for (const entry of engineeringCases.filter((item) => !item.image)) {
      const html = renderToStaticMarkup(createElement(EngineeringCaseCard, { entry }));
      const summary = html.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/)![1];
      expect(html).not.toMatch(/<img\b/);
      expect(summary).toContain("Technical scope");
      expect(summary).toContain(escape(entry.technicalFocus[0]));
      expect(summary).toContain('class="line-clamp-2 text-sm leading-6"');
      expect(html).not.toMatch(/image missing|loading error|placeholder image/i);
    }
  });

  it("keeps complete accessible native disclosures and crawlable guide links in server markup", () => {
    for (const entry of engineeringCases) {
      const html = renderToStaticMarkup(createElement(EngineeringCaseCard, { entry }));
      expect(html).toContain(`id="${entry.slug}"`);
      expect(html).toContain(`aria-labelledby="${entry.slug}-title"`);
      expect(html).toContain(`aria-label="Technical details: ${escape(entry.title)}"`);
      expect(html.match(/<details\b/g)).toHaveLength(1);
      expect(html.match(/<summary\b/g)).toHaveLength(1);
      expect(html).not.toMatch(/<details[^>]*\bopen(?:=|\s|>)/);
      expect(html).toContain(escape(entry.summary));
      for (const focus of entry.technicalFocus) expect(html).toContain(`<li>${escape(focus)}</li>`);
      expect(html).toContain(`href="/resources/${entry.relatedResourceSlug}"`);
      expect(html).toContain("Related testing guide");
      expect(html).toContain("group-open/case:line-clamp-none");
      expect(html).not.toMatch(/href="https?:|saiter\.cn|Source reference image|verified APEX projects|APEX customers/i);
      const summary = html.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/)![1];
      expect(summary).not.toMatch(/<a\b|<button\b/);
    }
  });
});
