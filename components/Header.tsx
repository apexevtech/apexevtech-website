"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { company, navItems } from "@/data/site";

export function Header() {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const productChildren = [
    { label: "DC Testers", href: "/products" },
    { label: "AC Testers", href: "/products" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex min-w-0 items-center gap-2" aria-label={`${company.brand} home`}>
            <Image
              src="/assets/apex-logo.jpg"
              alt="APEX"
              width={1328}
              height={1280}
              priority
              className="h-14 w-14 rounded object-contain"
            />
            <span className="truncate text-lg font-bold text-[#1a2332] sm:text-xl">Apex EV Charger Testers</span>
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => item.label === "Products" ? (
              <div key={item.href} className="relative">
                <button type="button" onClick={() => setProductsOpen((value) => !value)} aria-expanded={productsOpen} className="flex items-center gap-1 text-sm font-medium text-[#1a2332] transition-colors hover:text-[#f58220]">
                  Products <span aria-hidden="true" className="text-xs">{productsOpen ? "▲" : "▼"}</span>
                </button>
                {productsOpen && (
                  <div className="absolute left-1/2 top-full mt-3 w-48 -translate-x-1/2 rounded-md border border-gray-100 bg-white py-2 shadow-lg">
                    {productChildren.map((child) => <Link key={child.href} href={child.href} onClick={() => setProductsOpen(false)} className="block px-4 py-2 text-sm text-[#1a2332] hover:bg-gray-50 hover:text-[#f58220]">{child.label}</Link>)}
                    <Link href={item.href} onClick={() => setProductsOpen(false)} className="block border-t border-gray-100 px-4 py-2 text-sm font-semibold text-[#f58220]">All Products</Link>
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href} className="text-sm font-medium text-[#1a2332] transition-colors hover:text-[#f58220]">{item.label}</Link>
            ))}
          </div>

          <Link href="/contact" className="hidden rounded-md bg-[#f58220] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#d96f10] md:inline-flex">
            Start Project
          </Link>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center text-2xl text-[#1a2332] lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "×" : "☰"}
          </button>
        </div>

        {open && (
          <div className="border-t border-gray-100 py-3 lg:hidden">
            {navItems.map((item) => item.label === "Products" ? (
              <div key={item.href}>
                <button type="button" onClick={() => setProductsOpen((value) => !value)} aria-expanded={productsOpen} className="flex w-full items-center justify-between py-2.5 text-left text-sm font-medium text-[#1a2332]">Products <span aria-hidden="true">{productsOpen ? "▲" : "▼"}</span></button>
                {productsOpen && <div className="border-l-2 border-[#f58220] pl-4">{productChildren.map((child) => <Link key={child.href} href={child.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-gray-600">{child.label}</Link>)}<Link href={item.href} onClick={() => setOpen(false)} className="block py-2 text-sm font-semibold text-[#f58220]">All Products</Link></div>}
              </div>
            ) : <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-medium text-[#1a2332]">{item.label}</Link>)}
            <Link href="/contact" onClick={() => setOpen(false)} className="mt-2 inline-flex rounded-md bg-[#f58220] px-5 py-2.5 text-sm font-semibold text-white">
              Start Project
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
