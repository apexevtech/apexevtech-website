"use client";

import { useEffect } from "react";
import { initializeAnalytics } from "@/lib/analytics/loaders";

type AnalyticsScriptsProps = { measurementId?: string; clarityProjectId?: string };

export function AnalyticsScripts({ measurementId, clarityProjectId }: AnalyticsScriptsProps) {
  useEffect(() => {
    const debugMode = new URLSearchParams(window.location.search).get("ga_debug") === "1";
    initializeAnalytics(window, document, { measurementId, clarityProjectId, debugMode });
  }, [clarityProjectId, measurementId]);

  return null;
}
