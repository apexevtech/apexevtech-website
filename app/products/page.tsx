import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCatalogSection } from "@/components/ProductCatalogSection";
import { brochureCatalog, products } from "@/data/site";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse APEX EV charger testers, EVSE analyzers, charging simulators and regenerative DC loads.",
  alternates: { canonical: "/products" },
};

const existingProductModels = new Set(products.map((product) => product.model));
const supplementalCatalog = brochureCatalog.filter((item) => !existingProductModels.has(item.model));

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="EV charger testing equipment for manufacturers, laboratories and field teams."
        description="Explore industrial AC/DC charger testers, EV charger analyzers, NACS interface testers and regenerative DC loads for charging pile validation."
      />
      <ProductCatalogSection products={products} supplementalCatalog={supplementalCatalog} />
    </>
  );
}
