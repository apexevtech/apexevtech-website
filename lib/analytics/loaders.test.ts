import { describe, expect, it } from "vitest";
import { initializeAnalytics, scheduleAnalyticsInitialization } from "@/lib/analytics/loaders";

function createDocument() {
  const scripts: Array<{ async: boolean; src: string }> = [];

  return {
    scripts,
    document: {
      createElement: () => ({ async: false, src: "" }),
      head: {
        appendChild: (script: { async: boolean; src: string }) => scripts.push(script),
      },
    },
  };
}

describe("initializeAnalytics", () => {
  it("defers analytics initialization until the browser is idle", () => {
    const browserWindow: Record<string, unknown> = {
      requestIdleCallback: (callback: () => void) => { callback(); return 1; },
    };
    const { document, scripts } = createDocument();

    scheduleAnalyticsInitialization(browserWindow, document as unknown as Document, {
      measurementId: "G-IDLE123",
    });

    expect(scripts.map((script) => script.src)).toEqual([
      "https://www.googletagmanager.com/gtag/js?id=G-IDLE123",
    ]);
  });

  it("initializes GA4 and Clarity after analytics consent", () => {
    const browserWindow: Record<string, unknown> = {};
    const { document, scripts } = createDocument();

    initializeAnalytics(browserWindow, document as unknown as Document, {
      measurementId: "G-TEST123",
      clarityProjectId: "clarity123",
    });

    expect(typeof browserWindow.gtag).toBe("function");
    expect(Array.isArray(browserWindow.dataLayer)).toBe(true);
    expect(typeof browserWindow.clarity).toBe("function");
    const dataLayer = browserWindow.dataLayer as ArrayLike<unknown>[];
    expect(Array.isArray(dataLayer[0])).toBe(false);
    expect(Array.from(dataLayer[1])).toEqual(["config", "G-TEST123", { anonymize_ip: true }]);

    (browserWindow.clarity as (...arguments_: unknown[]) => void)("set", "test", "value");
    const clarityQueue = (browserWindow.clarity as { q: ArrayLike<unknown>[] }).q;
    expect(Array.isArray(clarityQueue[0])).toBe(false);
    expect(Array.from(clarityQueue[0])).toEqual(["set", "test", "value"]);
    expect(scripts.map((script) => script.src)).toEqual([
      "https://www.googletagmanager.com/gtag/js?id=G-TEST123",
      "https://www.clarity.ms/tag/clarity123",
    ]);
  });

  it("adds GA4 debug mode only when explicitly requested", () => {
    const browserWindow: Record<string, unknown> = {};
    const { document } = createDocument();
    initializeAnalytics(browserWindow, document as unknown as Document, {
      measurementId: "G-DEBUG123",
      debugMode: true,
    });
    const dataLayer = browserWindow.dataLayer as ArrayLike<unknown>[];
    expect(Array.from(dataLayer[1])).toEqual(["config", "G-DEBUG123", { anonymize_ip: true, debug_mode: true }]);
  });
});
