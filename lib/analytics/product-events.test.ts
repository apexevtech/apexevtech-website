import { describe, expect, it } from "vitest";
import { products } from "@/data/site";
import { buildProductViewParameters } from "@/lib/analytics/product-events";

describe("product analytics events", () => {
  it("builds a GA4 view_item payload without prices or personal data", () => {
    const product = products[0];
    expect(buildProductViewParameters(product)).toEqual({
      item_list_name: "APEX EV charger test equipment",
      items: [{
        item_id: product.slug,
        item_name: product.model,
        item_brand: "APEX",
        item_category: product.category,
        item_variant: product.title,
      }],
    });
  });
});
