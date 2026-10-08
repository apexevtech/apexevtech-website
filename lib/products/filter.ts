import type { Product } from "@/data/site";

export type ProductFilter = "all" | "dc" | "ac";
export type InterfaceFilter = "all" | "gbt" | "ccs2" | "chademo" | "type1" | "type2" | "nacs";
export type WorkflowFilter = "all" | "portable" | "laboratory" | "production" | "field";
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

function productSearchText(product: Product) {
  return [product.category, product.title, product.shortDescription, ...product.highlights, ...product.features, ...product.specs.flat(), ...product.applications].join(" ").toLowerCase();
}

const interfacePatterns: Record<Exclude<InterfaceFilter, "all">, RegExp> = {
  gbt: /gb\/?t|chinese|china standard/,
  ccs2: /ccs\s?2|combo\s?2|din 70121|iso 15118/,
  chademo: /chademo/,
  type1: /type\s?1|j1772|north american ac/,
  type2: /type\s?2|iec 62196-2|european ac/,
  nacs: /nacs|j3400/,
};

const workflowPatterns: Record<Exclude<WorkflowFilter, "all">, RegExp> = {
  portable: /portable|field-ready|trolley|protective case/,
  laboratory: /laborator|r&d|research|development/,
  production: /production|factory|end-of-line|aging/,
  field: /field|commissioning|maintenance|on-site|site acceptance/,
};

export function filterProductCatalog(products: Product[], filters: ProductFilters): Product[] {
  return products.filter((product) => {
    const text = productSearchText(product);
    return (filters.type === "all" || new RegExp(`\\b${filters.type}\\b`, "i").test(text))
      && (filters.interface === "all" || interfacePatterns[filters.interface].test(text))
      && (filters.workflow === "all" || workflowPatterns[filters.workflow].test(text));
  });
}

export function filterProducts<T extends { category: string }>(products: T[], filter: ProductFilter): T[] {
  if (filter === "all") return products;

  const marker = filter.toUpperCase();
  return products.filter((product) => product.category.toUpperCase().includes(marker));
}
