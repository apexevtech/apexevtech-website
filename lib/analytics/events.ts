export type AnalyticsEventName =
  | "generate_lead"
  | "whatsapp_click"
  | "email_click"
  | "phone_click"
  | "catalog_download";

declare global {
  interface Window {
    gtag?: (command: "event", name: AnalyticsEventName, parameters?: Record<string, string>) => void;
  }
}

export function trackEvent(name: AnalyticsEventName, parameters: Record<string, string> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}

