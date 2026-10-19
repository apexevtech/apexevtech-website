import { parseProductFilters, type ProductFilters } from "@/lib/products/filter";

const labels = {
  type: { ac: "AC chargers", dc: "DC chargers" },
  interface: { gbt: "GB/T", ccs2: "CCS2 / ISO 15118", chademo: "CHAdeMO", type1: "Type 1 / SAE J1772", type2: "Type 2 / IEC 61851", nacs: "NACS / SAE J3400" },
  workflow: { portable: "Portable testing", laboratory: "Laboratory / R&D", production: "Production / end-of-line", field: "Field commissioning" },
};

export function buildCatalogInquiryHref(filters: ProductFilters, sourcePage = "/products") {
  const params = new URLSearchParams({ source: "equipment-finder" });
  if (sourcePage) params.set("sourcePage", sourcePage);
  for (const [key, value] of Object.entries(filters)) {
    if (value !== "all") params.set(key, value);
  }
  return `/contact?${params}#inquiry-form`;
}

export function readCatalogInquiryScope(params: URLSearchParams): string | null {
  const configuration = readCatalogInquiryConfiguration(params);
  return configuration ? `I would like equipment recommendations for these requirements.\n\n${configuration}\nVoltage / current range:\nRequired tests:` : null;
}

export function readCatalogInquiryConfiguration(params: URLSearchParams): string | null {
  if (params.get("source") !== "equipment-finder") return null;
  const filters = parseProductFilters(params);
  const rows = [
    filters.type !== "all" ? `Charger type: ${labels.type[filters.type]}` : "",
    filters.interface !== "all" ? `Charger connector / interface: ${labels.interface[filters.interface]}` : "",
    filters.workflow !== "all" ? `Test workflow: ${labels.workflow[filters.workflow]}` : "",
  ].filter(Boolean);
  return rows.length ? rows.join("\n") : null;
}
