import type { Product } from "@/data/site";
import { getComparedProducts } from "@/lib/products/comparison";
import { readCatalogInquiryScope } from "@/lib/inquiries/catalog-scope";
import { readReferenceCaseInquiry, type ReferenceCaseInquiry } from "@/lib/inquiries/reference-case";

type PrefillOptions = {
  context: string;
  prefillProductsFromQuery: boolean;
  prefillContextFromQuery: boolean;
};

type InquiryPrefill = {
  context: string;
  productModels: string;
  message: string;
  referenceCase?: ReferenceCaseInquiry;
  sourcePage?: string;
};

export function resolveInquiryPrefill(params: URLSearchParams, options: PrefillOptions, products: Product[]): InquiryPrefill {
  const models = options.prefillProductsFromQuery
    ? getComparedProducts(params.get("products"), products).map((product) => product.model)
    : [];
  if (models.length) return {
    context: `Product comparison inquiry: ${models.join(", ")}`,
    productModels: models.join(", "),
    message: `I would like help comparing ${models.join(" and ")}.\n\nApplication / charger interface:\nVoltage and current range:\nRequired standards and tests:`,
  };

  if (options.prefillContextFromQuery) {
    const referenceCase = readReferenceCaseInquiry(params);
    if (referenceCase) return {
      context: referenceCase.context,
      productModels: "",
      message: referenceCase.message,
      referenceCase,
      sourcePage: referenceCase.sourcePage,
    };
    const scope = readCatalogInquiryScope(params);
    if (scope) return { context: "Equipment finder configuration inquiry", productModels: "", message: scope };
    const guideContext = params.get("context")?.trim().slice(0, 200);
    if (guideContext?.startsWith("Guide inquiry: ")) return {
      context: guideContext,
      productModels: "",
      message: `I would like equipment recommendations for ${guideContext.slice("Guide inquiry: ".length)}.\n\nCharger connector / interface:\nVoltage and current range:\nRequired standards and test workflow:`,
    };
  }

  return {
    context: options.context,
    productModels: options.context.startsWith("Product inquiry: ") ? options.context.slice("Product inquiry: ".length) : "",
    message: "",
  };
}

export function shouldReplaceInquiryPrefill(currentMessage: string, previousPrefill: string, userEdited = false) {
  return !userEdited && (!currentMessage || currentMessage === previousPrefill);
}
