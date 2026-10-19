import type { Product, ProductCapabilities } from "@/data/site";

export type ProductFilter = "all" | ProductCapabilities["chargerTypes"][number];
export type InterfaceFilter = "all" | ProductCapabilities["interfaces"][number];
export type WorkflowFilter = "all" | ProductCapabilities["workflows"][number];
export type ProductFilters = { type: ProductFilter; interface: InterfaceFilter; workflow: WorkflowFilter };

const supportedInterfaces = new Set<InterfaceFilter>(["all", "gbt", "ccs2", "chademo", "type1", "type2", "nacs"]);
const supportedWorkflows = new Set<WorkflowFilter>(["all", "portable", "laboratory", "production", "field"]);

export function parseProductFilter(value: string | null | undefined): ProductFilter {
  const normalized = value?.trim().toLowerCase();
  return normalized === "dc" || normalized === "ac" ? normalized : "all";
}

export function parseInterfaceFilter(value: string | null | undefined): InterfaceFilter {
  const normalized = value?.trim().toLowerCase() as InterfaceFilter | undefined;
  return normalized && supportedInterfaces.has(normalized) ? normalized : "all";
}

export function parseWorkflowFilter(value: string | null | undefined): WorkflowFilter {
  const normalized = value?.trim().toLowerCase() as WorkflowFilter | undefined;
  return normalized && supportedWorkflows.has(normalized) ? normalized : "all";
}

export function parseProductFilters(searchParams: URLSearchParams): ProductFilters {
  return {
    type: parseProductFilter(searchParams.get("type")),
    interface: parseInterfaceFilter(searchParams.get("interface")),
    workflow: parseWorkflowFilter(searchParams.get("workflow")),
  };
}

// Filter on reviewed capabilities, never incidental wording in descriptions or standards.
export function filterProductCatalog(products: Product[], filters: ProductFilters): Product[] {
  return products.filter(({ capabilities }) =>
    (filters.type === "all" || capabilities.chargerTypes.includes(filters.type))
    && (filters.interface === "all" || capabilities.interfaces.includes(filters.interface))
    && (filters.workflow === "all" || capabilities.workflows.includes(filters.workflow))
  );
}
