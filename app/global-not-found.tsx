import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Page Not Found | APEX",
  description: "The requested APEX page could not be found. Return to the English or Chinese website.",
  robots: { index: false, follow: true },
  icons: { icon: "/assets/apex-logo.webp" },
};

export default function GlobalNotFound() {
  return <html lang="en"><body className="bg-white font-sans text-[#12263a]">
    <header className="border-b border-slate-200 px-5 py-5"><div className="mx-auto flex max-w-5xl items-center gap-3"><Image src="/assets/apex-logo.webp" alt="APEX" width={48} height={47} /><span className="font-bold">APEX Power Systems</span></div></header>
    <main className="mx-auto max-w-5xl px-5 py-16">
      <h1 className="text-5xl font-bold">404</h1>
      <p className="mt-6 text-xl font-semibold">This page could not be found.</p>
      <p lang="zh-CN" className="mt-3 text-xl font-semibold">未找到该页面。</p>
      <nav aria-label="Website language" className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
        <Link href="/" prefetch={false} lang="en" className="inline-flex min-h-11 items-center py-2 font-bold text-[#1268a8] underline underline-offset-4">English home</Link>
        <Link href="/zh" prefetch={false} lang="zh-CN" className="inline-flex min-h-11 items-center py-2 font-bold text-[#1268a8] underline underline-offset-4">中文首页</Link>
      </nav>
    </main>
  </body></html>;
}
