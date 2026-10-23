import { describe, expect, it } from "vitest";
import { engineeringCases } from "@/data/engineering-cases";
import { engineeringCaseDetailSlugs } from "@/lib/engineering-cases/detail-path";
import { siteUrl } from "@/lib/seo/site-urls";
import { buildWhatsAppInquiryHref } from "./whatsapp";

describe("WhatsApp inquiry context", () => {
  it("includes the public product or guide page and requirements prompts", () => {
    for (const path of ["/products/ast-9000", "/resources/ccs2-dc-fast-charger-testing", "/interfaces/nacs-evse-testing", "/applications/charger-end-of-line-testing"]) {
      const url = new URL(buildWhatsAppInquiryHref(path));
      expect(url.searchParams.get("phone")).toBe("8617714412321");
      expect(url.searchParams.get("text")).toContain(path);
      expect(url.searchParams.get("text")).toContain("Voltage / current range:");
    }
  });

  it("includes only the canonical path for all three published project-case details", () => {
    for (const slug of engineeringCaseDetailSlugs) {
      const path = `/project-cases/${slug}`;
      const url = new URL(buildWhatsAppInquiryHref(path));
      expect(url.searchParams.get("phone")).toBe("8617714412321");
      expect(url.searchParams.get("text")).toContain(`\n${new URL(path, siteUrl)}\n`);
      expect(url.searchParams.get("text")).toContain("Required tests:");
    }
  });

  it("never includes query strings or fragments in shared context", () => {
    for (const path of ["/products/ast-9000", ...engineeringCaseDetailSlugs.map((slug) => `/project-cases/${slug}`)]) {
      const text = new URL(buildWhatsAppInquiryHref(`${path}?email=private@example.com&redirect=https://external.test#inquiry-form`)).searchParams.get("text");
      expect(text).toContain(`\n${new URL(path, siteUrl)}\n`);
      expect(text).not.toContain("private@example.com");
      expect(text).not.toContain("external.test");
      expect(text).not.toContain("inquiry-form");
    }
  });

  it("does not share unpublished case references or malformed case paths", () => {
    const unpublished = engineeringCases.filter((entry) => !engineeringCaseDetailSlugs.some((slug) => slug === entry.slug));
    const slug = engineeringCaseDetailSlugs[0];
    for (const path of [
      ...unpublished.map((entry) => `/project-cases/${entry.slug}`),
      "/project-cases/unknown-case?email=private@example.com#inquiry-form",
      `/project-cases//${slug}`,
      `//project-cases/${slug}`,
      `/project-cases/${slug}/`,
      `/project-cases/${slug}/private`,
      `/project-cases/../${slug}`,
      `/project-cases/%63cs-charger-laboratory-testing`,
      `https://external.test/project-cases/${slug}?email=private@example.com`,
      `//external.test/project-cases/${slug}`,
    ]) {
      const text = new URL(buildWhatsAppInquiryHref(path)).searchParams.get("text");
      expect(text).toBe("Hello APEX, I would like to learn more about your EV charger testing systems.");
    }
  });

  it("uses a general message for contact forms, unknown routes and external URLs", () => {
    for (const path of [null, "/", "/contact", "/products", "/private/customer", "https://external.test/products/ast-9000", "/products/../private"]) {
      const text = new URL(buildWhatsAppInquiryHref(path)).searchParams.get("text");
      expect(text).toBe("Hello APEX, I would like to learn more about your EV charger testing systems.");
    }
  });
});
