import { getEngineeringCaseDetailHref } from "@/lib/engineering-cases/detail-path";
import { siteUrl } from "@/lib/seo/site-urls";
import { stripLanguagePrefix } from "@/lib/i18n/urls";

export function buildWhatsAppInquiryHref(pathname: string | null) {
  const path = (pathname || "").split(/[?#]/, 1)[0];
  const canonicalPath = stripLanguagePrefix(path);
  const caseSlug = /^\/project-cases\/([a-z0-9]+(?:-[a-z0-9]+)*)$/.exec(canonicalPath)?.[1];
  const isPublicDetail = /^\/(products|resources|interfaces|applications)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(canonicalPath)
    || (caseSlug !== undefined && getEngineeringCaseDetailHref(caseSlug) === canonicalPath);
  const message = isPublicDetail
    ? `Hello APEX, I would like technical advice and equipment recommendations for this page:\n${new URL(path, siteUrl)}\n\nMy charger interface:\nVoltage / current range:\nRequired tests:`
    : "Hello APEX, I would like to learn more about your EV charger testing systems.";
  const params = new URLSearchParams({ phone: "8617714412321", text: message });
  return `https://api.whatsapp.com/send?${params}`;
}
