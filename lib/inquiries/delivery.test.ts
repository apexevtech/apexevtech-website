import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deliverInquiry } from "@/lib/inquiries/delivery";

const mocks = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: mocks.send };
  },
}));

const inquiry = {
  name: "Test buyer",
  email: "buyer@example.com",
  company: "Example Co.",
  country: "DE",
  message: "Please quote a CCS2 charger tester.",
  context: "Delivery test",
  privacyAccepted: true as const,
};

describe("inquiry delivery", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "test_key");
    vi.stubEnv("INQUIRY_FROM_EMAIL", "APEX <inquiries@example.com>");
    vi.stubEnv("INQUIRY_TO_EMAIL", "sales@example.com");
    mocks.send.mockReset();
  });
  afterEach(() => vi.unstubAllEnvs());

  it("only reports success when Resend returns a delivery identifier", async () => {
    mocks.send.mockResolvedValue({ data: { id: "email_123" }, error: null });
    await expect(deliverInquiry(inquiry)).resolves.toEqual({ ok: true, providerId: "email_123" });
    expect(mocks.send).toHaveBeenCalledWith(expect.objectContaining({ to: ["sales@example.com"], replyTo: inquiry.email }));
  });

  it("does not record a lead when the provider returns no identifier", async () => {
    mocks.send.mockResolvedValue({ data: null, error: null });
    await expect(deliverInquiry(inquiry)).resolves.toMatchObject({ ok: false, code: "DELIVERY_FAILED" });
  });

  it("keeps provider failures distinct from missing configuration", async () => {
    mocks.send.mockResolvedValue({ data: null, error: { message: "Domain is not verified" } });
    await expect(deliverInquiry(inquiry)).resolves.toEqual({ ok: false, code: "DELIVERY_FAILED", detail: "Domain is not verified" });
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(deliverInquiry(inquiry)).resolves.toEqual({ ok: false, code: "NOT_CONFIGURED" });
  });
});
