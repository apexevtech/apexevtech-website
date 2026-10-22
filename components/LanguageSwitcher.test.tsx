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
    expect(html).toContain('aria-label="English"');
    expect(html).toContain(">EN</option>");
    expect(html).toContain(">中文</option>");
    expect(html).toContain("lucide-globe");
    expect(html).toContain("lucide-chevron-down");
    expect(html).toContain('role="tooltip"');
    expect(html).toContain("Change language</span>");
    expect(html).toContain("w-[100px]");
    expect(html).not.toContain("title=");
    expect(html).not.toContain("Change language / 切换语言");
    expect(html).not.toContain("<script");
  });

  it("keeps the default server content in English without adding layout wrappers", () => {
    expect(renderToStaticMarkup(createElement(T, null, "Home"))).toBe("Home");
    expect(renderToStaticMarkup(createElement(T, null, 42))).toBe("42");
  });
});
