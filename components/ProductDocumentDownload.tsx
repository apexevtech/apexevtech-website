"use client";

import { createElement } from "react";
import { trackEvent } from "@/lib/analytics/events";

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
      className: "rounded-md border border-[#1479c9] px-5 py-3 font-extrabold text-[#1479c9] hover:bg-[#eef7fd]",
      onClick: () => trackEvent("catalog_download", { location: "product-detail", model }),
    },
    "Download product document",
  );
}
