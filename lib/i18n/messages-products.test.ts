import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { productMessages } from "@/lib/i18n/messages-products";
import { getProductComparisonDetails } from "@/lib/products/comparison";
import { getProductConfiguration } from "@/lib/products/configuration";
import { priorityProductSeo } from "@/lib/products/seo";

const t = (text: string) => productMessages[text] ?? text;

describe("product Chinese translations", () => {
  it("covers every product's main copy, features, applications and specification labels", () => {
    for (const product of products) {
      const copy = [product.category, product.title, product.shortDescription, product.overview, ...product.features, ...product.applications, ...product.specs.map(([label]) => label)];
      for (const text of copy) expect(productMessages[text], `${product.model}: ${text}`).toMatch(/[\u4e00-\u9fff]/);
    }
  });

  it("covers selection guidance and FAQs while leaving pure connector/model labels intact", () => {
    for (const seo of Object.values(priorityProductSeo)) {
      const copy = [seo.intro, seo.selection?.workflow, seo.selection?.load, seo.selection?.options, ...seo.faqs.flatMap(({ question, answer }) => [question, answer])].filter((text): text is string => Boolean(text));
      for (const text of copy) expect(productMessages[text], text).toMatch(/[\u4e00-\u9fff]/);
      for (const alternative of seo.selection?.alternatives ?? []) {
        if (!/^(CCS2|CHAdeMO):/.test(alternative.label)) expect(productMessages[alternative.label], alternative.label).toMatch(/[\u4e00-\u9fff]/);
      }
    }
  });

  it("translates compound configuration and comparison values from their source atoms", () => {
    const product = products.find(({ slug }) => slug === "st-6680ea-ac")!;
    const configuration = getProductConfiguration(product, t);
    expect(configuration.electricalRange).toContain("连接器插座: 1；AC 415 V，32 A；可选 63 A");
    expect(configuration.loadArrangement).toBe("无内置负载；外接负载最高 32 A");
    expect(configuration.options).toContain("IP67 适用于闭箱状态");
    const comparison = getProductComparisonDetails(product, t);
    expect(comparison.type).toContain("交流充电测试");
    expect(comparison.standards).toContain("连接器标准: Type 2");
    expect(comparison.applications).toContain("现场验收与检测");
    expect(getProductConfiguration(product).electricalRange).toContain("Connector Socket:");
  });

  it("preserves technical qualifications instead of treating socket and load ratings as equivalent", () => {
    expect(t("Listed external-load limits: Type 1 80 A, Type 2 63 A and NACS 80 A. The NACS socket's 200 A rating does not establish a 200 A external-load path.")).toContain("NACS 为 80 A");
    expect(t("Listed external-load limits: Type 1 80 A, Type 2 63 A and NACS 80 A. The NACS socket's 200 A rating does not establish a 200 A external-load path.")).toContain("不代表外接负载回路支持 200 A");
    expect(t("No built-in load; external load connection up to 250 A. The 0–1100 V battery simulator has a 20 mA maximum output and is not a high-power battery source. The Hall sensor range does not determine load-path current.")).toContain("最大输出 20 mA，并非大功率电池电源");
    expect(t("No built-in load; the listed external-load limit is 32 A. An optional 63 A socket does not by itself establish a 63 A load path.")).toContain("不代表整个负载回路支持 63 A");
    expect(t("Multi-channel waveform capture and Wi-Fi remote testing are optional. Specify the channels, signals and remote-operation workflow required in your configuration.")).toContain("为选配");
    expect(t("ST-HCDC-HPC")).toBe("ST-HCDC-HPC");
    expect(t("GB/T 27930.2-2024")).toBe("GB/T 27930.2-2024");
  });

  it("preserves every numerical rating and model or standard identifier in the translated copy", () => {
    const numbers = (text: string) => [...text.matchAll(/\d+(?:[.,]\d+)*/g)].map(([number]) => number).sort();
    for (const [source, translation] of Object.entries(productMessages)) expect(numbers(translation), source).toEqual(numbers(source));
  });
});
