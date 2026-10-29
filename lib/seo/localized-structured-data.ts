import type { Language } from "@/lib/i18n/preference";
import { localizedPagePaths } from "@/lib/i18n/public-pages";
import { localizeHref, stripLanguagePrefix } from "@/lib/i18n/urls";
import { siteUrl } from "./site-urls";

const textProperties = new Set(["name", "headline", "description", "text", "caption", "articleBody", "keywords", "about"]);
const urlProperties = new Set(["url", "mainEntityOfPage", "item", "@id"]);
const languageTypes = new Set(["Article", "TechArticle", "WebPage", "CollectionPage", "FAQPage", "WebSite"]);

function isOrganizationReference(value: string): boolean {
  try {
    const url = new URL(value, siteUrl);
    return url.origin === new URL(siteUrl).origin && url.pathname === "/" && !url.search && url.hash === "#organization";
  } catch {
    return false;
  }
}

function localizedUrl(value: string, language: Language): string {
  if (value.startsWith("#") || value.startsWith("?") || value.startsWith("//")) return value;
  try {
    const url = new URL(value, siteUrl);
    if (url.origin !== new URL(siteUrl).origin || !localizedPagePaths.includes(stripLanguagePrefix(url.pathname))) return value;
    const path = localizeHref(`${url.pathname}${url.search}${url.hash}`, language);
    return value.startsWith("/") ? path : new URL(path, siteUrl).toString();
  } catch {
    return value;
  }
}

export function localizeStructuredData<T>(data: T, language: Language, translate: (value: string) => string): T {
  if (language === "en") return data;
  function visit(value: unknown, property = "", preserveIdentity = false): unknown {
    if (typeof value === "string") {
      if (property === "inLanguage") return "zh-Hans";
      if (urlProperties.has(property)) return property === "@id" && (preserveIdentity || isOrganizationReference(value)) ? value : localizedUrl(value, language);
      return textProperties.has(property) ? translate(value) : value;
    }
    if (Array.isArray(value)) return value.map((item) => visit(item, property, preserveIdentity));
    if (!value || typeof value !== "object") return value;
    const record = value as Record<string, unknown>;
    const types = Array.isArray(record["@type"]) ? record["@type"] : [record["@type"]];
    const identity = types.includes("Organization");
    const localized = Object.fromEntries(Object.entries(record).map(([key, entry]) => [key, visit(entry, key, identity)]));
    if (types.some((type) => typeof type === "string" && languageTypes.has(type))) localized.inLanguage = "zh-Hans";
    return localized;
  }
  return visit(data) as T;
}
