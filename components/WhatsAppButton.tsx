"use client";

import { whatsappButtonClassName, whatsappIconPath } from "@/components/WhatsAppButton.styles";
import { trackEvent } from "@/lib/analytics/events";
import { usePathname } from "next/navigation";
import { buildWhatsAppInquiryHref } from "@/lib/inquiries/whatsapp";
import { useLanguage } from "@/components/LanguageProvider";

export { whatsappIconPath } from "@/components/WhatsAppButton.styles";

export function WhatsAppButton() {
  const { t } = useLanguage();
  const pathname = usePathname();

  return (
    <a
      href={buildWhatsAppInquiryHref(pathname)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("Contact APEX on WhatsApp")}
      title={t("Contact APEX on WhatsApp")}
      className={whatsappButtonClassName}
      onClick={() => trackEvent("whatsapp_click", { location: "floating" })}
    >
      <svg aria-hidden="true" className="h-6 w-6 shrink-0 fill-current" viewBox="0 0 24 24">
        <path d={whatsappIconPath} />
      </svg>
      <span className="sr-only sm:not-sr-only">WhatsApp</span>
    </a>
  );
}
