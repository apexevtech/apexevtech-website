import type { Language } from "./preference";

const detailPage = /^\/(?:products|resources|applications|interfaces|project-cases)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?\/?$/;
const staticPage = /^\/(?:solutions|about|contact|privacy-policy|library|engineering-cases)\/?$/;

export function getPathLanguage(path: string): Language {
  return /^\/zh(?:\/|[?#]|$)/.test(path) ? "zh" : "en";
}

export function stripLanguagePrefix(pathname: string): string {
  if (pathname === "/zh" || pathname === "/zh/") return "/";
  return pathname.startsWith("/zh/") ? pathname.slice(3) : pathname;
}

export function localizeHref(href: string, language: Language): string {
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  const suffixAt = href.search(/[?#]/);
  const pathname = suffixAt < 0 ? href : href.slice(0, suffixAt);
  const suffix = suffixAt < 0 ? "" : href.slice(suffixAt);
  const originalPath = stripLanguagePrefix(pathname);
  if (originalPath !== "/" && !detailPage.test(originalPath) && !staticPage.test(originalPath)) return href;
  const localized = language === "zh" ? originalPath === "/" ? "/zh" : `/zh${originalPath}` : originalPath;
  return `${localized}${suffix}`;
}
