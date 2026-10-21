export type EngineeringCaseCategoryId =
  | "vehicle-engineering"
  | "independent-testing"
  | "public-inspection"
  | "charger-manufacturing";

export type EngineeringCase = {
  id: string;
  slug: string;
  categoryId: EngineeringCaseCategoryId;
  title: string;
  summary: string;
  technicalFocus: string[];
  image?: { src: string; alt: string; width: number; height: number };
  relatedResourceSlug: string;
};

export const engineeringCaseCategories: {
  id: EngineeringCaseCategoryId;
  label: string;
}[] = [
  { id: "vehicle-engineering", label: "Vehicle Engineering" },
  { id: "independent-testing", label: "Independent Testing" },
  { id: "public-inspection", label: "Public Inspection" },
  { id: "charger-manufacturing", label: "Charger Manufacturing" },
];

export const engineeringCases: EngineeringCase[] = [
  {
    id: "case-1",
    slug: "ccs-charger-laboratory-testing",
    categoryId: "charger-manufacturing",
    title: "CCS Charger Laboratory Testing",
    summary: "This reference application describes laboratory testing of CCS charging equipment under simulated operating conditions, focusing on supply behavior, charging output, communication and protective functions.",
    technicalFocus: ["Supply and charging output", "Communication behavior", "Protective functions"],
    image: {
      src: "/assets/library/case-1-system.png",
      alt: "Multiple charging-test cabinets",
      width: 865,
      height: 548,
    },
    relatedResourceSlug: "ccs2-dc-fast-charger-testing",
  },
  {
    id: "case-2",
    slug: "vehicle-charger-field-diagnostics",
    categoryId: "public-inspection",
    title: "Vehicle-Charger Field Diagnostics",
    summary: "This field-diagnostic reference describes collecting charging information for fault analysis and maintenance alerts, with an emphasis on observing vehicle-charger interactions and supporting investigation of charging-site symptoms.",
    technicalFocus: ["Charging-data collection", "Fault analysis", "Maintenance alerts"],
    image: {
      src: "/assets/engineering-cases/case-2-portable-system.webp",
      alt: "Portable charging diagnostic instrument connected to stacked test loads in a laboratory",
      width: 1000,
      height: 625,
    },
    relatedResourceSlug: "field-commissioning-test-equipment",
  },
  {
    id: "case-3",
    slug: "simulated-charging-interoperability-testing",
    categoryId: "public-inspection",
    title: "Simulated Charging Interoperability Testing",
    summary: "This interoperability reference describes simulated charging-facility behavior for examining vehicle communication and data exchange, focusing on interaction between the vehicle-side implementation and charging equipment during compatibility checks.",
    technicalFocus: ["Charging-facility simulation", "Vehicle communication", "Compatibility checks"],
    relatedResourceSlug: "ev-charging-protocol-testing",
  },
  {
    id: "case-4",
    slug: "european-interface-charger-assessment",
    categoryId: "independent-testing",
    title: "European-Interface Charger Assessment",
    summary: "This research-institute reference describes European-standard charger evaluation, grouping the technical discussion into electrical safety, basic charging operation and compatibility between charging equipment and the connected vehicle.",
    technicalFocus: ["Electrical safety", "Charging operation", "Interface compatibility"],
    relatedResourceSlug: "prepare-ev-charger-standards-validation",
  },
  {
    id: "case-5",
    slug: "research-institute-charger-instrumentation",
    categoryId: "independent-testing",
    title: "Research-Institute Charger Instrumentation",
    summary: "This research-institute reference associates an unnamed organization with charger test instrumentation. No readable project narrative accompanies the title, leaving the specific testing application and configuration unspecified.",
    technicalFocus: ["Charger test instrumentation", "Research-institute context"],
    image: {
      src: "/assets/engineering-cases/case-5-laboratory-system.webp",
      alt: "Portable EV charging test instrument beside laboratory test cabinets",
      width: 1920,
      height: 1200,
    },
    relatedResourceSlug: "evse-test-plan-checklist",
  },
  {
    id: "case-6",
    slug: "charging-demand-power-simulation",
    categoryId: "independent-testing",
    title: "Charging Demand and Power Simulation",
    summary: "This power-research reference focuses on modeling charging demand and energy consumption. The technical discussion connects simulation with equipment layout, charging schedules and the planning of charging-facility power requirements.",
    technicalFocus: ["Charging-demand modeling", "Energy-consumption simulation", "Layout and scheduling"],
    relatedResourceSlug: "regenerative-load-considerations",
  },
  {
    id: "case-7",
    slug: "dc-supercharging-field-inspection",
    categoryId: "independent-testing",
    title: "DC Supercharging Field Inspection",
    summary: "This third-party inspection reference describes simulated vehicle behavior for field checks of off-board DC chargers. Its historical standards references provide context for the described application, not current conformity coverage.",
    technicalFocus: ["Vehicle-behavior simulation", "Off-board DC charging", "Field inspection"],
    relatedResourceSlug: "dc-fast-charger-testing-guide",
  },
  {
    id: "case-8",
    slug: "inspection-sector-charger-instrumentation",
    categoryId: "independent-testing",
    title: "Inspection-Sector Charger Instrumentation",
    summary: "This inspection-sector reference introduces charger test instrumentation within an independent-assessment context. The published description is brief, so no completed testing outcome is inferred beyond the instrumentation topic.",
    technicalFocus: ["Charger test instrumentation", "Independent assessment context"],
    relatedResourceSlug: "ev-charger-test-equipment-guide",
  },
  {
    id: "case-9",
    slug: "dc-charger-output-protection-evaluation",
    categoryId: "independent-testing",
    title: "DC Charger Output and Protection Evaluation",
    summary: "This DC charger reference focuses on evaluating output voltage, current and power alongside protective behavior, bringing electrical-performance measurements and safety-related observations into the same charger-testing context.",
    technicalFocus: ["Voltage and current", "Charging power", "Protective behavior"],
    relatedResourceSlug: "dc-fast-charger-testing-guide",
  },
  {
    id: "case-10",
    slug: "off-board-charger-protocol-assessment",
    categoryId: "independent-testing",
    title: "Off-Board Charger Protocol Assessment",
    summary: "This off-board charger reference describes communication-data checks and protocol behavior, with attention to completeness and communication stability as topics for an unnamed inspection company's technical assessment.",
    technicalFocus: ["Communication-data checks", "Protocol behavior", "Communication stability"],
    relatedResourceSlug: "ev-charging-protocol-testing",
  },
  {
    id: "case-11",
    slug: "custom-ac-dc-charger-measurement",
    categoryId: "independent-testing",
    title: "Custom AC/DC Charger Measurement",
    summary: "This custom-instrumentation reference describes AC and DC charger output measurements supported by software analysis, outlining how electrical parameters and analysis functions fit within a combined charging-equipment measurement application.",
    technicalFocus: ["AC charger output", "DC charger output", "Measurement analysis"],
    image: {
      src: "/assets/library/case-11-system.jpg",
      alt: "Vehicle carrying portable charging-test instruments, loads and a laptop",
      width: 1000,
      height: 626,
    },
    relatedResourceSlug: "ac-vs-dc-evse-testing",
  },
  {
    id: "case-12",
    slug: "charging-station-field-evaluation",
    categoryId: "independent-testing",
    title: "Charging-Station Field Evaluation",
    summary: "This independent-testing reference describes charging-station checks involving electrical parameters, charging performance and maintenance diagnosis, connecting field observations with the technical questions encountered during charging-facility inspection and troubleshooting.",
    technicalFocus: ["Electrical parameters", "Charging performance", "Maintenance diagnosis"],
    relatedResourceSlug: "post-installation-evse-testing",
  },
  {
    id: "case-13",
    slug: "custom-dc-charger-test-arrangement",
    categoryId: "independent-testing",
    title: "Custom DC Charger Test Arrangement",
    summary: "This custom-equipment reference focuses on DC charger electrical performance and safety checks for an unnamed third-party laboratory, presenting specialized test instrumentation as the technical context for independent evaluation.",
    technicalFocus: ["DC electrical performance", "Safety checks", "Custom test equipment"],
    relatedResourceSlug: "evse-test-plan-checklist",
  },
  {
    id: "case-14",
    slug: "production-embedded-charger-testing",
    categoryId: "charger-manufacturing",
    title: "Production-Embedded Charger Testing",
    summary: "This manufacturing reference describes charger testing embedded within a production line, with attention to recording production batches and serial numbers alongside test activities to support equipment identification and traceability.",
    technicalFocus: ["Production-line testing", "Batch identification", "Serial-number traceability"],
    image: {
      src: "/assets/library/case-14-system.png",
      alt: "Test stations arranged along an assembly line",
      width: 1000,
      height: 626,
    },
    relatedResourceSlug: "evse-end-of-line-testing",
  },
  {
    id: "case-15",
    slug: "vehicle-ac-dc-charging-interoperability",
    categoryId: "vehicle-engineering",
    title: "Vehicle AC/DC Charging Interoperability",
    summary: "This vehicle-side reference describes AC and DC charging sequences with controlled fault simulation, focusing on the interaction between vehicle charging behavior and charging equipment during an interoperability assessment.",
    technicalFocus: ["AC and DC charging sequences", "Vehicle-side interaction", "Controlled fault simulation"],
    relatedResourceSlug: "ev-charging-protocol-testing",
  },
  {
    id: "case-16",
    slug: "vehicle-charging-message-consistency",
    categoryId: "vehicle-engineering",
    title: "Vehicle Charging Message Consistency",
    summary: "This vehicle-engineering reference describes checking charging-message formats, instruction handling and error responses, focusing on communication consistency as a technical topic when different vehicle implementations interact with charging equipment.",
    technicalFocus: ["Message formats", "Instruction handling", "Error responses"],
    relatedResourceSlug: "ev-charging-protocol-testing",
  },
  {
    id: "case-17",
    slug: "automated-dc-charger-production-testing",
    categoryId: "charger-manufacturing",
    title: "Automated DC Charger Production Testing",
    summary: "This DC charger manufacturing reference describes automated checks of voltage, current and power with report generation, connecting electrical measurements and test reporting within a production-line testing application.",
    technicalFocus: ["Automated production checks", "Voltage, current and power", "Report generation"],
    relatedResourceSlug: "evse-end-of-line-testing",
  },
  {
    id: "case-18",
    slug: "custom-dc-supercharging-test-system",
    categoryId: "charger-manufacturing",
    title: "Custom DC Supercharging Test System",
    summary: "This customized supercharging reference describes an arrangement of measurement instruments, controllers, power equipment and analysis software, focusing on the system building blocks used to discuss a DC charging-test application.",
    technicalFocus: ["Measurement instruments", "Control and power equipment", "Analysis software"],
    relatedResourceSlug: "regenerative-load-considerations",
  },
];
