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

  it("does nothing when analytics is unavailable", () => {
    vi.stubGlobal("window", {});

    expect(() => trackEvent("email_click")).not.toThrow();
  });
});
