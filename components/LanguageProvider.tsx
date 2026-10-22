"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { languageStorageKey, parseLanguage, type Language } from "@/lib/i18n/preference";
import { translateText, type Messages } from "@/lib/i18n/translate";

const languageEvent = "apex-language-change";
let memoryLanguage: Language = "en";
let memoryOnly = false;
const english = (text: string) => text;
const LanguageContext = createContext({ language: "en" as Language, t: english, setLanguage: (_language: Language) => {}, isLoading: false, error: false });

function subscribe(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === languageStorageKey || event.key === null) {
      memoryLanguage = parseLanguage(event.newValue);
      memoryOnly = false;
      onChange();
    }
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(languageEvent, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(languageEvent, onChange);
  };
}

function getSnapshot(): Language {
  if (memoryOnly) return memoryLanguage;
  try {
    const saved = window.localStorage.getItem(languageStorageKey);
    return saved === null ? memoryLanguage : parseLanguage(saved);
  } catch {
    return memoryLanguage;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribe, getSnapshot, () => "en" as Language);
  const [messages, setMessages] = useState<Messages | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (language !== "zh" || messages) return;
    let active = true;
    import("@/lib/i18n/zh").then((dictionary) => {
      if (active) { setMessages(dictionary.messages); setError(false); }
    }).catch(() => { if (active) setError(true); });
    return () => { active = false; };
  }, [language, messages, attempt]);

  useEffect(() => {
    document.documentElement.lang = language === "zh" && messages ? "zh-CN" : "en";
  }, [language, messages]);

  const setLanguage = useCallback((next: Language) => {
    memoryLanguage = next;
    try {
      window.localStorage.setItem(languageStorageKey, next);
      memoryOnly = false;
    } catch {
      memoryOnly = true;
    }
    window.dispatchEvent(new Event(languageEvent));
    setError(false);
    setAttempt((current) => current + 1);
  }, []);
  const t = useCallback((text: string) => translateText(text, language, messages ?? {}), [language, messages]);
  const value = useMemo(() => ({ language, t, setLanguage, isLoading: language === "zh" && !messages && !error, error }), [language, t, setLanguage, messages, error]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}

export function T({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  return typeof children === "string" ? t(children) : children;
}
