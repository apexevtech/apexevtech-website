import { whatsappButtonClassName } from "@/components/WhatsAppButton.styles";

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
    >
      <span aria-hidden="true" className="text-xl leading-none">◉</span>
      <span>WhatsApp</span>
    </a>
  );
}
