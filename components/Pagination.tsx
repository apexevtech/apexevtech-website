"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "@/components/LocaleLink";
import { CatalogControls } from "@/components/CatalogControls";
import { useLanguage } from "@/components/LanguageProvider";

type PaginationProps = {
  page: number;
  totalPages: number;
  hrefForPage: (page: number) => string;
};

export function Pagination({ page, totalPages, hrefForPage }: PaginationProps) {
  const { t } = useLanguage();
  if (totalPages <= 1) return null;
  const base = "flex h-11 w-11 shrink-0 items-center justify-center rounded-md border text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1479c9]";
  return <CatalogControls><nav aria-label={t("Pagination")} className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 py-6">
    {page > 1 ? <Link href={hrefForPage(page - 1)} prefetch={false} rel="prev" aria-label={t("Previous page")} title={t("Previous page")} className={`${base} border-slate-300 text-[#1268a8] hover:bg-white`}><ChevronLeft size={20} aria-hidden="true" /></Link> : <span aria-hidden="true" className={`${base} border-slate-200 text-slate-300`}><ChevronLeft size={20} /></span>}
    {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => <Link key={number} href={hrefForPage(number)} prefetch={false} aria-label={t(`Page ${number}`)} aria-current={page === number ? "page" : undefined} className={`${base} ${Math.abs(number - page) > 1 ? "hidden sm:flex" : ""} ${page === number ? "border-[#1268a8] bg-[#1268a8] text-white" : "border-slate-300 text-[#1268a8] hover:bg-white"}`}>{number}</Link>)}
    {page < totalPages ? <Link href={hrefForPage(page + 1)} prefetch={false} rel="next" aria-label={t("Next page")} title={t("Next page")} className={`${base} border-slate-300 text-[#1268a8] hover:bg-white`}><ChevronRight size={20} aria-hidden="true" /></Link> : <span aria-hidden="true" className={`${base} border-slate-200 text-slate-300`}><ChevronRight size={20} /></span>}
    <p className="w-full text-center text-xs font-normal text-[#526b7d]">{t(`Page ${page} of ${totalPages}`)}</p>
  </nav></CatalogControls>;
}
