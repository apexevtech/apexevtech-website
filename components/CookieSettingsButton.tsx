"use client";

export function CookieSettingsButton() {
  return (
    <button
      type="button"
      className="rounded-md border border-slate-300 px-4 py-2 text-sm font-bold text-[#385064] hover:border-[#1479c9] hover:text-[#1479c9]"
      onClick={() => window.dispatchEvent(new Event("apex-cookie-settings"))}
    >
      Review analytics choice
    </button>
  );
}
