"use client";

import { useEffect, useState } from "react";
import { AnalyticsScripts } from "@/components/AnalyticsScripts";
import { T, useLanguage } from "@/components/LanguageProvider";
import { applyAnalyticsConsent, chooseAnalyticsConsent, readAnalyticsConsent, syncAnalyticsConsentStorage, type AnalyticsConsent } from "@/lib/analytics/consent";
import { readAnalyticsTrafficClass } from "@/lib/analytics/traffic-class";

export function CookieConsent() {
  const { t } = useLanguage();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || process.env.NEXT_PUBLIC_GA_ID;
  const clarityProjectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
  const [consent, setConsent] = useState<AnalyticsConsent>("unknown");

  useEffect(() => {
    readAnalyticsTrafficClass(window);
    applyAnalyticsConsent(window, readAnalyticsConsent(window), measurementId);
    const frame = window.requestAnimationFrame(() => setConsent(readAnalyticsConsent(window)));

    const openSettings = () => {
      applyAnalyticsConsent(window, "unknown", measurementId);
      setConsent("unknown");
    };
    const syncStorage = (event: StorageEvent) => {
      try {
        if (event.storageArea && event.storageArea !== window.localStorage) return;
      } catch {
        applyAnalyticsConsent(window, "declined", measurementId);
        setConsent("declined");
        return;
      }
      const next = syncAnalyticsConsentStorage(window, event.key, event.newValue, measurementId);
      if (next) setConsent(next);
    };
    window.addEventListener("apex-cookie-settings", openSettings);
    window.addEventListener("storage", syncStorage);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("apex-cookie-settings", openSettings);
      window.removeEventListener("storage", syncStorage);
    };
  }, [measurementId]);

  if (!measurementId) return null;

  function choose(value: Exclude<AnalyticsConsent, "unknown">) {
    setConsent(chooseAnalyticsConsent(window, value, measurementId));
  }

  return (
    <>
      {consent === "accepted" ? <AnalyticsScripts measurementId={measurementId} clarityProjectId={clarityProjectId} /> : null}
      {consent === "unknown" ? (
        <div data-cookie-preferences="true" className="fixed bottom-4 left-4 right-4 z-[60] rounded-md border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(18,38,58,0.18)] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md" role="dialog" aria-label={t("Cookie preferences")}>
          <p className="text-sm leading-6 text-[#385064]"><T>We use optional analytics to understand website visits and improve the experience. You can continue without analytics.</T></p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => choose("accepted")} className="rounded-md bg-[#1479c9] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#0f5f9f]"><T>Accept analytics</T></button>
            <button type="button" onClick={() => choose("declined")} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-extrabold text-[#385064] hover:border-[#1479c9]"><T>Continue without analytics</T></button>
          </div>
        </div>
      ) : null}
    </>
  );
}
