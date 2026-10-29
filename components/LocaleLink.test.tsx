import { beforeEach, describe, expect, it, vi } from "vitest";
import LocaleLink from "@/components/LocaleLink";
import { TrackedLink } from "@/components/TrackedLink";
import { trackEvent } from "@/lib/analytics/events";

const locale = vi.hoisted(() => ({ language: "en" as "en" | "zh" }));
vi.mock("@/components/LanguageProvider", () => ({ useLanguage: () => locale }));
vi.mock("@/lib/analytics/events", () => ({ trackEvent: vi.fn() }));

describe("LocaleLink", () => {
  beforeEach(() => { locale.language = "en"; vi.clearAllMocks(); });

  it("localizes page URLs once without changing query strings or fragments", () => {
    locale.language = "zh";
    const suffix = "?type=dc&compare=ast-9000%2Cst-hcdc-hpc&utm_source=test+case#compare";
    expect(LocaleLink({ href: `/products${suffix}` }).props.href).toBe(`/zh/products${suffix}`);
    expect(LocaleLink({ href: `/zh/products${suffix}` }).props.href).toBe(`/zh/products${suffix}`);
    expect(LocaleLink({ href: "/" }).props.href).toBe("/zh");
    locale.language = "en";
    expect(LocaleLink({ href: `/zh/products${suffix}` }).props.href).toBe(`/products${suffix}`);
  });

  it("keeps fragment-only and query-only links relative to the current page", () => {
    locale.language = "zh";
    for (const href of ["#decision-support", "?section=resources&page=3#resource-results", "products/ast-9000"]) {
      expect(LocaleLink({ href }).props.href).toBe(href);
    }
  });

  it("never changes downloads, assets, APIs or external contact destinations", () => {
    locale.language = "zh";
    for (const href of ["/downloads/ast-9000-specifications.docx", "/assets/apex-logo.webp", "/api/inquiries", "/_next/image?url=test", "/product-documents/AST-9000.docx", "mailto:gu@apexps-nj.com", "tel:+8617714412321", "https://api.whatsapp.com/send?phone=8617714412321", "https://www.link-jl.com/products", "//example.com/products"]) {
      expect(LocaleLink({ href }).props.href).toBe(href);
    }
  });

  it("preserves UrlObject query, hash and other properties", () => {
    locale.language = "zh";
    const query = { section: "resources", page: 3, q: "CAN PLC", type: ["guides", "sources"] };
    const href = { pathname: "/project-cases", query, hash: "material-protocol" };
    const localized = LocaleLink({ href }).props.href;
    expect(localized).toEqual({ ...href, pathname: "/zh/project-cases" });
    expect(typeof localized !== "string" && localized.query).toBe(query);
    expect(href.pathname).toBe("/project-cases");
    for (const external of [{ ...href, protocol: "https:", hostname: "example.com" }, { ...href, host: "example.com" }]) {
      expect(LocaleLink({ href: external }).props.href).toBe(external);
    }
    expect(LocaleLink({ href: { query, hash: "resource-results" } }).props.href).toEqual({ query, hash: "resource-results" });
  });

  it("forwards normal Next Link behavior and accessibility attributes", () => {
    const onClick = vi.fn();
    const ref = { current: null };
    const props = { href: "/privacy-policy", target: "_blank", rel: "noopener noreferrer", prefetch: false as const, replace: true, scroll: false, "aria-label": "Policy", className: "min-h-11", onClick, ref };
    expect(LocaleLink(props).props).toMatchObject(props);
  });

  it("retains tracked-click parameters and the caller's click handler", () => {
    const onClick = vi.fn();
    const link = TrackedLink({ href: "/contact?case=vehicle-charger-field-diagnostics#inquiry-form", eventName: "case_inquiry_click", location: "engineering-case", eventParameters: { reference_case: "vehicle-charger-field-diagnostics" }, children: "Discuss", onClick });
    const event = {} as Parameters<NonNullable<typeof link.props.onClick>>[0];
    link.props.onClick(event);
    expect(trackEvent).toHaveBeenCalledWith("case_inquiry_click", { location: "engineering-case", reference_case: "vehicle-charger-field-diagnostics" });
    expect(onClick).toHaveBeenCalledWith(event);
    locale.language = "zh";
    expect(LocaleLink(link.props).props.href).toBe("/zh/contact?case=vehicle-charger-field-diagnostics#inquiry-form");
  });
});
