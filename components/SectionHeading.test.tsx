import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { SectionHeading } from "./SectionHeading";

const content = { eyebrow: "Testing solutions", title: "EV charging laboratory", description: "Laboratory and field testing." };

describe("section heading typography", () => {
  it("keeps heading copy and hierarchy with relaxed bold display typography", () => {
    const html = renderToStaticMarkup(createElement(SectionHeading, content));
    expect(html).toContain(content.eyebrow);
    expect(html).toContain(content.description);
    expect(html).toContain(`<h2 class="mt-3 text-3xl font-bold leading-[1.25] md:text-4xl text-[#12263a]">${content.title}</h2>`);
    expect(html).not.toMatch(/text-\[[^\]]*vw|leading-\[1\.12\]/);
  });

  it("uses semibold compact typography and does not create an empty description", () => {
    const html = renderToStaticMarkup(createElement(SectionHeading, { eyebrow: content.eyebrow, title: content.title, compact: true }));
    expect(html).toContain(`<h2 class="mt-2 text-2xl font-semibold leading-[1.3] md:text-3xl text-[#12263a]">${content.title}</h2>`);
    expect(html).toContain("mb-5");
    expect(html.match(/<p\b/g)).toHaveLength(1);
    expect(html).not.toContain(content.description);
  });
});
