import { describe, expect, it } from "vitest";
import { buildWhatsAppInquiryHref } from "./whatsapp";

describe("WhatsApp inquiry context", () => {
  it("includes the public product or guide page and requirements prompts", () => {
    for (const path of ["/products/ast-9000", "/resources/ccs2-dc-fast-charger-testing", "/interfaces/nacs-evse-testing"]) {
      const url = new URL(buildWhatsAppInquiryHref(path));
      expect(url.searchParams.get("phone")).toBe("8617714412321");
      expect(url.searchParams.get("text")).toContain(path);
      expect(url.searchParams.get("text")).toContain("Voltage / current range:");
    }
  });

  it("never includes query strings or fragments in shared context", () => {
    const text = new URL(buildWhatsAppInquiryHref("/products/ast-9000?email=private@example.com#inquiry-form")).searchParams.get("text");
    expect(text).toContain("/products/ast-9000");
    expect(text).not.toContain("private@example.com");
    expect(text).not.toContain("inquiry-form");
  });

  it("uses a general message for contact forms, unknown routes and external URLs", () => {
    for (const path of [null, "/", "/contact", "/products", "/private/customer", "https://external.test/products/ast-9000", "/products/../private"]) {
      const text = new URL(buildWhatsAppInquiryHref(path)).searchParams.get("text");
      expect(text).toBe("Hello APEX, I would like to learn more about your EV charger testing systems.");
    }
  });
});
