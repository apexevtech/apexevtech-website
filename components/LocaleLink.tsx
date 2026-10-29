"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { localizeHref } from "@/lib/i18n/urls";

type LocaleLinkProps = ComponentProps<typeof NextLink>;

export default function LocaleLink({ href, ...props }: LocaleLinkProps) {
  const { language } = useLanguage();
  const localizedHref = typeof href === "string"
    ? localizeHref(href, language)
    : href.pathname && !href.protocol && !href.host && !href.hostname
      ? { ...href, pathname: localizeHref(href.pathname, language) }
      : href;

  return <NextLink {...props} href={localizedHref} />;
}
