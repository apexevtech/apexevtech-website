"use client";

import type { LinkProps } from "next/link";
import Link from "@/components/LocaleLink";
import type { AnalyticsEventName } from "@/lib/analytics/events";
import { trackEvent } from "@/lib/analytics/events";

type TrackedLinkProps = LinkProps & {
  eventName: AnalyticsEventName;
  location: string;
  children: React.ReactNode;
  className?: string;
  target?: string;
  rel?: string;
  download?: boolean;
  eventParameters?: Record<string, string>;
};

export function TrackedLink({ eventName, location, eventParameters, onClick, children, ...props }: TrackedLinkProps) {
  return <Link {...props} onClick={(event) => { trackEvent(eventName, { location, ...eventParameters }); onClick?.(event); }}>{children}</Link>;
}
