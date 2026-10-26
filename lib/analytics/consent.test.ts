import { describe, expect, it, vi } from "vitest";
import { analyticsConsentStorageKey, applyAnalyticsConsent, chooseAnalyticsConsent, createPendingClarityQueue, ownPendingAnalyticsDataLayer, readAnalyticsConsent, releasePendingAnalyticsDataLayer, syncAnalyticsConsentStorage, type AnalyticsConsentWindow, type AnalyticsFunction } from "@/lib/analytics/consent";

function localStore(value?: string) {
  const values = new Map(value ? [[analyticsConsentStorageKey, value]] : []);
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, next: string) => { values.set(key, next); },
  };
}

describe("analytics consent", () => {
  it("reads only explicit saved consent and fails closed for unavailable storage", () => {
    expect(readAnalyticsConsent({ localStorage: localStore("accepted") })).toBe("accepted");
    expect(readAnalyticsConsent({ localStorage: localStore("declined") })).toBe("declined");
    expect(readAnalyticsConsent({ localStorage: localStore("yes") })).toBe("unknown");
    expect(readAnalyticsConsent({})).toBe("unknown");
    expect(readAnalyticsConsent({ localStorage: { getItem: () => { throw new Error("blocked"); }, setItem: vi.fn() } })).toBe("declined");
  });

  it("synchronously disables GA and clears both pending event queues on withdrawal", () => {
    const browserWindow: AnalyticsConsentWindow & Record<string, unknown> = {
      apexAnalyticsConsent: "accepted",
      apexAnalyticsMeasurementId: "G-TEST",
      apexAnalyticsQueue: [{ name: "generate_lead", parameters: {} }],
      dataLayer: [["config", "G-TEST"], ["event", "email_click", {}]],
    };
    const gtag = vi.fn(() => { expect(browserWindow["ga-disable-G-TEST"]).toBe(true); });
    browserWindow.gtag = gtag;
    ownPendingAnalyticsDataLayer(browserWindow);
    applyAnalyticsConsent(browserWindow, "declined");
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);
    expect(browserWindow.dataLayer).toEqual([["config", "G-TEST"]]);
    expect(gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "denied" });
    expect(readAnalyticsConsent(browserWindow)).toBe("declined");
  });

  it("never edits an SDK-owned dataLayer or disturbs its processing cursor", () => {
    const queue: ArrayLike<unknown>[] = [["config", "G-TEST"], ["event", "already_processed", {}]];
    const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted", dataLayer: queue };
    browserWindow.gtag = function () { queue.push(arguments); };
    ownPendingAnalyticsDataLayer(browserWindow);
    let cursor = queue.length;
    const processed: unknown[][] = [];
    const sdkPush = vi.fn(function (...commands: ArrayLike<unknown>[]) {
      Array.prototype.push.apply(queue, commands);
      while (cursor < queue.length) processed.push(Array.from(queue[cursor++]));
      return queue.length;
    });
    queue.push = sdkPush;

    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    expect(queue[1]).toEqual(["event", "already_processed", {}]);
    expect(queue.push).toBe(sdkPush);
    expect(processed).toEqual([["consent", "update", { analytics_storage: "denied" }]]);
    expect(cursor).toBe(3);
    applyAnalyticsConsent(browserWindow, "accepted", "G-TEST");
    expect(processed[1]).toEqual(["consent", "update", { analytics_storage: "granted" }]);
    expect(cursor).toBe(4);
  });

  it("leaves handed-off and foreign native queues intact", () => {
    for (const wasOwned of [false, true]) {
      const queue: ArrayLike<unknown>[] = [["event", "retained_sdk_event", {}]];
      const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted", dataLayer: queue };
      if (wasOwned) {
        ownPendingAnalyticsDataLayer(browserWindow);
        releasePendingAnalyticsDataLayer(browserWindow);
      }
      applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
      expect(queue).toEqual([["event", "retained_sdk_event", {}]]);
    }
  });

  it("stops the current Clarity function after consent(false) replaces the runtime", () => {
    const stoppedQueue = vi.fn();
    const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted" };
    const runtime = vi.fn(() => { browserWindow.clarity = stoppedQueue; });
    browserWindow.clarity = runtime;
    applyAnalyticsConsent(browserWindow, "unknown");
    expect(runtime).toHaveBeenCalledWith("consent", false);
    expect(stoppedQueue).toHaveBeenCalledWith("stop");
    expect(browserWindow.apexAnalyticsClarityStopped).toBe(true);
    applyAnalyticsConsent(browserWindow, "accepted");
    expect(stoppedQueue.mock.calls).toEqual([["stop"], ["start"], ["consent", true]]);
  });

  it("blocks a delayed bootstrap start after withdrawal and preserves its configuration for reacceptance", () => {
    const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted" };
    const queue = createPendingClarityQueue(browserWindow);
    browserWindow.clarity = queue;
    queue("consent", true);
    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    const configuration = { projectId: "original-project", upload: "https://k.clarity.ms/collect", track: true };
    queue("metadata", vi.fn());
    queue("start", configuration);
    queue.q!.unshift(queue.q!.pop()!);
    queue("set", "C_IS", "0");
    const pending = queue.q!.map((entry) => Array.from(entry));
    expect(pending).toEqual([["stop"], ["consent", false], ["stop"]]);
    expect(pending.some((entry) => entry[0] === "start")).toBe(false);
    const runtime = vi.fn<AnalyticsFunction>();
    browserWindow.clarity = runtime;
    for (const command of pending) runtime(...command);
    expect(runtime).not.toHaveBeenCalledWith("consent", true);
    applyAnalyticsConsent(browserWindow, "accepted", "G-TEST");
    expect(runtime).toHaveBeenCalledWith("start", configuration);
    expect(runtime).toHaveBeenLastCalledWith("consent", true);
  });

  it("removes an already queued bootstrap start when the engine is still pending", () => {
    const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted" };
    const queue = createPendingClarityQueue(browserWindow);
    browserWindow.clarity = queue;
    queue("consent", true);
    const configuration = { projectId: "original-project", upload: "https://k.clarity.ms/collect" };
    queue("start", configuration);
    queue.q!.unshift(queue.q!.pop()!);
    queue("set", "C_IS", "0");
    applyAnalyticsConsent(browserWindow, "unknown", "G-TEST");
    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    expect(queue.q!.map((entry) => Array.from(entry))).toEqual([["consent", false], ["stop"]]);
    const runtime = vi.fn<AnalyticsFunction>();
    browserWindow.clarity = runtime;
    applyAnalyticsConsent(browserWindow, "accepted", "G-TEST");
    expect(runtime.mock.calls).toEqual([["start", configuration], ["consent", true]]);
  });

  it("allows a delayed original bootstrap to initialize after consent is explicitly restored", () => {
    const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted" };
    const queue = createPendingClarityQueue(browserWindow);
    browserWindow.clarity = queue;
    queue("consent", true);
    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    applyAnalyticsConsent(browserWindow, "accepted", "G-TEST");
    const configuration = { projectId: "original-project", upload: "https://k.clarity.ms/collect" };
    queue("start", configuration);
    queue.q!.unshift(queue.q!.pop()!);
    expect(Array.from(queue.q![0])).toEqual(["start", configuration]);
  });

  it("does not clear a Clarity queue once the SDK has replaced our stub", () => {
    const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted" };
    browserWindow.clarity = createPendingClarityQueue(browserWindow);
    const runtime = vi.fn<AnalyticsFunction>();
    runtime.q = [["sdk-owned-command"]];
    browserWindow.clarity = runtime;
    applyAnalyticsConsent(browserWindow, "declined", "G-TEST");
    expect(runtime.q).toEqual([["sdk-owned-command"]]);
    expect(runtime.mock.calls).toEqual([["consent", false], ["stop"]]);
  });

  it("persists choices and restores existing SDKs without reloading the page", () => {
    const browserWindow: AnalyticsConsentWindow & Record<string, unknown> = {
      localStorage: localStore(),
      gtag: vi.fn(),
      clarity: vi.fn(() => undefined),
      apexAnalyticsConsent: "unknown",
      apexAnalyticsClarityStopped: true,
    };
    expect(chooseAnalyticsConsent(browserWindow, "accepted", "G-TEST")).toBe("accepted");
    expect(browserWindow["ga-disable-G-TEST"]).toBe(false);
    expect(browserWindow.gtag).toHaveBeenCalledWith("consent", "update", { analytics_storage: "granted" });
    expect(browserWindow.clarity).toHaveBeenCalledWith("start");
    expect(browserWindow.clarity).toHaveBeenCalledWith("consent", true);
    expect(browserWindow.localStorage?.getItem(analyticsConsentStorageKey)).toBe("accepted");
  });

  it("keeps a blocked persistence attempt opted out even when a tag already exists", () => {
    const browserWindow: AnalyticsConsentWindow & Record<string, unknown> = {
      localStorage: { getItem: vi.fn(), setItem: () => { throw new Error("blocked"); } },
      gtag: vi.fn(),
      clarity: vi.fn(() => undefined),
      apexAnalyticsConsent: "accepted",
      apexAnalyticsQueue: [{ name: "email_click", parameters: {} }],
    };
    expect(chooseAnalyticsConsent(browserWindow, "accepted", "G-TEST")).toBe("declined");
    expect(browserWindow["ga-disable-G-TEST"]).toBe(true);
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);
    expect(chooseAnalyticsConsent({}, "accepted")).toBe("declined");
  });

  it("synchronizes cross-tab withdrawal, storage clear and reacceptance", () => {
    const browserWindow: AnalyticsConsentWindow & Record<string, unknown> = { apexAnalyticsConsent: "accepted", gtag: vi.fn(), clarity: vi.fn(() => undefined) };
    expect(syncAnalyticsConsentStorage(browserWindow, "another-setting", "declined", "G-TEST")).toBeUndefined();
    expect(readAnalyticsConsent(browserWindow)).toBe("accepted");
    expect(syncAnalyticsConsentStorage(browserWindow, analyticsConsentStorageKey, "declined", "G-TEST")).toBe("declined");
    expect(browserWindow["ga-disable-G-TEST"]).toBe(true);
    expect(syncAnalyticsConsentStorage(browserWindow, null, null, "G-TEST")).toBe("unknown");
    expect(syncAnalyticsConsentStorage(browserWindow, analyticsConsentStorageKey, "accepted", "G-TEST")).toBe("accepted");
    expect(browserWindow["ga-disable-G-TEST"]).toBe(false);
  });

  it("keeps consent controls usable when optional SDK commands throw", () => {
    const fail = () => { throw new Error("blocked SDK"); };
    const browserWindow: AnalyticsConsentWindow = { apexAnalyticsConsent: "accepted", gtag: fail, clarity: fail };
    expect(() => applyAnalyticsConsent(browserWindow, "declined", "G-TEST")).not.toThrow();
    expect(readAnalyticsConsent(browserWindow)).toBe("declined");
  });
});
