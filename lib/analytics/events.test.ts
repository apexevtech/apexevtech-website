import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/analytics/events";

describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("pushes a supported event through gtag", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });

    trackEvent("whatsapp_click", { location: "floating" });

    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", { location: "floating" });
  });

  it("queues non-personal events until analytics consent initializes gtag", () => {
    const browserWindow: { apexAnalyticsQueue?: unknown[] } = {};
    vi.stubGlobal("window", browserWindow);

    trackEvent("email_click", { location: "footer" });
    expect(browserWindow.apexAnalyticsQueue).toEqual([
      { name: "email_click", parameters: { location: "footer" } },
    ]);
  });

  it("uses only the path for page attribution and does not interrupt actions when analytics fails", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag, location: { pathname: "/products/st-6680ea-ac", search: "?email=private@example.com" } });
    trackEvent("inquiry_start", { location: "Product inquiry" });
    expect(gtag).toHaveBeenCalledWith("event", "inquiry_start", { page_path: "/products/st-6680ea-ac", location: "Product inquiry" });
    gtag.mockImplementation(() => { throw new Error("analytics unavailable"); });
    expect(() => trackEvent("generate_lead")).not.toThrow();
  });
});
