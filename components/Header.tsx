"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { company, navItems } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const productChildren = [
    { label: "DC Testers", href: "/products?type=dc" },
    { label: "AC Testers", href: "/products?type=ac" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_24px_rgba(18,38,58,0.05)] backdrop-blur">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-[76px] items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label={`${company.brand} home`}>
            <Image
              src="/assets/apex-logo.jpg"
              alt="APEX"
              width={1328}
              height={1280}
              priority
              className="h-11 w-11 rounded object-contain sm:h-12 sm:w-12"
            />
            <span className="truncate text-[15px] font-black uppercase text-[#12263a] sm:text-base">Apex Power Systems</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => item.label === "Products" ? (
              <div key={item.href} className="relative">
                <button type="button" onClick={() => setProductsOpen((value) => !value)} aria-expanded={productsOpen} className="flex items-center gap-1 text-sm font-semibold text-[#385064] transition-colors hover:text-[#1479c9]">
                  Products <span aria-hidden="true" className="text-[10px]">{productsOpen ? "▲" : "▼"}</span>
                </button>
                {productsOpen && (
                  <div className="absolute left-1/2 top-full mt-4 w-52 -translate-x-1/2 rounded-md border border-slate-200 bg-white py-2 shadow-xl shadow-slate-900/10">
                    {productChildren.map((child) => <Link key={child.href} href={child.href} onClick={() => setProductsOpen(false)} className="block px-4 py-2.5 text-sm text-[#385064] hover:bg-slate-50 hover:text-[#1479c9]">{child.label}</Link>)}
                    <Link href={item.href} onClick={() => setProductsOpen(false)} className="block border-t border-slate-100 px-4 py-2.5 text-sm font-bold text-[#1479c9]">All Products</Link>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="text-sm font-semibold text-[#385064] transition-colors hover:text-[#1479c9]">{item.label}</Link>
            ))}
          </div>

          <Link href="/contact" className="hidden rounded-md bg-[#1479c9] px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0f5f9f] md:inline-flex">
            Talk to an engineer
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-2xl text-[#12263a] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {open && (
          <div className="border-t border-slate-200 py-3 lg:hidden">
            {navItems.map((item) => item.label === "Products" ? (
              <div key={item.href}>
                <button type="button" onClick={() => setProductsOpen((value) => !value)} aria-expanded={productsOpen} className="flex w-full items-center justify-between py-2.5 text-left text-sm font-semibold text-[#385064]">Products <span aria-hidden="true">{productsOpen ? "▲" : "▼"}</span></button>
                {productsOpen && <div className="border-l-2 border-[#00a6c7] pl-4">{productChildren.map((child) => <Link key={child.href} href={child.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-slate-600">{child.label}</Link>)}<Link href={item.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-bold text-[#1479c9]">All Products</Link></div>}
              </div>
            ) : <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-semibold text-[#385064]">{item.label}</Link>)}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 inline-flex rounded-md bg-[#1479c9] px-5 py-2.5 text-sm font-bold text-white">
              Talk to an engineer
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
