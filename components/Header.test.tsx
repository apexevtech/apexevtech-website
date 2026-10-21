import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./Header";
import { company, navItems } from "@/data/site";

const navigation = vi.hoisted(() => ({ pathname: "/resources" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

function navigationAttributes(html: string, label: string) {
  return html.match(new RegExp(`<(?:a|button)\\b([^>]*)>${label}(?:\\s|<)`))![1];
}

describe("main navigation emphasis", () => {
  beforeEach(() => {
    navigation.pathname = "/resources";
  });

  it("keeps the original brand, destinations, inquiry action and header height", () => {
    const html = renderToStaticMarkup(createElement(Header));
    expect(html).toContain('aria-label="Main navigation"');
    expect(html).toContain(`aria-label="${company.name} home"`);
    expect(html).toContain("Apex Power Systems");
    expect(html).toContain("h-[76px]");
    for (const item of navItems.filter((item) => item.label !== "Products")) {
      expect(html).toContain(`href="${item.href}"`);
      expect(navigationAttributes(html, item.label)).toContain("text-base font-bold");
    }
    expect(html).toContain('href="/contact#inquiry-form"');
    expect(html).toContain("Talk to an engineer");
    expect(html).toContain("2xl:max-w-[1440px]");
    expect(html).toContain("shrink-0 items-center gap-4");
  });

  it("makes the current page distinct without reducing inactive text contrast", () => {
    const html = renderToStaticMarkup(createElement(Header));
    const active = navigationAttributes(html, "Resources");
    expect(active).toContain('aria-current="page"');
    for (const style of ["text-base", "font-bold", "2xl:text-lg", "text-[#1268a8]", "decoration-[3px]", "underline-offset-8"]) {
      expect(active).toContain(style);
    }
    const inactive = navigationAttributes(html, "Engineering Cases");
    expect(inactive).toContain("text-[#12263a]");
    expect(inactive).not.toContain("underline");
  });

  it.each([
    ["/resources/ccs2-testing-guide", "Resources"],
    ["/engineering-cases/reference", "Engineering Cases"],
    ["/products/st-hcdc-hpc", "Products"],
    ["/applications/ccs2-lab", "Solutions"],
    ["/solutions/evse-lab", "Solutions"],
  ])("preserves the active navigation branch for %s", (pathname, label) => {
    navigation.pathname = pathname;
    const html = renderToStaticMarkup(createElement(Header));
    expect(navigationAttributes(html, label)).toContain("text-[#1268a8] underline decoration-[3px]");
  });

  it("keeps interface routes outside the product-prefix active state", () => {
    navigation.pathname = "/interfaces/ccs2";
    const html = renderToStaticMarkup(createElement(Header));
    expect(navigationAttributes(html, "Products")).toContain("text-[#12263a]");
    expect(navigationAttributes(html, "Products")).not.toContain("underline");
  });

  it("keeps collapsed menu controls accessible and gives the product arrow a clear icon", () => {
    const html = renderToStaticMarkup(createElement(Header));
    const products = navigationAttributes(html, "Products");
    expect(products).toContain('type="button"');
    expect(products).toContain('aria-expanded="false"');
    expect(products).toContain('aria-controls="desktop-product-navigation"');
    expect(html).toContain('aria-label="Open menu"');
    expect(html).toContain('aria-controls="mobile-navigation"');
    const arrow = html.match(/Products <svg\b[^>]*>/)![0];
    for (const attribute of ['width="16"', 'height="16"', 'stroke-width="2.5"', 'aria-hidden="true"']) {
      expect(arrow).toContain(attribute);
    }
    expect(html).not.toContain('id="desktop-product-navigation"');
    expect(html).not.toContain('id="mobile-navigation"');
  });
});
