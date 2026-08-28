"use client";

import { useEffect } from "react";
import { captureAttribution, parseUtm } from "@/lib/attribution/utm";

export function AttributionCapture() {
  useEffect(() => {
    captureAttribution(parseUtm(new URLSearchParams(window.location.search)));
  }, []);
  return null;
}
