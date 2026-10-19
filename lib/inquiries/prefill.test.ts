import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
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
  });
});
