export const solutionLinks: Record<string, { productSlugs: string[]; resourceSlugs: string[] }> = {
  "ev-charger-manufacturing-testing": {
    productSlugs: ["ast-9000", "st-hcdc-hpc", "st-hcac-gb-ua-ea", "st-hcac-ea-ua-na"],
    resourceSlugs: ["prepare-ev-charger-standards-validation", "ev-charging-protocol-testing"],
  },
  "charger-operations-maintenance": {
    productSlugs: ["st-9980a-pro", "st-9980ea-hpc", "st-6680ca-dc", "st-6680b-plus", "st-6680ea-ac", "st-6680ua-ac", "st-6680ea-dc", "st-6680ua-dc"],
    resourceSlugs: ["field-commissioning-test-equipment", "integrated-vs-portable-test-systems"],
  },
  "production-line-testing-and-aging": {
    productSlugs: ["ast-9000", "st-hcac-gb-ua-ea", "st-hcac-ea-ua-na", "st-9980a-pro"],
    resourceSlugs: ["production-vs-laboratory-validation", "evse-test-plan-checklist"],
  },
  "pv-storage-charging-testing": {
    productSlugs: ["ast-9000"],
    resourceSlugs: ["regenerative-load-considerations", "choose-ev-charger-test-system"],
  },
};
