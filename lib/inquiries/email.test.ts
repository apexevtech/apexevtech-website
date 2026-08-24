import { describe, expect, it } from "vitest";
import { buildInquiryEmail } from "@/lib/inquiries/email";
import type { InquirySubmission } from "@/lib/inquiries/types";

const inquiry: InquirySubmission = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "+44 20 0000 0000",
  company: "Analytical Engines",
  country: "United Kingdom",
  message: "Please quote the <ST-HCDC-HPC> system.",
  context: "ST-HCDC-HPC",
  privacyAccepted: true,
};

describe("buildInquiryEmail", () => {
  it("builds a reply-ready subject and escaped text/html bodies", () => {
    const email = buildInquiryEmail(inquiry);

    expect(email.subject).toContain("ST-HCDC-HPC");
    expect(email.replyTo).toBe("ada@example.com");
    expect(email.text).toContain("Please quote the <ST-HCDC-HPC> system.");
    expect(email.html).toContain("&lt;ST-HCDC-HPC&gt;");
    expect(email.html).not.toContain("<ST-HCDC-HPC>");
  });
});
