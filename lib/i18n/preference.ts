export type Language = "en" | "zh";
export const languageStorageKey = "apex-language";

export function parseLanguage(value: string | null): Language {
  return value === "zh" ? "zh" : "en";
}
