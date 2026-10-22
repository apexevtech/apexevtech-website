"use client";

import { Languages } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { Language } from "@/lib/i18n/preference";

export function LanguageSwitcher() {
  const { language, setLanguage, isLoading, error } = useLanguage();
  return <div className="relative shrink-0">
    <label className="flex min-h-11 items-center gap-1 text-[#385064]" title="Change language / 切换语言">
      <Languages size={18} strokeWidth={2} aria-hidden="true" className="shrink-0" />
      <select aria-label="Website language / 网站语言" aria-busy={isLoading} value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="min-h-11 w-[78px] cursor-pointer border-0 bg-transparent py-2 pl-1 pr-3 text-sm font-bold outline-offset-2 focus-visible:outline-[#1479c9] sm:w-[88px]">
        <option value="en" lang="en">English</option>
        <option value="zh" lang="zh-CN">中文</option>
      </select>
    </label>
    {isLoading ? <span role="status" className="sr-only">Switching language / 正在切换语言</span> : null}
    {error ? <button type="button" onClick={() => setLanguage(language)} className="absolute right-0 top-full z-50 w-40 rounded border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 shadow-sm">重试 / Retry translation</button> : null}
  </div>;
}
