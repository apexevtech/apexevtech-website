"use client";

import { whatsappButtonClassName, whatsappIconPath } from "@/components/WhatsAppButton.styles";
import { trackEvent } from "@/lib/analytics/events";

export { whatsappIconPath } from "@/components/WhatsAppButton.styles";

export function WhatsAppButton() {
  const whatsappNumber = "8617714412321";
  const message = encodeURIComponent("Hello, I would like to learn more about your EV charger testing systems.");

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact APEX on WhatsApp"
      className={whatsappButtonClassName}
      onClick={() => trackEvent("whatsapp_click", { location: "floating" })}
    >
      <svg aria-hidden="true" className="h-5 w-5 shrink-0 fill-current" viewBox="0 0 24 24">
        <path d={whatsappIconPath} />
      </svg>
      <span>WhatsApp</span>
    </a>
  );
}
