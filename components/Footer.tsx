import Link from "@/components/LocaleLink";
import { ExternalLink } from "lucide-react";
import { company, navItems } from "@/data/site";
import { TrackedLink } from "@/components/TrackedLink";
import { T } from "@/components/LanguageProvider";

export function Footer() {
  return (
    <footer className="bg-[#102a43] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h2 className="text-lg font-bold"><Link href="/" className="hover:text-[#7de3ef]"><T>Apex EV Charger Testers</T></Link></h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-gray-300">
              <T>Professional EV charger testing equipment and validation systems for manufacturers, laboratories and infrastructure operators worldwide.</T>
            </p>
            <p className="mt-4 text-xs text-gray-400"><T>Engineering · Quality · Delivery</T></p>
          </div>
          <div>
            <h2 className="text-lg font-bold"><T>Quick Links</T></h2>
            <div className="mt-4 grid gap-2">
              {navItems.slice(1).map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-gray-300 transition-colors hover:text-[#7de3ef]">
                  <T>{item.label}</T>
                </Link>
              ))}
              <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" prefetch={false} className="inline-flex min-h-11 w-fit max-w-full items-center gap-1 text-sm text-gray-300 transition-colors hover:text-[#7de3ef]">
                <span aria-hidden="true"><T>Privacy Policy</T></span>
                <ExternalLink size={13} aria-hidden="true" className="shrink-0" />
                <span className="sr-only"><T>Privacy Policy (opens in a new tab)</T></span>
              </Link>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold"><T>Contact Us</T></h2>
            <div className="mt-4 grid gap-3 text-sm text-gray-300">
              <TrackedLink href={`mailto:${company.email}`} eventName="email_click" location="footer" className="hover:text-[#7de3ef]">{company.email}</TrackedLink>
              <TrackedLink href={`tel:${company.phone.replace(/[^0-9+]/g, "")}`} eventName="phone_click" location="footer" className="hover:text-[#7de3ef]">{company.phone}</TrackedLink>
              <TrackedLink href="https://api.whatsapp.com/send?phone=8617714412321" target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" location="footer" className="hover:text-[#25D366]">WhatsApp: +8617714412321</TrackedLink>
              <span><T>{company.location}</T></span>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-gray-600 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} <T>Apex EV Charger Testers. All rights reserved.</T>
        </div>
      </div>
    </footer>
  );
}
