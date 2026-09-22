export type AnalyticsEventName =
  | "view_item"
  | "generate_lead"
  | "inquiry_start"
  | "inquiry_submit"
  | "inquiry_error"
  | "whatsapp_click"
  | "email_click"
  | "phone_click"
  | "catalog_download"
  | "product_compare"
  | "comparison_inquiry_click";

declare global {
  interface Window {
    gtag?: (...arguments_: unknown[]) => void;
    apexAnalyticsQueue?: Array<{ name: AnalyticsEventName; parameters: Record<string, unknown> }>;
  }
}

export function trackEvent(name: AnalyticsEventName, parameters: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const eventParameters = {
    ...(window.location?.pathname ? { page_path: window.location.pathname } : {}),
    ...parameters,
  };
  if (typeof window.gtag !== "function") {
    window.apexAnalyticsQueue = window.apexAnalyticsQueue || [];
    window.apexAnalyticsQueue.push({ name, parameters: eventParameters });
    return;
  }
  try {
    window.gtag("event", name, eventParameters);
  } catch {
    // A failed analytics script must not interrupt an inquiry or contact link.
  }
}
