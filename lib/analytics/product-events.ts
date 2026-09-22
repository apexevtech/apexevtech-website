import { company, type Product } from "@/data/site";

export function buildProductViewParameters(product: Product) {
  return {
    item_list_name: "APEX EV charger test equipment",
    items: [
      {
        item_id: product.slug,
        item_name: product.model,
        item_brand: company.brand,
        item_category: product.category,
        item_variant: product.title,
      },
    ],
  };
}
