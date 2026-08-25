import { describe, expect, it } from "vitest";
import { whatsappButtonClassName, whatsappIconPath } from "@/components/WhatsAppButton.styles";

describe("WhatsAppButton", () => {
  it("keeps the contact action visible on narrow screens", () => {
    expect(whatsappButtonClassName).toContain("inline-flex");
    expect(whatsappButtonClassName).not.toContain("hidden");
  });

  it("anchors the contact action at the right-center of the viewport", () => {
    expect(whatsappButtonClassName).toContain("top-1/2");
    expect(whatsappButtonClassName).toContain("-translate-y-1/2");
    expect(whatsappButtonClassName).toContain("right-4");
    expect(whatsappButtonClassName).not.toContain("bottom-7");
  });

  it("uses a WhatsApp brand mark instead of a telephone character", () => {
    expect(whatsappIconPath).toContain("M20.52");
    expect(whatsappIconPath).not.toContain("☎");
  });
});
