"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Language } from "@/lib/i18n/preference";
import { translateText, type Messages } from "@/lib/i18n/translate";
import { requestLanguageNavigation } from "@/lib/i18n/language-navigation";

const english = (text: string) => text;
const emptyMessages: Messages = {};
const LanguageContext = createContext({ language: "en" as Language, t: english, setLanguage: (_language: Language) => {}, isLoading: false, error: false, navigationBlocked: false });

type LanguageProviderProps = { children: ReactNode; initialLanguage?: Language; initialMessages?: Messages };

export function LanguageProvider({ children, initialLanguage: language = "en", initialMessages: messages = emptyMessages }: LanguageProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [navigationBlocked, setNavigationBlocked] = useState(false);
  useEffect(() => {
    const restoreNavigation = () => { setIsLoading(false); setNavigationBlocked(false); };
    window.addEventListener("pageshow", restoreNavigation);
    return () => window.removeEventListener("pageshow", restoreNavigation);
  }, []);
  useEffect(() => {
    if (!navigationBlocked) return;
    const forms = Array.from(document.querySelectorAll<HTMLElement>("form[data-inquiry-pending]"));
    const clearFinishedNotice = () => { if (forms.every((form) => form.dataset.inquiryPending !== "true")) setNavigationBlocked(false); };
    const observer = new MutationObserver(clearFinishedNotice);
    forms.forEach((form) => observer.observe(form, { attributes: true, attributeFilter: ["data-inquiry-pending"] }));
    const timer = window.setTimeout(clearFinishedNotice, 0);
    return () => { observer.disconnect(); window.clearTimeout(timer); };
  }, [navigationBlocked]);
  const t = useCallback((text: string) => translateText(text, language, messages), [language, messages]);
  const setLanguage = useCallback((next: Language) => {
    const forms = Array.from(document.querySelectorAll<HTMLElement>("form[data-inquiry-dirty]"));
    const uncertain = forms.some((form) => form.dataset.inquiryUncertain === "true");
    const result = requestLanguageNavigation({
      currentLanguage: language, nextLanguage: next,
      href: window.location.pathname + window.location.search + window.location.hash,
      dirty: forms.some((form) => form.dataset.inquiryDirty === "true"),
      pending: forms.some((form) => form.dataset.inquiryPending === "true"),
      uncertain,
      confirmNavigation: () => window.confirm(t(uncertain
        ? "Delivery has not been confirmed. Check whether your inquiry was received before sending again. Switching language reloads this page and clears the entries and warning. Continue?"
        : "Switching language reloads this page. Unsaved changes will be lost. Continue?")),
      navigate: (href) => { setIsLoading(true); window.location.assign(href); },
    });
    setNavigationBlocked(result === "blocked");
  }, [language, t]);
  const value = useMemo(() => ({ language, t, setLanguage, isLoading, error: false, navigationBlocked }), [language, t, setLanguage, isLoading, navigationBlocked]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function T({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return typeof children === "string" ? t(children) : children;
}
