export type UtmValues = Partial<Record<"utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm", string>>;
export type UtmAttribution = { firstTouch: UtmValues; latestTouch: UtmValues };

const STORAGE_KEY = "apex-utm-attribution-v1";
const fieldMap = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
} as const;

function clean(value: string | null): string | undefined {
  const result = value?.trim().slice(0, 120);
  return result || undefined;
}

export function parseUtm(params: URLSearchParams): UtmValues {
  const result: UtmValues = {};
  for (const [key, property] of Object.entries(fieldMap)) {
    const value = clean(params.get(key));
    if (value) result[property] = value;
  }
  return result;
}

function hasValues(value: UtmValues): boolean {
  return Object.keys(value).length > 0;
}

export function readAttribution(): UtmAttribution {
  if (typeof window === "undefined") return { firstTouch: {}, latestTouch: {} };
  try {
    const value = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null") as Partial<UtmAttribution> | null;
    return {
      firstTouch: value?.firstTouch && typeof value.firstTouch === "object" ? value.firstTouch : {},
      latestTouch: value?.latestTouch && typeof value.latestTouch === "object" ? value.latestTouch : {},
    };
  } catch {
    return { firstTouch: {}, latestTouch: {} };
  }
}

export function captureAttribution(values: UtmValues): UtmAttribution {
  const current = readAttribution();
  const next = {
    firstTouch: hasValues(current.firstTouch) ? current.firstTouch : values,
    latestTouch: hasValues(values) ? values : current.latestTouch,
  };
  if (typeof window !== "undefined") {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* optional storage */ }
  }
  return next;
}

export function clearAttribution() {
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* optional storage */ }
}
