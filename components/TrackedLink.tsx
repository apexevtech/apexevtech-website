"use client";

import Link, { type LinkProps } from "next/link";
import type { AnalyticsEventName } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/events";

type TrackedLinkProps = LinkProps & {
  eventName: AnalyticsEventName;
  location: string;
  children: React.ReactNode;
  className?: string;
};

export function TrackedLink({ eventName, location, onClick, children, ...props }: TrackedLinkProps) {
  return <Link {...props} onClick={(event) => { trackEvent(eventName, { location }); onClick?.(event); }}>{children}</Link>;
}
