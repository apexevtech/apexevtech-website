import { engineeringCases } from "@/data/engineering-cases";
import { buildPageHref, catalogPageSize } from "@/lib/navigation/pagination";

export const engineeringCaseDetailSlugs = [
  "ccs-charger-laboratory-testing",
  "vehicle-charger-field-diagnostics",
  "production-embedded-charger-testing",
] as const;

const materialCaseSlugs: Record<string, (typeof engineeringCaseDetailSlugs)[number]> = {
  "ccs2-laboratory-scope": "ccs-charger-laboratory-testing",
  "site-fault-diagnosis": "vehicle-charger-field-diagnostics",
  "embedded-end-of-line-planning": "production-embedded-charger-testing",
};

export function getEngineeringCaseMaterialDetailHref(materialId: string): string | undefined {
  return Object.hasOwn(materialCaseSlugs, materialId) ? getEngineeringCaseDetailHref(materialCaseSlugs[materialId]) : undefined;
}

export function getEngineeringCaseDetailHref(slug: string): string | undefined {
  return engineeringCaseDetailSlugs.some((candidate) => candidate === slug) ? `/project-cases/${slug}` : undefined;
}

export function getEngineeringCaseIndexHref(slug: string): string {
  const index = engineeringCases.findIndex((entry) => entry.slug === slug);
  if (index < 0) return "/project-cases";
  return buildPageHref("/project-cases", new URLSearchParams(), Math.floor(index / catalogPageSize) + 1, slug);
}
