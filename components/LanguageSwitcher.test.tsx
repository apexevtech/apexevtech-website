import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { LanguageProvider, T } from "./LanguageProvider";
import { LanguageSwitcher } from "./LanguageSwitcher";

describe("language control", () => {
  it("prerenders an accessible language selector without requiring a third-party service", () => {
    const html = renderToStaticMarkup(createElement(LanguageProvider, null, createElement(LanguageSwitcher)));
    expect(html).toContain('aria-label="Website language / 网站语言"');
    expect(html).toMatch(/<option\b[^>]*value="en"[^>]*selected=""/);
    expect(html).toContain('value="zh"');
    expect(html).toContain("English");
    expect(html).toContain(">中文</option>");
    expect(html).toContain("lucide-languages");
    expect(html).not.toContain("<script");
  });

  it("keeps the default server content in English without adding layout wrappers", () => {
    expect(renderToStaticMarkup(createElement(T, null, "Home"))).toBe("Home");
    expect(renderToStaticMarkup(createElement(T, null, 42))).toBe("42");
  });
});
