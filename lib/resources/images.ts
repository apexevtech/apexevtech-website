import { engineeringCases } from "@/data/engineering-cases";
import type { TechnicalLibraryImage } from "@/data/technical-library";
import type { ResourceBrowserEntry } from "@/lib/resources/browser";

export const resourceBannerImage: TechnicalLibraryImage = {
  src: "/assets/engineering-cases/cases-banner.webp",
  alt: "Charging-test cabinets arranged in a laboratory",
  width: 1587,
  height: 895,
};

// Each planning document and engineering reference describe the same source case.
const scenarioCaseIds: Record<string, string> = {
  "ccs2-laboratory-scope": "case-1",
  "site-fault-diagnosis": "case-2",
  "interoperability-scope-review": "case-3",
  "european-interface-evaluation": "case-4",
  "third-party-measurement-plan": "case-5",
  "charging-power-scenario-plan": "case-6",
  "high-power-duty-review": "case-7",
  "integrated-measurement-plan": "case-8",
  "dc-charger-validation-plan": "case-9",
  "protocol-suite-planning": "case-10",
  "ac-dc-measurement-station": "case-11",
  "charging-site-inspection-plan": "case-12",
  "custom-dc-test-scope": "case-13",
  "embedded-end-of-line-planning": "case-14",
  "vehicle-interaction-session-plan": "case-15",
  "message-validation-planning": "case-16",
  "automatic-dc-production-planning": "case-17",
  "ultrafast-charging-load-planning": "case-18",
};

// Guide illustrations show related equipment, not a project installation or test result.
const guideProductSlugs: Record<string, string> = {
  "choose-ev-charger-test-system": "ast-9000",
  "ac-vs-dc-evse-testing": "st-hcac-gb-ua-ea",
  "ev-charging-protocol-testing": "st-9980ea-hpc",
  "production-vs-laboratory-validation": "ast-9000",
  "field-commissioning-test-equipment": "st-9980a-pro",
  "prepare-ev-charger-standards-validation": "st-hcac-ea-ua-na",
  "regenerative-load-considerations": "st-hcdc-hpc",
  "integrated-vs-portable-test-systems": "ast-9000",
  "evse-test-plan-checklist": "st-hcac-gb-ua-ea",
  "ccs2-dc-fast-charger-testing": "st-9980ea-hpc",
  "gbt-dc-charger-conformance-testing": "st-9980a-pro",
  "nacs-ac-evse-testing": "st-hcac-ea-ua-na",
  "type-2-ac-evse-testing": "st-6680ea-ac",
  "evse-end-of-line-testing": "ast-9000",
  "post-installation-evse-testing": "st-6680b-plus",
  "ev-charger-test-equipment-guide": "st-hcdc-hpc",
  "ev-charger-testing-guide": "st-hcac-gb-ua-ea",
  "dc-fast-charger-testing-guide": "st-hcdc-hpc",
  "iso-15118-din-70121-testing": "st-6680ea-dc",
  "iec-61851-evse-testing": "st-6680ea-ac",
  "gbt-27930-2-charger-testing": "st-6680b-plus",
  "sae-j3400-nacs-testing": "st-hcac-ea-ua-na",
};

const guideProductImages: Record<string, TechnicalLibraryImage> = {
  "ast-9000": {
    src: "/assets/products/AST-9000.webp",
    alt: "AST-9000 Multi-Standard DC EV Charger R&D Test System",
    width: 1400, height: 934,
  },
  "st-hcac-gb-ua-ea": {
    src: "/assets/products/st-hcac-gb-ua-ea.webp",
    alt: "ST-HCAC-GB / UA / EA Three-Standard AC EV Charger Comprehensive Tester",
    width: 1400, height: 933,
  },
  "st-9980ea-hpc": {
    src: "/assets/products/ST-9980EA-HPC.webp",
    alt: "ST-9980EA-HPC European DC EV Charger High-Power Comprehensive Tester",
    width: 1400, height: 933,
  },
  "st-9980a-pro": {
    src: "/assets/products/st-9980a-plus-pro.webp",
    alt: "ST-9980A+ Pro DC EV Charger Comprehensive Tester",
    width: 1400, height: 933,
  },
  "st-hcac-ea-ua-na": {
    src: "/assets/products/st-hcac-ea-ua-na.webp",
    alt: "ST-HCAC-EA / UA / NA Type 1 / Type 2 / NACS AC EV Charger Tester",
    width: 1400, height: 948,
  },
  "st-hcdc-hpc": {
    src: "/assets/products/ST-HCDC-HPC.webp",
    alt: "ST-HCDC-HPC High-Power DC EV Charger Comprehensive Tester",
    width: 1400, height: 933,
  },
  "st-6680ea-ac": {
    src: "/assets/products/ST-6680EA-AC.webp",
    alt: "ST-6680EA-AC Type 2 AC EV Charger Tester",
    width: 1400, height: 933,
  },
  "st-6680b-plus": {
    src: "/assets/products/st-6680b-plus.webp",
    alt: "ST-6680B+ GB/T AC EV Charger Comprehensive Tester",
    width: 1400, height: 933,
  },
  "st-6680ea-dc": {
    src: "/assets/products/ST-6680EA-DC.webp",
    alt: "ST-6680EA-DC CCS2 DC EV Charger Tester",
    width: 1400, height: 933,
  },
};

export function getResourceMaterialImage(entry: ResourceBrowserEntry): TechnicalLibraryImage {
  if (entry.kind === "guide") {
    const productSlug = guideProductSlugs[entry.resource.slug];
    const image = guideProductImages[productSlug];
    if (!image || !entry.resource.relatedProductSlugs.includes(productSlug)) {
      throw new Error(`Missing related equipment image for guide: ${entry.id}`);
    }
    return image;
  }

  if (entry.kind === "scenario") {
    const image = engineeringCases.find((item) => item.id === scenarioCaseIds[entry.id])?.image;
    if (!image) throw new Error(`Missing corresponding engineering case image for material: ${entry.id}`);
    return image;
  }

  if (!entry.material.source.image) throw new Error(`Missing solution brief image for material: ${entry.id}`);
  return entry.material.source.image;
}
