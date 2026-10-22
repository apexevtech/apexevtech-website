"use client";

import { createElement } from "react";
import { Download } from "lucide-react";
import { trackEvent } from "@/lib/analytics/events";
import { T } from "@/components/LanguageProvider";

type ProductDocumentDownloadProps = {
  href: string;
  model: string;
};

export function ProductDocumentDownload({ href, model }: ProductDocumentDownloadProps) {
  return createElement(
    "a",
    {
      href,
      download: "",
      className: "inline-flex min-h-11 max-w-full items-center gap-2 rounded-md border border-[#1479c9] px-5 py-3 text-sm font-semibold leading-6 text-[#1268a8] hover:bg-[#eef7fd]",
      onClick: () => trackEvent("catalog_download", { location: "product-detail", model }),
    },
    createElement(Download, { size: 18, "aria-hidden": true, className: "shrink-0" }),
    createElement("span", null, createElement(T, null, "Download original specifications (Word)")),
  );
}
