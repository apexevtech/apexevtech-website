import type { Metadata } from "next";
import type { Language } from "@/lib/i18n/preference";
import { localizedPagePaths } from "@/lib/i18n/public-pages";
import { localizeHref, stripLanguagePrefix } from "@/lib/i18n/urls";
import { messages } from "@/lib/i18n/zh";
import { translateText } from "@/lib/i18n/translate";
import { siteUrl } from "./site-urls";

function translatedText(text: string, language: Language): string {
  if (language === "en") return text;
  const paginated = text.match(/^(.*) - Page (\d+)$/);
  const branded = text.match(/^(.*)( \| APEX)$/);
  if (branded) return `${translatedText(branded[1], language)}${branded[2]}`;
  return paginated
    ? `${translateText(paginated[1], language, messages)} - 第 ${paginated[2]} 页`
    : translateText(text, language, messages);
}

function translatedTitle(title: Metadata["title"], language: Language): Metadata["title"] {
  if (language === "en" || !title) return title;
  if (typeof title === "string") return translatedText(title, language);
  return Object.fromEntries(Object.entries(title).map(([key, value]) => [key, typeof value === "string" ? translatedText(value, language) : value])) as Metadata["title"];
}

export function localizePageMetadata(metadata: Metadata, language: Language): Metadata {
  const canonical = metadata.alternates?.canonical;
  const value = typeof canonical === "string" || canonical instanceof URL ? canonical : canonical?.url;
  let localizedPath: string | undefined;
  let languages: Record<string, string> | undefined;
  if (value) {
    const url = new URL(value.toString(), siteUrl);
    const englishPath = stripLanguagePrefix(url.pathname);
    if (url.origin === new URL(siteUrl).origin && localizedPagePaths.includes(englishPath)) {
      const path = `${englishPath}${url.search}`;
      localizedPath = localizeHref(path, language);
      languages = {
        en: new URL(path, siteUrl).toString(),
        "zh-Hans": new URL(localizeHref(path, "zh"), siteUrl).toString(),
        "x-default": new URL(path, siteUrl).toString(),
      };
    }
  }
  return {
    ...metadata,
    title: translatedTitle(metadata.title, language),
    ...(metadata.description ? { description: translatedText(metadata.description, language) } : {}),
    ...(localizedPath && languages ? { alternates: { ...metadata.alternates, canonical: localizedPath, languages } } : {}),
    ...(metadata.openGraph ? { openGraph: {
      ...metadata.openGraph,
      title: translatedTitle(metadata.openGraph.title, language) ?? undefined,
      ...(metadata.openGraph.description ? { description: translatedText(metadata.openGraph.description, language) } : {}),
      ...(localizedPath ? { url: new URL(localizedPath, siteUrl).toString() } : {}),
      ...(language === "zh" ? { locale: "zh_CN" } : {}),
    } } : {}),
    ...(metadata.twitter ? { twitter: {
      ...metadata.twitter,
      title: translatedTitle(metadata.twitter.title, language) ?? undefined,
      ...(metadata.twitter.description ? { description: translatedText(metadata.twitter.description, language) } : {}),
    } } : {}),
  };
}
