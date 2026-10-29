"use client";

import Image from "next/image";
import Link from "@/components/LocaleLink";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { company, navItems } from "@/data/site";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { T, useLanguage } from "@/components/LanguageProvider";
import { stripLanguagePrefix } from "@/lib/i18n/urls";

export function Header() {
  const { t } = useLanguage();
  const headerRef = useRef<HTMLElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);
  const productsToggleRef = useRef<HTMLButtonElement>(null);
  const pathname = stripLanguagePrefix(usePathname());
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/project-cases") {
      return ["/project-cases", "/resources", "/engineering-cases", "/library"].some((section) => pathname === section || pathname.startsWith(`${section}/`));
    }
    return pathname.startsWith(`${href}/`) || pathname === href || (href === "/solutions" && pathname.startsWith("/applications/"));
  };
  const navClass = (href: string) => `whitespace-nowrap text-base font-semibold leading-6 transition-colors hover:text-[#1268a8] 2xl:text-[17px] ${isActive(href) ? "text-[#1268a8] underline decoration-2 underline-offset-[10px]" : "text-[#34495c]"}`;

  useEffect(() => {
    if (!productsOpen && !open) return;
    const dismissOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setProductsOpen(false);
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", dismissOutside);
    return () => document.removeEventListener("pointerdown", dismissOutside);
  }, [productsOpen, open]);

  const closeMobileMenu = () => {
    setOpen(false);
    setProductsOpen(false);
  };

  const productChildren = [
    { label: "DC Testers", href: "/products?type=dc#equipment" },
    { label: "AC Testers", href: "/products?type=ac#equipment" },
    { label: "Interface Testing Guides", href: "/interfaces" },
  ];

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_24px_rgba(18,38,58,0.05)] backdrop-blur">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 2xl:max-w-[1440px]"
        aria-label={t("Main navigation")}
        onKeyDown={(event) => {
          if (event.key === "Escape" && (open || productsOpen)) {
            event.preventDefault();
            (open ? mobileToggleRef : productsToggleRef).current?.focus();
            closeMobileMenu();
          }
        }}
      >
        <div className="flex h-[76px] items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label={`${company.name} home`}>
            <Image
              src="/assets/apex-logo.webp"
              alt="APEX"
              width={96}
              height={93}
              priority
              className="h-11 w-11 rounded object-contain sm:h-12 sm:w-12"
            />
            <span className="hidden truncate text-[15px] font-black uppercase text-[#12263a] sm:inline sm:text-base">Apex Power Systems</span>
            <span className="text-base font-black text-[#12263a] sm:hidden">APEX</span>
          </Link>

          <div className="hidden shrink-0 items-center gap-5 xl:flex 2xl:gap-6">
            {navItems.map((item) => item.label === "Products" ? (
              <div key={item.href} className="relative">
                <button ref={productsToggleRef} type="button" onClick={() => setProductsOpen((value) => !value)} aria-expanded={productsOpen} aria-controls="desktop-product-navigation" className={`flex items-center gap-1 ${navClass(item.href)}`}>
                  <T>Products</T> <ChevronDown size={16} strokeWidth={2.5} aria-hidden="true" className={`shrink-0 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
                </button>
                {productsOpen && (
                  <div id="desktop-product-navigation" className="absolute left-1/2 top-full mt-4 w-60 -translate-x-1/2 rounded-md border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10">
                    {productChildren.map((child) => <Link key={child.href} href={child.href} onClick={() => setProductsOpen(false)} className="block px-4 py-2.5 text-base font-semibold text-[#12263a] hover:bg-slate-50 hover:text-[#1268a8]"><T>{child.label}</T></Link>)}
                    <Link href={item.href} onClick={() => setProductsOpen(false)} className="block border-t border-slate-100 px-4 py-2.5 text-base font-bold text-[#1268a8]"><T>All Products</T></Link>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} className={navClass(item.href)}><T>{item.label}</T></Link>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <Link href="/contact#inquiry-form" className="hidden whitespace-nowrap rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0f5f9f] md:inline-flex">
              <T>Talk to an engineer</T>
            </Link>

            <LanguageSwitcher />

            <button
              ref={mobileToggleRef}
              type="button"
              className="flex h-10 w-10 items-center justify-center text-2xl text-[#12263a] xl:hidden"
              aria-label={t(open ? "Close menu" : "Open menu")}
              aria-expanded={open}
              aria-controls="mobile-navigation"
              onClick={() => (open ? closeMobileMenu() : setOpen(true))}
            >
              {open ? "×" : "☰"}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-navigation" className="max-h-[calc(100dvh-77px)] overflow-y-auto overscroll-contain border-t border-slate-200 py-3 xl:hidden">
            {navItems.map((item) => item.label === "Products" ? (
              <div key={item.href}>
                <button type="button" onClick={() => setProductsOpen((value) => !value)} aria-expanded={productsOpen} aria-controls="mobile-product-navigation" className={`flex w-full items-center justify-between py-2.5 text-left ${navClass(item.href)}`}><T>Products</T> <ChevronDown size={18} strokeWidth={2.5} aria-hidden="true" className={`shrink-0 transition-transform ${productsOpen ? "rotate-180" : ""}`} /></button>
                {productsOpen && <div id="mobile-product-navigation" className="border-l-2 border-[#00a6c7] pl-4">{productChildren.map((child) => <Link key={child.href} href={child.href} onClick={closeMobileMenu} className="block py-3 text-base font-semibold text-[#12263a]"><T>{child.label}</T></Link>)}<Link href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={closeMobileMenu} className="block py-3 text-base font-bold text-[#1268a8]"><T>All Products</T></Link></div>}
              </div>
            ) : <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onClick={closeMobileMenu} className={`block py-3 ${navClass(item.href)}`}><T>{item.label}</T></Link>)}
            <Link href="/contact#inquiry-form" onClick={closeMobileMenu} className="mt-2 inline-flex rounded-md bg-[#1479c9] px-5 py-2.5 text-sm font-bold text-white">
              <T>Talk to an engineer</T>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
