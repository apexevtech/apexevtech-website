"use client";

import { trackEvent } from "@/lib/analytics/events";

export function PrintGuideButton({ guideTitle }: { guideTitle: string }) {
  return (
    <button
      type="button"
      className="print-hide inline-flex items-center rounded-md border border-[#1479c9] bg-white px-4 py-2 text-sm font-black text-[#1268a8] hover:bg-[#eef7fd]"
      onClick={() => {
        trackEvent("guide_print", { guide_title: guideTitle });
        window.print();
      }}
    >
      Print or save as PDF
    </button>
  );
}
