import { applyAnalyticsConsent, createPendingClarityQueue, ownPendingAnalyticsDataLayer, readAnalyticsConsent, releasePendingAnalyticsDataLayer, type AnalyticsConsentWindow, type AnalyticsFunction } from "@/lib/analytics/consent";
import { readAnalyticsTrafficClass, type AnalyticsTrafficWindow } from "@/lib/analytics/traffic-class";

type AnalyticsConfiguration = {
  measurementId?: string;
  clarityProjectId?: string;
  debugMode?: boolean;
};

type AnalyticsWindow = AnalyticsTrafficWindow & AnalyticsConsentWindow & {
  dataLayer?: ArrayLike<unknown>[];
  gtag?: (...arguments_: unknown[]) => void;
  clarity?: AnalyticsFunction;
  apexAnalyticsQueue?: Array<{ name: string; parameters: Record<string, unknown> }>;
};

function configureAnalyticsTrafficClass(browserWindow: AnalyticsWindow) {
  const trafficClass = readAnalyticsTrafficClass(browserWindow);
  if (typeof browserWindow.gtag === "function" && browserWindow.apexAnalyticsConfiguredTrafficClass !== trafficClass) {
    try {
      browserWindow.gtag("set", { traffic_class: trafficClass });
      browserWindow.apexAnalyticsConfiguredTrafficClass = trafficClass;
    } catch {
      // Analytics must not prevent a URL or consent change.
    }
  }
  return trafficClass;
}

export function scheduleAnalyticsInitialization(
  browserWindow: AnalyticsWindow,
  document: Document,
  configuration: AnalyticsConfiguration,
) {
  // Consent has already been granted by the time this function runs. Loading
  // immediately preserves the first page view and short visits; an idle
  // callback can be delayed indefinitely in background or throttled tabs.
  initializeAnalytics(browserWindow, document, configuration);
}

export function initializeAnalytics(
  browserWindow: AnalyticsWindow,
  document: Document,
  configuration: AnalyticsConfiguration,
) {
  const consent = readAnalyticsConsent(browserWindow);
  applyAnalyticsConsent(browserWindow, consent, configuration.measurementId);
  if (consent !== "accepted") return;

  if (configuration.measurementId && typeof browserWindow.gtag !== "function") {
    const createdDataLayer = !browserWindow.dataLayer;
    browserWindow.dataLayer = browserWindow.dataLayer || [];
    browserWindow.gtag = function () {
      browserWindow.dataLayer?.push(arguments);
    };
    if (createdDataLayer) ownPendingAnalyticsDataLayer(browserWindow);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${configuration.measurementId}`;
    script.onload = () => releasePendingAnalyticsDataLayer(browserWindow);
    document.head.appendChild(script);

    browserWindow.gtag("js", new Date());
    // Set global and destination scope; this document's classification never changes.
    browserWindow.gtag("consent", "update", { analytics_storage: "granted" });
    const trafficClass = configureAnalyticsTrafficClass(browserWindow);
    browserWindow.gtag("config", configuration.measurementId, {
      anonymize_ip: true,
      traffic_class: trafficClass,
      ...(configuration.debugMode ? { debug_mode: true } : {}),
    });
    for (const event of browserWindow.apexAnalyticsQueue || []) {
      const trafficClass = event.parameters.traffic_class === "qa" ? "qa" : "public";
      const name = event.name === "generate_lead" && trafficClass === "qa" ? "qa_generate_lead" : event.name;
      browserWindow.gtag("event", name, { ...event.parameters, traffic_class: trafficClass });
    }
    browserWindow.apexAnalyticsQueue = [];
  } else if (configuration.measurementId) {
    configureAnalyticsTrafficClass(browserWindow);
  }

  if (configuration.clarityProjectId && typeof browserWindow.clarity !== "function") {
    const clarity = createPendingClarityQueue(browserWindow);
    browserWindow.clarity = clarity;
    clarity("consent", true);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${configuration.clarityProjectId}`;
    script.onload = () => applyAnalyticsConsent(browserWindow, readAnalyticsConsent(browserWindow), configuration.measurementId);
    document.head.appendChild(script);
  }
}
