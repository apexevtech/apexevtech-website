"use client";

import { useEffect, useRef } from "react";
import type { Product } from "@/data/site";
import { trackEvent } from "@/lib/analytics/events";
import { buildProductViewParameters } from "@/lib/analytics/product-events";

export function ProductViewEvent({ product }: { product: Product }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;
    trackEvent("view_item", buildProductViewParameters(product));
  }, [product]);

  return null;
}
