import { describe, expect, it } from "vitest";
import { addInquiryRequirements, formatInquiryRequirements } from "@/lib/inquiries/requirements";

describe("guided inquiry requirements", () => {
  it("formats only provided details without guessing unknown ratings", () => {
    expect(formatInquiryRequirements({ workflow: " Field commissioning ", connector: "Not sure — please advise", electricalRange: " " })).toBe("Test requirements:\nTest workflow: Field commissioning\nCharger connector / interface: Not sure — please advise");
    expect(formatInquiryRequirements({ workflow: "", connector: "", electricalRange: "" })).toBe("");
  });

  it("keeps existing customer notes and compared-model context", () => {
    const message = "Compare model A and model B.\nWe need protocol capture.";
    const requirements = formatInquiryRequirements({ workflow: "Laboratory / R&D validation", connector: "CCS2 DC", electricalRange: "1000 V, 300 A" });
    expect(addInquiryRequirements(message, requirements)).toBe(`${message}\n\n${requirements}`);
  });

  it("does not duplicate the same details when added again", () => {
    const requirements = "Test requirements:\nTest workflow: Field commissioning";
    const once = addInquiryRequirements("Our notes", requirements)!;
    expect(addInquiryRequirements(once, requirements)).toBe(once);
  });

  it("refuses to truncate customer notes when the combined message is too long", () => {
    const message = "a".repeat(4990);
    expect(addInquiryRequirements(message, "Test requirements: 1000 V")).toBeNull();
    expect(addInquiryRequirements("a".repeat(4990), "12345678")).toHaveLength(5000);
  });
});
