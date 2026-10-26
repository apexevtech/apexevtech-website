import { afterEach, describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/analytics/events";

describe("trackEvent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("pushes a supported event through gtag", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag, apexAnalyticsConsent: "accepted" });

    trackEvent("whatsapp_click", { location: "floating" });

    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", { location: "floating", traffic_class: "public" });
  });

  it("queues accepted events until the tag initializes", () => {
    const browserWindow: { apexAnalyticsQueue?: unknown[]; apexAnalyticsConsent: string } = { apexAnalyticsConsent: "accepted" };
    vi.stubGlobal("window", browserWindow);

    trackEvent("email_click", { location: "footer" });
    expect(browserWindow.apexAnalyticsQueue).toEqual([
      { name: "email_click", parameters: { location: "footer", traffic_class: "public" } },
    ]);
  });

  it("supports reference scenario inquiries with only a public case slug", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag, apexAnalyticsConsent: "accepted", location: { pathname: "/project-cases" } });
    trackEvent("case_inquiry_click", { location: "engineering-case", reference_case: "ccs-charger-laboratory-testing" });
    expect(gtag).toHaveBeenCalledWith("event", "case_inquiry_click", { page_path: "/project-cases", location: "engineering-case", reference_case: "ccs-charger-laboratory-testing", traffic_class: "public" });
  });

  it("uses only the path for page attribution and does not interrupt actions when analytics fails", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag, apexAnalyticsConsent: "accepted", location: { pathname: "/products/st-6680ea-ac", search: "?email=private@example.com" } });
    trackEvent("inquiry_start", { location: "Product inquiry" });
    expect(gtag).toHaveBeenCalledWith("event", "inquiry_start", { page_path: "/products/st-6680ea-ac", location: "Product inquiry", traffic_class: "public" });
    gtag.mockImplementation(() => { throw new Error("analytics unavailable"); });
    expect(() => trackEvent("generate_lead")).not.toThrow();
  });

  it("discards unknown and declined events even if an old tag remains on the page", () => {
    for (const consent of ["unknown", "declined"]) {
      const gtag = vi.fn();
      const browserWindow = { gtag, apexAnalyticsConsent: consent, apexAnalyticsQueue: [{ name: "email_click", parameters: {} }] };
      vi.stubGlobal("window", browserWindow);
      trackEvent("generate_lead");
      expect(gtag).not.toHaveBeenCalled();
      expect(browserWindow.apexAnalyticsQueue).toEqual([]);
    }
  });

  it("marks QA events and never records a QA success as a formal lead", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag, apexAnalyticsConsent: "accepted", location: { search: "?apex_qa=1" } });
    trackEvent("generate_lead", { traffic_class: "public", location: "test" });
    expect(gtag).toHaveBeenCalledWith("event", "qa_generate_lead", { traffic_class: "qa", location: "test" });
    expect(gtag).not.toHaveBeenCalledWith("event", "generate_lead", expect.anything());
  });

  it("freezes the queue classification when URL parameters change later", () => {
    const browserWindow = { apexAnalyticsConsent: "accepted", location: { search: "?apex_qa=1" }, apexAnalyticsQueue: [] as unknown[] };
    vi.stubGlobal("window", browserWindow);
    trackEvent("email_click");
    browserWindow.location.search = "?apex_qa=0";
    trackEvent("generate_lead");
    expect(browserWindow.apexAnalyticsQueue).toEqual([
      { name: "email_click", parameters: { traffic_class: "qa" } },
      { name: "qa_generate_lead", parameters: { traffic_class: "qa" } },
    ]);
  });
});
