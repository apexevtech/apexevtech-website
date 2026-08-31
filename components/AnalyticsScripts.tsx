"use client";

import { useEffect } from "react";
import { initializeAnalytics } from "@/lib/analytics/loaders";

type AnalyticsScriptsProps = { measurementId?: string; clarityProjectId?: string };

export function AnalyticsScripts({ measurementId, clarityProjectId }: AnalyticsScriptsProps) {
  useEffect(() => {
    initializeAnalytics(window, document, { measurementId, clarityProjectId });
  }, [clarityProjectId, measurementId]);

  return null;
}
