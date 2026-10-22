import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { engineeringCases } from "@/data/engineering-cases";
import { messages } from "@/lib/i18n/zh";
import { translateText } from "@/lib/i18n/translate";
import { resolveInquiryPrefill, shouldReplaceInquiryPrefill } from "./prefill";

const options = { context: "Website contact page", prefillProductsFromQuery: true, prefillContextFromQuery: true };
const resolve = (query: string) => resolveInquiryPrefill(new URLSearchParams(query), options, products);

describe("inquiry URL prefill", () => {
  it("gives valid compared products precedence over other query contexts", () => {
    const result = resolve("products=ast-9000&context=Guide+inquiry:+AC+testing&source=equipment-finder&type=ac");
    expect(result.context).toBe("Product comparison inquiry: AST-9000");
    expect(result.productModels).toBe("AST-9000");
    expect(result.message).toContain("comparing AST-9000");
  });

  it("clears old product context when switching to a guide or generic inquiry", () => {
    expect(resolve("context=Guide+inquiry:+AC+testing")).toMatchObject({ context: "Guide inquiry: AC testing", productModels: "" });
    expect(resolve("")).toEqual({ context: "Website contact page", productModels: "", message: "" });
  });

  it("uses supported catalog scope when compared slugs are invalid", () => {
    const result = resolve("products=unknown&source=equipment-finder&type=dc&workflow=field");
    expect(result.context).toBe("Equipment finder configuration inquiry");
    expect(result.message).toContain("Charger type: DC chargers");
    expect(result.message).toContain("Field commissioning");
  });

  it("ignores query data on forms without query prefill enabled", () => {
    expect(resolveInquiryPrefill(new URLSearchParams("products=ast-9000&context=Guide+inquiry:+AC"), { context: "Product inquiry: ST-HCDC-HPC", prefillProductsFromQuery: false, prefillContextFromQuery: false }, products)).toEqual({ context: "Product inquiry: ST-HCDC-HPC", productModels: "ST-HCDC-HPC", message: "" });
  });

  it("updates automatic drafts while preserving typed requirements", () => {
    expect(shouldReplaceInquiryPrefill("", "old draft")).toBe(true);
    expect(shouldReplaceInquiryPrefill("old draft", "old draft")).toBe(true);
    expect(shouldReplaceInquiryPrefill("My charger needs 1000 V", "old draft")).toBe(false);
    expect(shouldReplaceInquiryPrefill("old draft\nMy additional requirement", "old draft")).toBe(false);
    expect(shouldReplaceInquiryPrefill("", "old draft", true)).toBe(false);
    expect(shouldReplaceInquiryPrefill("old draft", "old draft", true)).toBe(false);
  });

  it("resolves a reference scenario from the whitelist and keeps its source and context stable", () => {
    const entry = engineeringCases[0];
    const result = resolve(`case=${entry.slug}&context=Fake+project&sourcePage=https://example.com`);
    expect(result.context).toBe(`Reference scenario inquiry: ${entry.title}`);
    expect(result.sourcePage).toBe(`/project-cases#${entry.slug}`);
    expect(result.referenceCase?.title).toBe(entry.title);
    expect(result.productModels).toBe("");
    expect(result.message).not.toMatch(/Fake project|example\.com/);
    expect(resolve("case=unknown&context=Fake+project")).toEqual({ context: "Website contact page", productModels: "", message: "" });
    expect(resolveInquiryPrefill(new URLSearchParams(`case=${entry.slug}`), { ...options, prefillContextFromQuery: false }, products)).toEqual({ context: "Website contact page", productModels: "", message: "" });
  });

  it("does not interfere with valid comparison or equipment-finder inquiry flows", () => {
    expect(resolve(`case=${engineeringCases[0].slug}&products=ast-9000`).context).toBe("Product comparison inquiry: AST-9000");
    expect(resolve("case=unknown&source=equipment-finder&type=dc").context).toBe("Equipment finder configuration inquiry");
  });

  it("translates scenario explanations without changing the message or attribution or replacing user edits", () => {
    const query = `case=${engineeringCases[0].slug}`;
    const english = resolve(query);
    const chinese = resolve(query);
    expect(translateText("Reference scenario:", "en", messages)).toBe("Reference scenario:");
    expect(translateText("Reference scenario:", "zh", messages)).toBe("参考场景：");
    expect(translateText(english.referenceCase!.title, "zh", messages)).toBe("CCS 充电设备实验室测试");
    expect(translateText("Partner-published technical reference, not a verified APEX delivery record. Your configuration requires engineering review.", "zh", messages)).toContain("并非经核验的 APEX 交付记录");
    expect(chinese).toEqual(english);
    expect(shouldReplaceInquiryPrefill("我的充电桩需要 1000 V / 300 A", english.message)).toBe(false);
    expect(shouldReplaceInquiryPrefill("", english.message, true)).toBe(false);
    expect(shouldReplaceInquiryPrefill(english.message, english.message)).toBe(true);
  });
});
