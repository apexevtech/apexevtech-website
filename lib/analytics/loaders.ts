type AnalyticsConfiguration = {
  measurementId?: string;
  clarityProjectId?: string;
  debugMode?: boolean;
};

type AnalyticsFunction = ((...arguments_: unknown[]) => void) & {
  q?: ArrayLike<unknown>[];
};

type AnalyticsWindow = {
  dataLayer?: ArrayLike<unknown>[];
  gtag?: (...arguments_: unknown[]) => void;
  clarity?: AnalyticsFunction;
  requestIdleCallback?: (callback: () => void) => number;
};

export function scheduleAnalyticsInitialization(
  browserWindow: AnalyticsWindow,
  document: Document,
  configuration: AnalyticsConfiguration,
) {
  if (typeof browserWindow.requestIdleCallback === "function") {
    browserWindow.requestIdleCallback(() => initializeAnalytics(browserWindow, document, configuration));
    return;
  }
  setTimeout(() => initializeAnalytics(browserWindow, document, configuration), 0);
}

export function initializeAnalytics(
  browserWindow: AnalyticsWindow,
  document: Document,
  configuration: AnalyticsConfiguration,
) {
  if (configuration.measurementId && typeof browserWindow.gtag !== "function") {
    browserWindow.dataLayer = browserWindow.dataLayer || [];
    browserWindow.gtag = function () {
      browserWindow.dataLayer?.push(arguments);
    };

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${configuration.measurementId}`;
    document.head.appendChild(script);

    browserWindow.gtag("js", new Date());
    browserWindow.gtag("config", configuration.measurementId, {
      anonymize_ip: true,
      ...(configuration.debugMode ? { debug_mode: true } : {}),
    });
  }

  if (configuration.clarityProjectId && typeof browserWindow.clarity !== "function") {
    const clarity: AnalyticsFunction = function () {
      clarity.q = clarity.q || [];
      clarity.q.push(arguments);
    };
    browserWindow.clarity = clarity;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.clarity.ms/tag/${configuration.clarityProjectId}`;
    document.head.appendChild(script);
  }
}
