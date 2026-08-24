"use client";

import { useEffect, useState } from "react";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const STORAGE_KEY = "apex-analytics-consent";
type Consent = "accepted" | "declined" | "unknown";

export function CookieConsent() {
  const measurementId = process.env.NEXT_PUBLIC_GA_ID;
  const [consent, setConsent] = useState<Consent>("unknown");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "accepted" || saved === "declined") setConsent(saved);
    } catch {
      setConsent("declined");
    }

    const openSettings = () => setConsent("unknown");
    window.addEventListener("apex-cookie-settings", openSettings);
    return () => window.removeEventListener("apex-cookie-settings", openSettings);
  }, []);

  if (!measurementId) return null;

  function choose(value: Exclude<Consent, "unknown">) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // A blocked storage implementation should behave like a declined choice.
      value = "declined";
    }
    setConsent(value);
  }

  return (
    <>
      {consent === "accepted" ? <GoogleAnalytics measurementId={measurementId} /> : null}
      {consent === "unknown" ? (
        <aside className="fixed bottom-4 left-4 right-4 z-[60] rounded-md border border-slate-200 bg-white p-4 shadow-[0_14px_40px_rgba(18,38,58,0.18)] sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md" role="dialog" aria-label="Cookie preferences">
          <p className="text-sm leading-6 text-[#385064]">We use optional analytics to understand website visits and improve the experience. You can continue without analytics.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => choose("accepted")} className="rounded-md bg-[#1479c9] px-4 py-2 text-sm font-extrabold text-white hover:bg-[#0f5f9f]">Accept analytics</button>
            <button type="button" onClick={() => choose("declined")} className="rounded-md border border-slate-300 px-4 py-2 text-sm font-extrabold text-[#385064] hover:border-[#1479c9]">Continue without analytics</button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
