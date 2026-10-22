import type { Language } from "./preference";

export type Messages = Record<string, string>;

export function translateText(text: string, language: Language, messages: Messages): string {
  if (language === "en") return text;
  const key = text.trim().replace(/\s+/g, " ");
  if (!key) return text;
  let translated = Object.hasOwn(messages, key) ? messages[key] : undefined;
  if (!translated) {
    const results = key.match(/^(\d+(?:-\d+)?) of (\d+) (materials|references|products)(.*)$/);
    const page = key.match(/^Page (\d+)(?: of (\d+))?$/);
    if (results) {
      const unit = results[3] === "materials" ? "份资料" : results[3] === "references" ? "个案例" : "件产品";
      translated = `${results[1]} / 共 ${results[2]} ${unit}${results[4].replace(/ matching /, "，搜索：")}`;
    } else if (page) {
      translated = page[2] ? `第 ${page[1]} 页，共 ${page[2]} 页` : `第 ${page[1]} 页`;
    }
  }
  if (!translated) return text;
  return `${text.match(/^\s*/)?.[0] ?? ""}${translated}${text.match(/\s*$/)?.[0] ?? ""}`;
}
