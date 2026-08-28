export type ResourceSection = { heading: string; paragraphs: string[]; checklist?: string[] };
export type Resource = {
  slug: string; title: string; description: string; topic: string;
  intent: "selection" | "comparison" | "technical" | "process";
  publishedAt: string; modifiedAt: string; summaryAnswer: string;
  sections: ResourceSection[]; faqs: Array<{ question: string; answer: string }>;
  relatedProductSlugs: string[]; relatedResourceSlugs: string[];
};

const shared = ["st-hcdc-hpc", "st-9980-pro-ea-ac", "st-9980-pro-ua-ac"];
const definitions: Array<[string, string, string, Resource["intent"]]> = [
  ["choose-ev-charger-test-system", "How to Choose an EV Charger Test System", "A practical framework for matching charger interfaces, standards, electrical ranges and evidence requirements to a test platform.", "selection"],
  ["ac-vs-dc-evse-testing", "AC vs DC EVSE Testing: What Changes?", "Compare the electrical interfaces, protocol workflows and field constraints that shape AC and DC charger validation.", "comparison"],
  ["ev-charging-protocol-testing", "EV Charging Protocol Testing and Signal Diagnosis", "A structured workflow for capturing charging messages, pilot signals and fault conditions during engineering diagnosis.", "technical"],
  ["production-vs-laboratory-validation", "Production-Line vs Laboratory EV Charger Validation", "Choose between repeatable end-of-line checks and deeper laboratory investigation without duplicating equipment unnecessarily.", "comparison"],
  ["field-commissioning-test-equipment", "Field Commissioning Test Equipment for EV Chargers", "Plan portable commissioning work around interoperability, metering, safety simulation and service evidence.", "selection"],
  ["prepare-ev-charger-standards-validation", "Preparing for IEC, SAE, NACS and GB/T Validation", "Organize standards coverage and test evidence before configuring an EV charger validation system.", "process"],
  ["regenerative-load-considerations", "Regenerative Load Considerations for Charger Testing", "Understand when an external or regenerative load belongs in a charger test architecture and what to specify.", "technical"],
  ["integrated-vs-portable-test-systems", "Integrated vs Portable EV Charger Test Systems", "Compare laboratory platforms and portable testers by workflow, coverage, repeatability and deployment needs.", "comparison"],
  ["evse-test-plan-checklist", "EVSE Test Plan Checklist for Engineering Teams", "A concise checklist for turning a charger validation brief into measurable test cases and recorded evidence.", "process"],
];

export const resources: Resource[] = definitions.map(([slug, title, description, intent], index) => ({
  slug, title, description, topic: "EV charging test and validation", intent,
  publishedAt: "2026-08-28", modifiedAt: "2026-08-28",
  summaryAnswer: `${description} Start with the charger connector, target market standards, voltage/current envelope and the evidence your team must retain. A suitable system then combines the required electrical, communication and safety functions without assuming that one test setup fits every workflow.`,
  sections: [
    { heading: "Start with the test boundary", paragraphs: ["Write down the charger type, connector, target market, voltage and current range, and whether the work is laboratory, production or field based. This prevents a product label from hiding a missing interface or measurement requirement."], checklist: ["Identify connector and communication interface", "List standards and fault conditions in scope", "Define evidence, export and repeatability needs"] },
    { heading: "Map the evidence workflow", paragraphs: ["A useful test system should let engineers reproduce the relevant sequence, observe status and measurements, and retain records for review. Protocol capture, waveform acquisition, metering verification and safety simulation are separate capabilities and should be requested separately."], checklist: ["Separate pass/fail checks from diagnostic captures", "Confirm software export and operator workflow", "Plan a representative acceptance test"] },
    { heading: "Configure from verified requirements", paragraphs: ["Use the final requirements to compare suitable AC or DC equipment. Ask for a technical recommendation when the current range, connector or protocol combination is unusual; configuration should follow the application rather than an assumed universal specification."] },
  ],
  faqs: [
    { question: "Can one tester cover every EV charger standard?", answer: "Coverage depends on the connector, protocol, electrical range and installed options. Confirm the exact combination with the equipment specification before ordering." },
    { question: "What should an inquiry include?", answer: "Share the charger type, connector, target standards, voltage/current range, test environment and the evidence or export format your team needs." },
  ],
  relatedProductSlugs: shared,
  relatedResourceSlugs: definitions.filter((_, relatedIndex) => relatedIndex !== index).slice(0, 3).map(([relatedSlug]) => relatedSlug),
}));
