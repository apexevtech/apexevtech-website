import { describe, expect, it } from "vitest";
import { whatsappButtonClassName } from "@/components/WhatsAppButton.styles";

describe("WhatsAppButton", () => {
  it("keeps the contact action visible on narrow screens", () => {
    expect(whatsappButtonClassName).toContain("inline-flex");
    expect(whatsappButtonClassName).not.toContain("hidden");
  });
});
