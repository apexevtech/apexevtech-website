import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("footer contact tracking", () => {
  it("tracks WhatsApp clicks from the footer", () => {
    const source = readFileSync(join(process.cwd(), "components", "Footer.tsx"), "utf8");

    expect(source).toContain('eventName="whatsapp_click"');
    expect(source).toContain('location="footer"');
  });

  it("uses a single Project Cases link in place of separate case and resource entries", () => {
    const html = renderToStaticMarkup(createElement(Footer));
    expect(html.match(/href="\/project-cases"/g)).toHaveLength(1);
    expect(html).toContain(">Project Cases</a>");
    expect(html).not.toContain('href="/engineering-cases"');
    expect(html).not.toContain('href="/resources"');
    expect(html).toContain('href="/privacy-policy"');
    expect(html).toContain('href="/contact"');
  });
});
