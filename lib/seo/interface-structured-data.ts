import type { InterfaceTopic } from "@/data/interface-topics";
import { company } from "@/data/site";

export function buildInterfaceStructuredData(topic: InterfaceTopic, baseUrl: string) {
  const url = new URL(`/interfaces/${topic.slug}`, baseUrl).toString();
  const organization = { "@type": "Organization", name: company.name, url: new URL("/", baseUrl).toString() };
  return {
    pageData: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: topic.title,
      description: topic.description,
      url,
      datePublished: topic.publishedAt,
      dateModified: topic.modifiedAt,
      publisher: organization,
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: topic.relatedProductSlugs.length,
        itemListElement: topic.relatedProductSlugs.map((slug, index) => ({ "@type": "ListItem", position: index + 1, url: new URL(`/products/${slug}`, baseUrl).toString() })),
      },
    },
    breadcrumbData: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: new URL("/", baseUrl).toString() },
        { "@type": "ListItem", position: 2, name: "Interfaces", item: new URL("/interfaces", baseUrl).toString() },
        { "@type": "ListItem", position: 3, name: topic.name, item: url },
      ],
    },
    faqData: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: topic.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })),
    },
  };
}

export function buildInterfaceIndexStructuredData(topics: InterfaceTopic[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "EV Charger Test Interface Guides",
    url: new URL("/interfaces", baseUrl).toString(),
    numberOfItems: topics.length,
    itemListElement: topics.map((topic, index) => ({ "@type": "ListItem", position: index + 1, name: topic.name, url: new URL(`/interfaces/${topic.slug}`, baseUrl).toString() })),
  };
}
