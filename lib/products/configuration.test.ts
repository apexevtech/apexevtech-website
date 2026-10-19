import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { getProductConfiguration } from "@/lib/products/configuration";

describe("product configuration summary", () => {
  it("separates the optional Type 2 socket rating from its external-load limit", () => {
    const product = products.find((item) => item.slug === "st-6680ea-ac")!;
    const summary = getProductConfiguration(product);
    expect(summary.interface).toBe("Type 2");
    expect(summary.electricalRange).toContain("32 A; 63 A optional");
    expect(summary.loadArrangement).toContain("external load up to 32 A");
    expect(summary.electricalRange).not.toContain("Working Power");
  });

  it("preserves different NACS socket and load ratings", () => {
    const product = products.find((item) => item.slug === "st-hcac-ea-ua-na")!;
    const summary = getProductConfiguration(product);
    expect(summary.electricalRange).toContain("NACS: AC 240 V, 200 A");
    expect(summary.loadArrangement).toContain("NACS up to 80 A");
  });

  it("does not treat an AC source as AC charger coverage or battery simulation as a socket rating", () => {
    const product = products.find((item) => item.slug === "ast-9000")!;
    const summary = getProductConfiguration(product);
    expect(summary.interface).toContain("confirm exact connectors");
    expect(summary.electricalRange).toBe("Battery Voltage Simulation: DC 0-1100 V");
    expect(summary.loadArrangement).toContain("programmable AC source");
    expect(product.capabilities.chargerTypes).toEqual(["dc"]);
  });

  it("does not substitute socket count, auxiliary power or sampling range for connection ratings", () => {
    const product = products.find((item) => item.slug === "st-hcdc-hpc")!;
    const summary = getProductConfiguration(product);
    expect(summary.interface).toContain("GB/T DC");
    expect(summary.electricalRange).toContain("Battery Voltage Simulation");
    expect(summary.electricalRange).toContain("maximum output 20 mA");
    expect(summary.electricalRange).not.toContain("100-240");
    expect(summary.loadArrangement).toContain("250 A");
  });
});
