import { describe, expect, it } from "vitest";
import { whatsappButtonClassName, whatsappIconPath } from "@/components/WhatsAppButton.styles";
import { parse } from "postcss";

describe("WhatsAppButton", () => {
  it("keeps the contact action visible on narrow screens", () => {
    expect(whatsappButtonClassName).toContain("inline-flex");
    expect(whatsappButtonClassName).not.toContain("hidden");
  });

  it("uses the lower edge on mobile and right-center on desktop", () => {
    expect(whatsappButtonClassName).toContain("sm:top-1/2");
    expect(whatsappButtonClassName).toContain("sm:-translate-y-1/2");
    expect(whatsappButtonClassName).toContain("safe-area-inset-bottom");
    expect(whatsappButtonClassName).toContain("right-4");
    expect(whatsappButtonClassName).not.toContain("bottom-7");
  });

  it("uses a WhatsApp brand mark instead of a telephone character", () => {
    expect(whatsappIconPath).toContain("M20.52");
    expect(whatsappIconPath).not.toContain("☎");
  });

  it("keeps a stable touch target and visible keyboard focus", () => {
    expect(whatsappButtonClassName).toContain("h-12 w-12");
    expect(whatsappButtonClassName).toContain("sm:w-auto");
    expect(whatsappButtonClassName).toContain("focus-visible:outline-2");
    expect(whatsappButtonClassName).not.toContain("hover:shadow-xl");
  });

  it("uses a stable analytics location for the floating action", async () => {
    const { readFile } = await import("node:fs/promises");
    const source = await readFile("components/WhatsAppButton.tsx", "utf8");

    expect(source).toContain('trackEvent("whatsapp_click", { location: "floating" })');
  });

  it("avoids visible forms, focused fields and cookie choices at every viewport width", async () => {
    const { readFile } = await import("node:fs/promises");
    const css = await readFile("app/globals.css", "utf8");
    const root = parse(css);
    for (const selector of [
      'body:has([data-inquiry-form-visible="true"]) .whatsapp-floating',
      "body:has(.inquiry-form:focus-within) .whatsapp-floating",
      'body:has([data-cookie-preferences="true"]) .whatsapp-floating',
    ]) {
      const rule = root.nodes.find((node) => node.type === "rule" && node.selectors.includes(selector));
      expect(rule, `${selector} must not be scoped to a media query`).toBeDefined();
      if (rule?.type === "rule") {
        expect(rule.nodes).toEqual(expect.arrayContaining([
          expect.objectContaining({ prop: "visibility", value: "hidden" }),
          expect.objectContaining({ prop: "pointer-events", value: "none" }),
        ]));
      }
    }
  });

  it("does not obstruct catalog filters while they are visible", async () => {
    const { readFile } = await import("node:fs/promises");
    const css = await readFile("app/globals.css", "utf8");
    expect(css).toContain('body:has([data-floating-controls-visible="true"]) .whatsapp-floating');
  });
});
