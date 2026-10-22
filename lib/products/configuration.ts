import type { Product } from "@/data/site";
import { getProductSeo } from "@/lib/products/seo";

export function getProductConfiguration(product: Product, translate: (text: string) => string = (text) => text) {
  const spec = (name: string) => product.specs.find(([label]) => label === name)?.[1];
  const electrical = ["Socket Rating", "Connector Socket", "Connector Sockets", "Battery Voltage Simulation", "Energy Acquisition Range"]
    .flatMap((name) => {
      const value = spec(name);
      return value ? [`${translate(name)}: ${translate(value)}`] : [];
    });

  return {
    interface: translate(spec("Connector Standard") || spec("Supported Interfaces") || spec("Test Object") || "Confirm the connector configuration with APEX."),
    electricalRange: electrical.join("; ") || translate("Confirm connector ratings and measurement ranges for the selected configuration."),
    loadArrangement: translate(spec("External Load") || spec("System Configuration") || "Confirm the external load, power rating and connection limits with APEX."),
    options: translate(getProductSeo(product.slug)?.selection?.options || "Confirm optional modules, cables, software and supplied accessories with APEX."),
  };
}
