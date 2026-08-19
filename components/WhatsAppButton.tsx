import { company } from "@/data/site";

export function WhatsAppButton() {
  const whatsappNumber = "8617714412321";
  const message = encodeURIComponent("Hello, I would like to learn more about your EV charger testing systems.");

  return (
    <a
      href={`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact APEX on WhatsApp"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#1ebe5d] hover:shadow-xl sm:bottom-7 sm:right-7"
    >
      <span aria-hidden="true" className="text-xl leading-none">◉</span>
      <span>WhatsApp</span>
    </a>
  );
}
