import { engineeringCases } from "@/data/engineering-cases";
import { applicationExamples } from "@/data/applications";
import { applicationScenarios } from "@/data/technical-library";
import { projectBriefs } from "@/data/project-briefs";
import { getEngineeringCaseDetailHref } from "@/lib/engineering-cases/detail-path";

export function getProjectBrief(slug: string) {
  if (!getEngineeringCaseDetailHref(slug)) return undefined;
  const brief = projectBriefs.find((item) => item.caseSlug === slug);
  if (!brief) return undefined;
  const entry = engineeringCases.find((item) => item.slug === slug);
  const material = applicationScenarios.find((item) => item.id === brief.materialId);
  const application = applicationExamples.find((item) => item.slug === brief.applicationSlug);
  if (!entry?.image || !material || !application) return undefined;
  return { brief, entry, image: entry.image, material, application };
}

export function getResourceProjectBriefs(resourceSlug: string) {
  return projectBriefs.flatMap(({ caseSlug }) => {
    const reference = getProjectBrief(caseSlug);
    return reference?.entry.relatedResourceSlug === resourceSlug ? [reference] : [];
  });
}
