import { describe, expect, it } from "vitest";
import { buildInquiryEmail } from "@/lib/inquiries/email";
import type { InquirySubmission } from "@/lib/inquiries/types";

const inquiry: InquirySubmission = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  company: "Analytical Engines",
  country: "United Kingdom",
  message: "Please quote the <ST-HCDC-HPC> system.",
  context: "ST-HCDC-HPC",
  privacyAccepted: true,
};

describe("buildInquiryEmail", () => {
  it("includes source and selected configuration even when the buyer edits their message", () => {
    const email = buildInquiryEmail({ ...inquiry, sourcePage: "/resources/ccs2-dc-fast-charger-testing", configuration: "DC chargers\nCCS2 <test>", message: "Please send a quotation." });
    expect(email.text).toContain("Source page: /resources/ccs2-dc-fast-charger-testing");
    expect(email.text).toContain("Selected configuration: DC chargers\nCCS2 <test>");
    expect(email.html).toContain("CCS2 &lt;test&gt;");
    expect(email.html).not.toContain("<test>");
  });
  it("builds a reply-ready subject and escaped text/html bodies", () => {
    const email = buildInquiryEmail(inquiry);

    expect(email.subject).toContain("ST-HCDC-HPC");
    expect(email.replyTo).toBe("ada@example.com");
    expect(email.text).toContain("Please quote the <ST-HCDC-HPC> system.");
    expect(email.html).toContain("&lt;ST-HCDC-HPC&gt;");
    expect(email.html).not.toContain("<ST-HCDC-HPC>");
  });
});
