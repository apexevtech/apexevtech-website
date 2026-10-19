import type { Product } from "@/data/site";
import { getProductSeo } from "@/lib/products/seo";

export function getProductConfiguration(product: Product) {
  const spec = (name: string) => product.specs.find(([label]) => label === name)?.[1];
  const electrical = ["Socket Rating", "Connector Socket", "Connector Sockets", "Battery Voltage Simulation", "Energy Acquisition Range"]
    .flatMap((name) => {
      const value = spec(name);
      return value ? [`${name}: ${value}`] : [];
    });

  return {
    interface: spec("Connector Standard") || spec("Supported Interfaces") || spec("Test Object") || "Confirm the connector configuration with APEX.",
    electricalRange: electrical.join("; ") || "Confirm connector ratings and measurement ranges for the selected configuration.",
    loadArrangement: spec("External Load") || spec("System Configuration") || "Confirm the external load, power rating and connection limits with APEX.",
    options: getProductSeo(product.slug)?.selection?.options || "Confirm optional modules, cables, software and supplied accessories with APEX.",
  };
}
