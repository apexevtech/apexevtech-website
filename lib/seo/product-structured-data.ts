import { company, type Product } from "@/data/site";

export function buildProductStructuredData(product: Product, baseUrl: string) {
  const url = new URL(`/products/${product.slug}`, baseUrl).toString();

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: `${product.model} ${product.title}`,
    model: product.model,
    description: product.shortDescription,
    category: product.category,
    image: new URL(product.image, baseUrl).toString(),
    url,
    mainEntityOfPage: url,
    brand: {
      "@type": "Brand",
      name: company.brand,
    },
    manufacturer: {
      "@type": "Organization",
      name: company.name,
      url: new URL("/", baseUrl).toString(),
    },
    additionalProperty: product.specs.map(([name, value]) => ({
      "@type": "PropertyValue",
      name,
      value,
    })),
  };
}
