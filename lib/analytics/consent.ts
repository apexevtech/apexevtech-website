export type AnalyticsConsent = "accepted" | "declined" | "unknown";
export const analyticsConsentStorageKey = "apex-analytics-consent";

export type AnalyticsFunction = ((...arguments_: unknown[]) => void) & { q?: ArrayLike<unknown>[] };
export type AnalyticsConsentWindow = {
  localStorage?: Pick<Storage, "getItem" | "setItem">;
  gtag?: (...arguments_: unknown[]) => void;
  clarity?: AnalyticsFunction;
  dataLayer?: ArrayLike<unknown>[];
  apexAnalyticsConsent?: AnalyticsConsent;
  apexAnalyticsMeasurementId?: string;
  apexAnalyticsClarityStopped?: boolean;
  apexAnalyticsQueue?: Array<{ name: string; parameters: Record<string, unknown> }>;
};

type PendingDataLayer = {
  queue: ArrayLike<unknown>[];
  push: ArrayLike<unknown>[]["push"];
  gtag: AnalyticsConsentWindow["gtag"];
};
const pendingDataLayers = new WeakMap<AnalyticsConsentWindow, PendingDataLayer>();

type PendingClarity = { queue: AnalyticsFunction; startConfiguration?: unknown };
const pendingClarity = new WeakMap<AnalyticsConsentWindow, PendingClarity>();

export function createPendingClarityQueue(browserWindow: AnalyticsConsentWindow): AnalyticsFunction {
  const queue: AnalyticsFunction = function () {
    const command = arguments[0];
    const pending = pendingClarity.get(browserWindow);
    if (command === "start" && arguments[1] !== undefined && pending) pending.startConfiguration = arguments[1];
    queue.q = queue.q || [];
    if (readAnalyticsConsent(browserWindow) !== "accepted") {
      // The hosted bootstrap moves its last start command to the front with pop/unshift.
      if (command === "start") queue.q.push(["stop"]);
      else if (command === "stop" || (command === "consent" && arguments[1] === false)) queue.q.push(arguments);
      return;
    }
    queue.q.push(arguments);
  };
  pendingClarity.set(browserWindow, { queue });
  return queue;
}

export function ownPendingAnalyticsDataLayer(browserWindow: AnalyticsConsentWindow) {
  const queue = browserWindow.dataLayer;
  if (queue?.push === Array.prototype.push) {
    pendingDataLayers.set(browserWindow, { queue, push: queue.push, gtag: browserWindow.gtag });
  }
}

export function releasePendingAnalyticsDataLayer(browserWindow: AnalyticsConsentWindow) {
  pendingDataLayers.delete(browserWindow);
}

declare global {
  interface Window {
    clarity?: AnalyticsFunction;
    apexAnalyticsConsent?: AnalyticsConsent;
    apexAnalyticsMeasurementId?: string;
    apexAnalyticsClarityStopped?: boolean;
  }
}

export function readAnalyticsConsent(browserWindow: AnalyticsConsentWindow): AnalyticsConsent {
  if (browserWindow.apexAnalyticsConsent) return browserWindow.apexAnalyticsConsent;
  let consent: AnalyticsConsent = "unknown";
  try {
    const saved = browserWindow.localStorage?.getItem(analyticsConsentStorageKey);
    if (saved === "accepted" || saved === "declined") consent = saved;
  } catch {
    consent = "declined";
  }
  browserWindow.apexAnalyticsConsent = consent;
  return consent;
}

function callClarity(browserWindow: AnalyticsConsentWindow, ...args: unknown[]) {
  try { browserWindow.clarity?.(...args); } catch { /* Optional SDK failures must not interrupt consent controls. */ }
}

export function applyAnalyticsConsent(browserWindow: AnalyticsConsentWindow, consent: AnalyticsConsent, measurementId = browserWindow.apexAnalyticsMeasurementId) {
  const previous = browserWindow.apexAnalyticsConsent;
  browserWindow.apexAnalyticsConsent = consent;
  if (measurementId) {
    browserWindow.apexAnalyticsMeasurementId = measurementId;
    (browserWindow as Record<string, unknown>)[`ga-disable-${measurementId}`] = consent !== "accepted";
  }

  if (consent !== "accepted") {
    browserWindow.apexAnalyticsQueue = [];
    const pending = pendingDataLayers.get(browserWindow);
    const queue = pending?.queue;
    // Only our untouched pre-SDK buffer is editable. A loaded SDK may keep a cursor.
    if (queue && browserWindow.dataLayer === queue && queue.push === pending.push && browserWindow.gtag === pending.gtag) {
      for (let index = queue.length - 1; index >= 0; index -= 1) {
        if (queue[index][0] === "event") queue.splice(index, 1);
      }
    } else if (pending) {
      releasePendingAnalyticsDataLayer(browserWindow);
    }
  }
  if (typeof browserWindow.gtag === "function" && previous !== consent) {
    try {
      browserWindow.gtag("consent", "update", { analytics_storage: consent === "accepted" ? "granted" : "denied" });
    } catch { /* The synchronous disable flag remains authoritative when gtag is unavailable. */ }
  }

  if (typeof browserWindow.clarity === "function") {
    if (consent !== "accepted") {
      const pending = pendingClarity.get(browserWindow);
      if (pending && browserWindow.clarity === pending.queue) pending.queue.q = [];
      callClarity(browserWindow, "consent", false);
      // consent(false) can replace the global function with the SDK's stopped queue.
      callClarity(browserWindow, "stop");
      browserWindow.apexAnalyticsClarityStopped = true;
    } else if (browserWindow.apexAnalyticsClarityStopped) {
      const configuration = pendingClarity.get(browserWindow)?.startConfiguration;
      if (configuration !== undefined) callClarity(browserWindow, "start", configuration);
      else callClarity(browserWindow, "start");
      callClarity(browserWindow, "consent", true);
      browserWindow.apexAnalyticsClarityStopped = false;
    }
  }
}

export function chooseAnalyticsConsent(browserWindow: AnalyticsConsentWindow, consent: Exclude<AnalyticsConsent, "unknown">, measurementId?: string): AnalyticsConsent {
  let next = consent;
  try {
    if (browserWindow.localStorage) browserWindow.localStorage.setItem(analyticsConsentStorageKey, consent);
    else next = "declined";
  } catch {
    // If a choice cannot be persisted, keep this document opted out.
    next = "declined";
  }
  applyAnalyticsConsent(browserWindow, next, measurementId);
  return next;
}

export function syncAnalyticsConsentStorage(browserWindow: AnalyticsConsentWindow, key: string | null, newValue: string | null, measurementId?: string): AnalyticsConsent | undefined {
  if (key !== analyticsConsentStorageKey && key !== null) return;
  const next = newValue === "accepted" || newValue === "declined" ? newValue : "unknown";
  applyAnalyticsConsent(browserWindow, next, measurementId);
  return next;
}
