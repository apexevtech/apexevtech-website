import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeAnalytics, scheduleAnalyticsInitialization } from "@/lib/analytics/loaders";
import { applyAnalyticsConsent, chooseAnalyticsConsent } from "@/lib/analytics/consent";
import { trackEvent } from "@/lib/analytics/events";

function createDocument() {
  const scripts: Array<{ async: boolean; src: string; onload?: () => void }> = [];

  return {
    scripts,
    document: {
      createElement: () => ({ async: false, src: "" }),
      head: {
        appendChild: (script: { async: boolean; src: string; onload?: () => void }) => scripts.push(script),
      },
    },
  };
}

describe("initializeAnalytics", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("initializes analytics immediately after consent", () => {
    const browserWindow: Record<string, unknown> = { apexAnalyticsConsent: "accepted" };
    const { document, scripts } = createDocument();

    scheduleAnalyticsInitialization(browserWindow, document as unknown as Document, {
      measurementId: "G-IDLE123",
    });

    expect(scripts.map((script) => script.src)).toEqual([
      "https://www.googletagmanager.com/gtag/js?id=G-IDLE123",
    ]);
  });

  it("initializes GA4 and Clarity after analytics consent", () => {
    const browserWindow: Record<string, unknown> = {
      apexAnalyticsConsent: "accepted",
      apexAnalyticsQueue: [{ name: "view_item", parameters: { page_path: "/products/example", traffic_class: "public" } }],
    };
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
    expect(Array.from(dataLayer[1])).toEqual(["consent", "update", { analytics_storage: "granted" }]);
    expect(Array.from(dataLayer[2])).toEqual(["set", { traffic_class: "public" }]);
    expect(Array.from(dataLayer[3])).toEqual(["config", "G-TEST123", { anonymize_ip: true, traffic_class: "public" }]);
    expect(Array.from(dataLayer[4])).toEqual(["event", "view_item", { page_path: "/products/example", traffic_class: "public" }]);
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);

    (browserWindow.clarity as (...arguments_: unknown[]) => void)("set", "test", "value");
    const clarityQueue = (browserWindow.clarity as { q: ArrayLike<unknown>[] }).q;
    expect(Array.isArray(clarityQueue[0])).toBe(false);
    expect(Array.from(clarityQueue[0])).toEqual(["consent", true]);
    expect(Array.from(clarityQueue[1])).toEqual(["set", "test", "value"]);
    expect(scripts.map((script) => script.src)).toEqual([
      "https://www.googletagmanager.com/gtag/js?id=G-TEST123",
      "https://www.clarity.ms/tag/clarity123",
    ]);
  });

  it("adds GA4 debug mode only when explicitly requested", () => {
    const browserWindow: Record<string, unknown> = { apexAnalyticsConsent: "accepted" };
    const { document } = createDocument();
    initializeAnalytics(browserWindow, document as unknown as Document, {
      measurementId: "G-DEBUG123",
      debugMode: true,
    });
    const dataLayer = browserWindow.dataLayer as ArrayLike<unknown>[];
    expect(Array.from(dataLayer[3])).toEqual(["config", "G-DEBUG123", { anonymize_ip: true, traffic_class: "public", debug_mode: true }]);
  });

  it("does not load either SDK or keep events without accepted consent", () => {
    for (const consent of ["unknown", "declined"]) {
      const browserWindow: Record<string, unknown> = { apexAnalyticsConsent: consent, apexAnalyticsQueue: [{ name: "email_click", parameters: {} }] };
      const { document, scripts } = createDocument();
      initializeAnalytics(browserWindow, document as unknown as Document, { measurementId: "G-TEST", clarityProjectId: "clarity123" });
      expect(scripts).toEqual([]);
      expect(browserWindow.apexAnalyticsQueue).toEqual([]);
      expect(browserWindow["ga-disable-G-TEST"]).toBe(true);
      expect(browserWindow.gtag).toBeUndefined();
      expect(browserWindow.clarity).toBeUndefined();
    }
  });

  it("sets QA globally before the first config and preserves queued event classifications", () => {
    const browserWindow: Record<string, unknown> = {
      apexAnalyticsConsent: "accepted",
      location: { search: "?apex_qa=1" },
      apexAnalyticsQueue: [
        { name: "email_click", parameters: { traffic_class: "public" } },
        { name: "qa_generate_lead", parameters: { traffic_class: "qa" } },
      ],
    };
    const { document } = createDocument();
    initializeAnalytics(browserWindow, document as unknown as Document, { measurementId: "G-TEST" });
    const commands = (browserWindow.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands[2]).toEqual(["set", { traffic_class: "qa" }]);
    expect(commands[3]).toEqual(["config", "G-TEST", { anonymize_ip: true, traffic_class: "qa" }]);
    expect(commands[4]).toEqual(["event", "email_click", { traffic_class: "public" }]);
    expect(commands[5]).toEqual(["event", "qa_generate_lead", { traffic_class: "qa" }]);
    expect(commands.some((command) => command[0] === "event" && command[1] === "page_view")).toBe(false);
  });

  it("handles decline, acceptance, withdrawal and reacceptance without loading SDKs twice", () => {
    const values = new Map<string, string>();
    const browserWindow: Record<string, unknown> = {
      apexAnalyticsConsent: "unknown",
      localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { values.set(key, value); } },
    };
    vi.stubGlobal("window", browserWindow);
    const { document, scripts } = createDocument();
    const configuration = { measurementId: "G-TEST", clarityProjectId: "clarity123" };
    chooseAnalyticsConsent(browserWindow, "declined", "G-TEST");
    initializeAnalytics(browserWindow, document as unknown as Document, configuration);
    trackEvent("generate_lead");
    expect(scripts).toHaveLength(0);
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);

    chooseAnalyticsConsent(browserWindow, "accepted", "G-TEST");
    initializeAnalytics(browserWindow, document as unknown as Document, configuration);
    trackEvent("email_click");
    expect(scripts).toHaveLength(2);
    applyAnalyticsConsent(browserWindow, "unknown", "G-TEST");
    chooseAnalyticsConsent(browserWindow, "declined", "G-TEST");
    const commandsWhileDeclined = (browserWindow.dataLayer as ArrayLike<unknown>[]).length;
    trackEvent("generate_lead");
    expect((browserWindow.dataLayer as ArrayLike<unknown>[]).length).toBe(commandsWhileDeclined);
    expect(browserWindow["ga-disable-G-TEST"]).toBe(true);
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);

    chooseAnalyticsConsent(browserWindow, "accepted", "G-TEST");
    initializeAnalytics(browserWindow, document as unknown as Document, configuration);
    initializeAnalytics(browserWindow, document as unknown as Document, configuration);
    expect(scripts).toHaveLength(2);
    expect(browserWindow["ga-disable-G-TEST"]).toBe(false);
    const commands = (browserWindow.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.filter((command) => command[0] === "config")).toHaveLength(1);
    const clarityQueue = (browserWindow.clarity as { q: ArrayLike<unknown>[] }).q.map((entry) => Array.from(entry));
    expect(clarityQueue).toContainEqual(["consent", false]);
    expect(clarityQueue).toContainEqual(["stop"]);
    expect(clarityQueue).toContainEqual(["start"]);
    expect(clarityQueue.at(-1)).toEqual(["consent", true]);
  });

  it("rechecks withdrawal when a pending Clarity script finishes loading", () => {
    const browserWindow: Record<string, unknown> = { apexAnalyticsConsent: "accepted" };
    const { document, scripts } = createDocument();
    initializeAnalytics(browserWindow, document as unknown as Document, { measurementId: "G-TEST", clarityProjectId: "clarity123" });
    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    const clarity = vi.fn();
    browserWindow.clarity = clarity;
    scripts[1].onload?.();
    expect(clarity.mock.calls).toEqual([["consent", false], ["stop"]]);
    expect(browserWindow["ga-disable-G-TEST"]).toBe(true);
  });

  it("drops pre-SDK events across acceptance, withdrawal and reacceptance before loading", () => {
    const browserWindow: Record<string, unknown> = { apexAnalyticsConsent: "accepted" };
    vi.stubGlobal("window", browserWindow);
    const { document, scripts } = createDocument();
    const configuration = { measurementId: "G-TEST" };
    initializeAnalytics(browserWindow, document as unknown as Document, configuration);
    trackEvent("email_click");
    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    applyAnalyticsConsent(browserWindow, "accepted", "G-TEST");
    initializeAnalytics(browserWindow, document as unknown as Document, configuration);
    trackEvent("phone_click");
    scripts[0].onload?.();
    const commands = (browserWindow.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.some((command) => command[0] === "event" && command[1] === "email_click")).toBe(false);
    expect(commands.filter((command) => command[0] === "event" && command[1] === "phone_click")).toHaveLength(1);
    expect(commands.filter((command) => command[0] === "config")).toHaveLength(1);
    expect(scripts).toHaveLength(1);
  });

  it("hands the dataLayer to the SDK on load even if push remains native", () => {
    const browserWindow: Record<string, unknown> = { apexAnalyticsConsent: "accepted" };
    vi.stubGlobal("window", browserWindow);
    const { document, scripts } = createDocument();
    initializeAnalytics(browserWindow, document as unknown as Document, { measurementId: "G-TEST" });
    trackEvent("email_click");
    scripts[0].onload?.();
    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    const commands = (browserWindow.dataLayer as ArrayLike<unknown>[]).map((entry) => Array.from(entry));
    expect(commands.filter((command) => command[0] === "event" && command[1] === "email_click")).toHaveLength(1);
    expect(browserWindow["ga-disable-G-TEST"]).toBe(true);
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);
  });
});
