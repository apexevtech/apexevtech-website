import { describe, expect, it } from "vitest";
import { resources } from "@/data/resources";
import { guideBodyStrings } from "./guide-body";
import { languageStorageKey, parseLanguage } from "./preference";
import { translateText } from "./translate";
import { messages } from "./zh";

describe("site language translation", () => {
  it("defaults invalid or absent preferences to English", () => {
    expect(languageStorageKey).toBe("apex-language");
    for (const value of [null, "en", "zh-CN", "fr", "<script>"]) expect(parseLanguage(value)).toBe("en");
    expect(parseLanguage("zh")).toBe("zh");
  });

  it("preserves the original English and unknown technical identifiers", () => {
    expect(translateText("Home", "en", messages)).toBe("Home");
    for (const value of ["ST-HCDC-HPC", "ISO 15118-20", "CCS2", "1000 V / 300 A", "gu@apexps-nj.com"]) {
      expect(translateText(value, "zh", messages)).toBe(value);
    }
    expect(translateText("constructor", "zh", {})).toBe("constructor");
  });

  it("normalizes JSX whitespace without collapsing spacing around inline fragments", () => {
    expect(translateText(" Home ", "zh", messages)).toBe(" 首页 ");
    expect(translateText("\n  Quick    Links\n", "zh", messages)).toBe("\n  快捷链接\n");
    expect(translateText("   ", "zh", messages)).toBe("   ");
    expect(translateText("Project Cases", "zh", messages)).toBe("项目案例");
  });

  it("translates variable pagination labels and result counts", () => {
    expect(translateText("Page 2 of 8", "zh", messages)).toBe("第 2 页，共 8 页");
    expect(translateText("Page 3", "zh", messages)).toBe("第 3 页");
    expect(translateText("7-12 of 46 materials", "zh", messages)).toContain("46");
    expect(translateText("7-12 of 18 references matching \"CCS2\"", "zh", messages)).toContain("搜索：\"CCS2\"");
  });

  it("covers every guide paragraph, checklist and decision-table field", () => {
    const missing = resources.flatMap((resource) => guideBodyStrings(resource)
      .filter((text) => !/[\u3400-\u9fff]/.test(messages[text] ?? ""))
      .map((text) => ({ slug: resource.slug, text })));
    expect(missing).toEqual([]);
  });
});
