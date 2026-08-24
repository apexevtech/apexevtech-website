export type ProductFilter = "all" | "dc" | "ac";

export function parseProductFilter(value: string | null | undefined): ProductFilter {
  const normalized = value?.trim().toLowerCase();
  return normalized === "dc" || normalized === "ac" ? normalized : "all";
}

export function filterProducts<T extends { category: string }>(products: T[], filter: ProductFilter): T[] {
  if (filter === "all") return products;

  const marker = filter.toUpperCase();
  return products.filter((product) => product.category.toUpperCase().includes(marker));
}
