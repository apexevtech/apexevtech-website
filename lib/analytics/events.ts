import { readAnalyticsTrafficClass } from "@/lib/analytics/traffic-class";
import { readAnalyticsConsent } from "@/lib/analytics/consent";

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
  | "guide_print"
  | "guide_equipment_click"
  | "guide_inquiry_click"
  | "product_compare"
  | "product_filter"
  | "catalog_inquiry_click"
  | "comparison_inquiry_click"
  | "case_inquiry_click"
  | "library_material_click";

type SentAnalyticsEventName = AnalyticsEventName | "qa_generate_lead";

declare global {
  interface Window {
    gtag?: (...arguments_: unknown[]) => void;
    apexAnalyticsQueue?: Array<{ name: SentAnalyticsEventName; parameters: Record<string, unknown> }>;
    apexAnalyticsTrafficClass?: "qa" | "public";
    apexAnalyticsConfiguredTrafficClass?: "qa" | "public";
  }
}

export function trackEvent(name: AnalyticsEventName, parameters: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  if (readAnalyticsConsent(window) !== "accepted") {
    window.apexAnalyticsQueue = [];
    return;
  }
  const trafficClass = readAnalyticsTrafficClass(window);
  const eventName = name === "generate_lead" && trafficClass === "qa" ? "qa_generate_lead" : name;
  const eventParameters = {
    ...(window.location?.pathname ? { page_path: window.location.pathname } : {}),
    ...parameters,
    traffic_class: trafficClass,
  };
  if (typeof window.gtag !== "function") {
    window.apexAnalyticsQueue = window.apexAnalyticsQueue || [];
    window.apexAnalyticsQueue.push({ name: eventName, parameters: eventParameters });
    return;
  }
  try {
    window.gtag("event", eventName, eventParameters);
  } catch {
    // A failed analytics script must not interrupt an inquiry or contact link.
  }
}
