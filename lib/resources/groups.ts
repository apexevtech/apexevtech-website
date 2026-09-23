import { getResource, resources, type Resource } from "@/lib/resources/catalog";

type ResourceGroupDefinition = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  slugs: string[];
};

export type ResourceGroup = Omit<ResourceGroupDefinition, "slugs"> & {
  resources: Resource[];
};

const groupDefinitions: ResourceGroupDefinition[] = [
  {
    id: "interfaces-standards",
    eyebrow: "Interfaces & standards",
    title: "Plan testing for the target charging interface",
    description: "Define connector, protocol revision and evidence for CCS2, GB/T, NACS and Type 2 charger testing.",
    slugs: [
      "dc-fast-charger-testing-guide",
      "ccs2-dc-fast-charger-testing",
      "gbt-dc-charger-conformance-testing",
      "nacs-ac-evse-testing",
      "type-2-ac-evse-testing",
      "ev-charging-protocol-testing",
      "prepare-ev-charger-standards-validation",
    ],
  },
  {
    id: "system-selection",
    eyebrow: "System selection",
    title: "Choose the test architecture and power path",
    description: "Compare AC and DC workflows, equipment configurations and external or regenerative load requirements.",
    slugs: [
      "ev-charger-testing-guide",
      "choose-ev-charger-test-system",
      "ac-vs-dc-evse-testing",
      "regenerative-load-considerations",
    ],
  },
  {
    id: "laboratory-production",
    eyebrow: "Laboratory & production",
    title: "Build repeatable validation and end-of-line workflows",
    description: "Separate engineering diagnosis from production decisions while preserving repeatability, cycle time and traceability.",
    slugs: [
      "production-vs-laboratory-validation",
      "integrated-vs-portable-test-systems",
      "evse-end-of-line-testing",
    ],
  },
  {
    id: "field-commissioning",
    eyebrow: "Field & commissioning",
    title: "Test installed chargers and retain useful site evidence",
    description: "Prepare commissioning, maintenance and post-installation checks with a clear scope, safe setup and reviewable record.",
    slugs: [
      "field-commissioning-test-equipment",
      "post-installation-evse-testing",
      "evse-test-plan-checklist",
    ],
  },
];

export const resourceGroups: ResourceGroup[] = groupDefinitions.map(({ slugs, ...group }) => ({
  ...group,
  resources: slugs.map((slug) => {
    const resource = getResource(slug);
    if (!resource) throw new Error(`Unknown resource in group ${group.id}: ${slug}`);
    return resource;
  }),
}));

export function getUngroupedResources() {
  const groupedSlugs = new Set(resourceGroups.flatMap((group) => group.resources.map((resource) => resource.slug)));
  return resources.filter((resource) => !groupedSlugs.has(resource.slug));
}
