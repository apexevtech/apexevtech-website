import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Header } from "./Header";
import { company, navItems } from "@/data/site";

const navigation = vi.hoisted(() => ({ pathname: "/project-cases" }));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
}));

function navigationAttributes(html: string, label: string) {
  return html.match(new RegExp(`<(?:a|button)\\b([^>]*)>${label}(?:\\s|<)`))![1];
}

describe("main navigation emphasis", () => {
  beforeEach(() => {
    navigation.pathname = "/project-cases";
  });

  it("keeps the original brand, inquiry action and header height with one combined project entry", () => {
    const html = renderToStaticMarkup(createElement(Header));
    expect(html).toContain('aria-label="Main navigation"');
    expect(html).toContain(`aria-label="${company.name} home"`);
    expect(html).toContain("Apex Power Systems");
    expect(html).toContain("h-[76px]");
    for (const item of navItems.filter((item) => item.label !== "Products")) {
      expect(html).toContain(`href="${item.href}"`);
      expect(navigationAttributes(html, item.label)).toContain("text-base font-semibold");
    }
    expect(html).toContain('href="/contact#inquiry-form"');
    expect(html).toContain("Talk to an engineer");
    expect(html).toContain("2xl:max-w-[1440px]");
    expect(html).toContain("shrink-0 items-center gap-5");
    expect(html).toContain("2xl:gap-6");
    expect(html).toContain('aria-label="Website language / 网站语言"');
    expect(navItems.filter((item) => item.href === "/project-cases")).toEqual([{ label: "Project Cases", href: "/project-cases" }]);
    expect(html).not.toContain('href="/resources"');
    expect(html).not.toContain('href="/engineering-cases"');
  });

  it("makes the current page distinct without reducing inactive text contrast", () => {
    const html = renderToStaticMarkup(createElement(Header));
    const active = navigationAttributes(html, "Project Cases");
    expect(active).toContain('aria-current="page"');
    for (const style of ["text-base", "font-semibold", "2xl:text-[17px]", "text-[#1268a8]", "decoration-2", "underline-offset-[10px]"]) {
      expect(active).toContain(style);
    }
    const inactive = navigationAttributes(html, "Solutions");
    expect(inactive).toContain("text-[#34495c]");
    expect(inactive).not.toContain("underline");
  });

  it.each([
    ["/project-cases", "Project Cases"],
    ["/resources/ccs2-testing-guide", "Project Cases"],
    ["/resources", "Project Cases"],
    ["/engineering-cases/reference", "Project Cases"],
    ["/engineering-cases", "Project Cases"],
    ["/library", "Project Cases"],
    ["/products/st-hcdc-hpc", "Products"],
    ["/applications/ccs2-lab", "Solutions"],
    ["/solutions/evse-lab", "Solutions"],
  ])("preserves the active navigation branch for %s", (pathname, label) => {
    navigation.pathname = pathname;
    const html = renderToStaticMarkup(createElement(Header));
    expect(navigationAttributes(html, label)).toContain("text-[#1268a8] underline decoration-2");
  });

  it("keeps interface routes outside the product-prefix active state", () => {
    navigation.pathname = "/interfaces/ccs2";
    const html = renderToStaticMarkup(createElement(Header));
    expect(navigationAttributes(html, "Products")).toContain("text-[#34495c]");
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
