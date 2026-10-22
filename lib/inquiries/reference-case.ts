import { engineeringCases } from "@/data/engineering-cases";

export type ReferenceCaseInquiry = {
  slug: string;
  title: string;
  technicalFocus: string[];
  context: string;
  sourcePage: string;
  message: string;
};

export function readReferenceCaseInquiry(params: URLSearchParams): ReferenceCaseInquiry | null {
  const slugs = params.getAll("case");
  if (slugs.length !== 1) return null;
  const entry = engineeringCases.find((item) => item.slug === slugs[0]);
  if (!entry) return null;
  return {
    slug: entry.slug,
    title: entry.title,
    technicalFocus: entry.technicalFocus,
    context: `Reference scenario inquiry: ${entry.title}`,
    sourcePage: `/project-cases#${entry.slug}`,
    message: `I would like to discuss a configuration for a similar application.\n\nReference scenario: ${entry.title}\nTechnical focus: ${entry.technicalFocus.join("; ")}\n\nCharger connector / interface:\nVoltage and current range:\nRequired standards and test workflow:\n\nThis is a partner-published technical reference, not a verified APEX delivery record. Please review the configuration for my actual requirements.`,
  };
}

export function buildReferenceCaseInquiryHref(slug: string): string {
  const params = new URLSearchParams({ case: slug });
  return readReferenceCaseInquiry(params) ? `/contact?${params}#inquiry-form` : "/contact#inquiry-form";
}

export function isReferenceCaseInquirySourcePage(sourcePage: string): boolean {
  return engineeringCases.some((entry) => sourcePage === `/project-cases#${entry.slug}`);
}
