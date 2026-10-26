export type AnalyticsTrafficClass = "qa" | "public";

export type AnalyticsTrafficWindow = {
  location?: { search?: string };
  performance?: Pick<Performance, "getEntriesByType">;
  sessionStorage?: Pick<Storage, "getItem" | "setItem" | "removeItem">;
  apexAnalyticsTrafficClass?: AnalyticsTrafficClass;
  apexAnalyticsConfiguredTrafficClass?: AnalyticsTrafficClass;
};

const storageKey = "apex-qa-traffic";

export function readAnalyticsTrafficClass(browserWindow: AnalyticsTrafficWindow): AnalyticsTrafficClass {
  if (browserWindow.apexAnalyticsTrafficClass) return browserWindow.apexAnalyticsTrafficClass;

  let search = browserWindow.location?.search || "";
  try {
    // Consent can be accepted after client navigation. Use the document's initial URL.
    const navigation = browserWindow.performance?.getEntriesByType("navigation")[0];
    if (navigation?.name) search = new URL(navigation.name).search;
  } catch {
    // Older browsers fall back to the URL at the first local classification read.
  }

  let trafficClass: AnalyticsTrafficClass = "public";
  try {
    trafficClass = browserWindow.sessionStorage?.getItem(storageKey) === "1" ? "qa" : "public";
  } catch {
    // An unavailable session store must not classify ordinary traffic as QA.
  }

  const flags = new URLSearchParams(search).getAll("apex_qa");
  if (flags.length === 1 && (flags[0] === "1" || flags[0] === "0")) {
    trafficClass = flags[0] === "1" ? "qa" : "public";
    try {
      if (trafficClass === "qa") browserWindow.sessionStorage?.setItem(storageKey, "1");
      else browserWindow.sessionStorage?.removeItem(storageKey);
    } catch {
      // The explicit choice still applies in memory when session storage is blocked.
    }
  }

  browserWindow.apexAnalyticsTrafficClass = trafficClass;
  return trafficClass;
}
