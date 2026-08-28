import Link from "next/link";
import { company, navItems } from "@/data/site";
import { trackEvent } from "@/lib/analytics/events";

export function Footer() {
  return (
    <footer className="bg-[#102a43] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold">Apex EV Charger Testers</h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-300">
              Professional EV charger testing equipment and validation systems for manufacturers, laboratories and infrastructure operators worldwide.
            </p>
            <p className="mt-4 text-xs text-gray-400">Engineering · Quality · Delivery</p>
          </div>
          <div>
            <h2 className="text-lg font-bold">Quick Links</h2>
            <div className="mt-4 grid gap-2">
              {navItems.slice(1).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-gray-300 transition-colors hover:text-[#7de3ef]">
                  {item.label}
                </Link>
              ))}
              <Link href="/privacy-policy" className="text-sm text-gray-300 transition-colors hover:text-[#7de3ef]">
                Privacy Policy
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold">Contact Us</h2>
            <div className="mt-4 grid gap-3 text-sm text-gray-300">
              <a href={`mailto:${company.email}`} onClick={() => trackEvent("email_click", { location: "footer" })} className="hover:text-[#7de3ef]">{company.email}</a>
              <a href={`tel:${company.phone.replace(/[^0-9+]/g, "")}`} onClick={() => trackEvent("phone_click", { location: "footer" })} className="hover:text-[#7de3ef]">{company.phone}</a>
              <a href="https://api.whatsapp.com/send?phone=8617714412321" target="_blank" rel="noopener noreferrer" className="hover:text-[#25D366]">WhatsApp: +8617714412321</a>
              <span>{company.location}</span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-600 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Apex EV Charger Testers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
