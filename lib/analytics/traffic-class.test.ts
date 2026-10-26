import { describe, expect, it, vi } from "vitest";
import { readAnalyticsTrafficClass, type AnalyticsTrafficWindow } from "@/lib/analytics/traffic-class";

function sessionStore() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

function initialNavigation(url: string) {
  return { getEntriesByType: () => [{ name: url } as PerformanceEntry] };
}

describe("explicit QA traffic classification", () => {
  it("keeps ordinary, Direct, country and AI-referral traffic public", () => {
    for (const search of ["", "?country=CN", "?source=direct", "?utm_source=chatgpt.com", "?ga_debug=1"]) {
      expect(readAnalyticsTrafficClass({ location: { search } })).toBe("public");
    }
  });

  it("accepts only an exact single 1 or 0 flag", () => {
    for (const search of ["?apex_qa=true", "?apex_qa=", "?apex_qa=01", "?apex_qa=1%20", "?apex_qa=1&apex_qa=1", "?apex_qa=1&apex_qa=0", "?APEX_QA=1"]) {
      expect(readAnalyticsTrafficClass({ location: { search } })).toBe("public");
    }
  });

  it("continues QA in the same tab across documents and clears it on a full opt-out visit", () => {
    const sessionStorage = sessionStore();
    expect(readAnalyticsTrafficClass({ sessionStorage, location: { search: "?apex_qa=1" } })).toBe("qa");
    expect(readAnalyticsTrafficClass({ sessionStorage, location: { search: "" } })).toBe("qa");
    expect(readAnalyticsTrafficClass({ sessionStorage, location: { search: "?apex_qa=0&apex_qa=0" } })).toBe("qa");
    expect(readAnalyticsTrafficClass({ sessionStorage, location: { search: "?apex_qa=0" } })).toBe("public");
    expect(readAnalyticsTrafficClass({ sessionStorage, location: { search: "" } })).toBe("public");
    expect(readAnalyticsTrafficClass({ sessionStorage: sessionStore(), location: { search: "" } })).toBe("public");
  });

  it("uses the document initial QA URL even after navigation before consent", () => {
    const browserWindow = {
      location: { search: "" },
      performance: initialNavigation("https://www.link-jl.com/?apex_qa=1"),
    };
    expect(readAnalyticsTrafficClass(browserWindow)).toBe("qa");
    browserWindow.location.search = "?apex_qa=0";
    expect(readAnalyticsTrafficClass(browserWindow)).toBe("qa");
  });

  it("does not activate QA from a later SPA query or failed navigation", () => {
    const browserWindow = {
      location: { search: "?apex_qa=1" },
      performance: initialNavigation("https://www.link-jl.com/products"),
    };
    expect(readAnalyticsTrafficClass(browserWindow)).toBe("public");
    browserWindow.location.search = "?apex_qa=1&ga_debug=1";
    expect(readAnalyticsTrafficClass(browserWindow)).toBe("public");
  });

  it("falls back safely when navigation timing or session storage is blocked", () => {
    const blocked = vi.fn(() => { throw new Error("blocked"); });
    const browserWindow: AnalyticsTrafficWindow = {
      location: { search: "?apex_qa=1" },
      performance: { getEntriesByType: blocked },
      sessionStorage: { getItem: blocked, setItem: blocked, removeItem: blocked },
    };
    expect(readAnalyticsTrafficClass(browserWindow)).toBe("qa");
    browserWindow.location!.search = "?apex_qa=0";
    expect(readAnalyticsTrafficClass(browserWindow)).toBe("qa");
    expect(readAnalyticsTrafficClass({ sessionStorage: browserWindow.sessionStorage })).toBe("public");
    expect(readAnalyticsTrafficClass({ sessionStorage: browserWindow.sessionStorage, location: { search: "?apex_qa=0" } })).toBe("public");
  });

  it("handles a throwing sessionStorage getter without breaking page actions", () => {
    const browserWindow = { location: { search: "?apex_qa=1" } };
    Object.defineProperty(browserWindow, "sessionStorage", { get() { throw new Error("blocked"); } });
    expect(() => readAnalyticsTrafficClass(browserWindow)).not.toThrow();
    expect(readAnalyticsTrafficClass(browserWindow)).toBe("qa");
  });
});
