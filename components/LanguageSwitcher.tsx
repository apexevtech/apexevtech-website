"use client";

import { useId, useState } from "react";
import { ChevronDown, Globe } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n/preference";

export function LanguageSwitcher() {
  const { language, setLanguage, isLoading, navigationBlocked, t } = useLanguage();
  const tooltipId = useId();
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  return <div className="group/language relative shrink-0" onPointerEnter={() => setTooltipDismissed(false)} onFocus={() => setTooltipDismissed(false)} onKeyDown={(event) => { if (event.key === "Escape") setTooltipDismissed(true); }}>
    <label className="relative flex h-11 w-[100px] items-center gap-2 rounded-md border border-[#dce5ea] bg-white pl-3 text-[#385064] transition-colors hover:border-[#8faec5] hover:bg-[#f4f8fb] focus-within:border-[#1479c9] focus-within:ring-2 focus-within:ring-[#1479c9]/15">
      <Globe size={18} strokeWidth={1.8} aria-hidden="true" className="pointer-events-none shrink-0 text-[#526b7d]" />
      <select aria-label="Website language / 网站语言" aria-describedby={tooltipId} aria-busy={isLoading} disabled={isLoading} value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="h-full w-full min-w-0 cursor-pointer appearance-none rounded-r-md border-0 bg-transparent py-2 pl-0 pr-6 text-sm font-semibold text-[#34495c] outline-none focus-visible:outline-none disabled:cursor-wait disabled:opacity-60">
        <option value="en" lang="en" aria-label="English">EN</option>
        <option value="zh" lang="zh-CN">中文</option>
      </select>
      <ChevronDown size={14} strokeWidth={2} aria-hidden="true" className="pointer-events-none absolute right-2 text-[#647b8b]" />
    </label>
    <span id={tooltipId} role="tooltip" className={`${tooltipDismissed ? "hidden" : ""} pointer-events-none invisible absolute right-0 top-full z-50 mt-2 whitespace-nowrap rounded bg-[#21394b] px-2.5 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover/language:visible group-hover/language:opacity-100 group-focus-within/language:visible group-focus-within/language:opacity-100`}>{t("Change language")}</span>
    {isLoading ? <span role="status" className="sr-only">Switching language / 正在切换语言</span> : null}
    {navigationBlocked ? <span role="alert" className="absolute right-0 top-full z-50 mt-2 w-60 rounded-md border border-amber-200 bg-white px-3 py-2 text-xs font-semibold leading-5 text-[#385064] shadow-sm">{t("Please wait for the inquiry submission to finish before switching languages.")}</span> : null}
  </div>;
}
