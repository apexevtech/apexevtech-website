import { siteUrl } from "@/lib/seo/site-urls";

export function buildWhatsAppInquiryHref(pathname: string | null) {
  const path = (pathname || "").split(/[?#]/, 1)[0];
  const isPublicDetail = /^\/(products|resources|interfaces|applications)\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
  const message = isPublicDetail
    ? `Hello APEX, I would like technical advice and equipment recommendations for this page:\n${new URL(path, siteUrl)}\n\nMy charger interface:\nVoltage / current range:\nRequired tests:`
    : "Hello APEX, I would like to learn more about your EV charger testing systems.";
  const params = new URLSearchParams({ phone: "8617714412321", text: message });
  return `https://api.whatsapp.com/send?${params}`;
}
