import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/inquiries/route";
import { deliverInquiry } from "@/lib/inquiries/delivery";

vi.mock("@/lib/inquiries/delivery", () => ({ deliverInquiry: vi.fn() }));
vi.mock("@/lib/inquiries/rate-limit", () => ({ inquiryRateLimiter: { isLimited: () => false } }));

function request(website = "") {
  return new Request("http://localhost/api/inquiries", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "Test buyer", email: "buyer@example.com", company: "", country: "", message: "Need an AC charger tester", context: "Test", privacyAccepted: true, website, formStartedAt: Date.now() - 5000 }),
  });
}

describe("inquiry conversion eligibility", () => {
  beforeEach(() => vi.clearAllMocks());

  it("does not count an ignored bot submission as a delivered lead", async () => {
    const response = await POST(request("spam.example"));
    expect(await response.json()).toMatchObject({ ok: true, leadRecorded: false });
    expect(deliverInquiry).not.toHaveBeenCalled();
  });

  it("allows a conversion only after delivery succeeds", async () => {
    vi.mocked(deliverInquiry).mockResolvedValue({ ok: true, providerId: "email_test_123" });
    const response = await POST(request());
    expect(await response.json()).toMatchObject({ ok: true, leadRecorded: true });
    expect(deliverInquiry).toHaveBeenCalledOnce();
  });
});
