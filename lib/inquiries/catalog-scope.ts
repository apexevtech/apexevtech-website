import type { Product } from "@/data/site";
import { parseProductFilters, type ProductFilters } from "@/lib/products/filter";
import { getComparedProducts } from "@/lib/products/comparison";

const labels = {
  type: { ac: "AC chargers", dc: "DC chargers" },
  interface: { gbt: "GB/T", ccs2: "CCS2 / ISO 15118", chademo: "CHAdeMO", type1: "Type 1 / SAE J1772", type2: "Type 2 / IEC 61851", nacs: "NACS / SAE J3400" },
  workflow: { portable: "Portable testing", laboratory: "Laboratory / R&D", production: "Production / end-of-line", field: "Field commissioning" },
};

function appendFilters(params: URLSearchParams, filters: ProductFilters) {
  const safeFilters = parseProductFilters(new URLSearchParams(filters));
  for (const key of ["type", "interface", "workflow"] as const) {
    if (safeFilters[key] !== "all") params.set(key, safeFilters[key]);
  }
}

function appendCandidates(params: URLSearchParams, selectedProducts: Product[]) {
  const candidates = getComparedProducts(selectedProducts.map((product) => product.slug).join(","), selectedProducts);
  if (candidates.length) params.set("products", candidates.map((product) => product.slug).join(","));
}

export function buildCatalogInquiryHref(filters: ProductFilters, sourcePage = "/products", selectedProducts: Product[] = []) {
  const params = new URLSearchParams({ source: "equipment-finder" });
  if (/^\/(?:products|resources)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?$/.test(sourcePage)) params.set("sourcePage", sourcePage);
  appendFilters(params, filters);
  appendCandidates(params, selectedProducts);
  return `/contact?${params}#inquiry-form`;
}

export function buildComparisonInquiryHref(filters: ProductFilters, selectedProducts: Product[]) {
  const params = new URLSearchParams();
  appendFilters(params, filters);
  if (params.size) return buildCatalogInquiryHref(filters, "/products", selectedProducts);
  appendCandidates(params, selectedProducts);
  if (!params.size) return "/contact#inquiry-form";
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
