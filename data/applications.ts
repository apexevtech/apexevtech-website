export type ApplicationExample = {
  slug: string;
  title: string;
  category: string;
  description: string;
  summary: string;
  image: string;
  imageAlt: string;
  intendedFor: string[];
  objectives: string[];
  configuration: Array<{ component: string; purpose: string }>;
  workflow: Array<{ step: string; detail: string }>;
  outputs: string[];
  confirmBeforeProject: string[];
  relatedProductSlugs: string[];
  relatedResourceSlugs: string[];
  publishedAt: string;
  modifiedAt: string;
};

const publishedAt = "2026-09-21";
const modifiedAt = "2026-09-21";

export const applicationExamples: ApplicationExample[] = [
  {
    slug: "integrated-ev-charger-validation-laboratory",
    title: "Integrated EV Charger Validation Laboratory Architecture",
    category: "Laboratory validation",
    description: "A reference architecture for coordinating charger interfaces, programmable power equipment, protocol analysis and traceable laboratory evidence.",
    summary: "This laboratory architecture is intended for teams that need repeatable AC or DC charger development and pre-compliance workflows. It starts with the target connector and exact test scope, then coordinates interface simulation, power equipment, measurements, communication capture and reporting around version-controlled test cases.",
    image: "/assets/hero/test-lab-systems.webp",
    imageAlt: "Integrated APEX EV charger validation laboratory equipment",
    intendedFor: ["EV charger manufacturers", "Independent and in-house test laboratories", "Engineering teams preparing for formal validation"],
    objectives: ["Reproduce normal, boundary and controlled fault sequences", "Synchronize communication evidence with electrical measurements", "Retain configurations and results that another engineer can review"],
    configuration: [
      { component: "AST-9000 platform", purpose: "Coordinates the selected charger interface, simulated vehicle workflow and laboratory test sequence." },
      { component: "Interface modules", purpose: "Match the actual GB/T, CCS2, Type 1, Type 2 or NACS connection and communication scope." },
      { component: "Programmable source and load", purpose: "Provide the facility-side supply and power-absorption path specified by the test plan." },
      { component: "Measurement and reporting", purpose: "Capture electrical values, protocol traffic, configurations, limits and repeatable result records." },
    ],
    workflow: [
      { step: "Freeze the test boundary", detail: "Record charger hardware and firmware, connector, standards editions, electrical range and required evidence." },
      { step: "Review the laboratory configuration", detail: "Confirm module ratings, external power equipment, protection, communication options and calibration responsibilities." },
      { step: "Establish a reference session", detail: "Run one normal sequence and align requested values, messages, pilot state and measured charger output." },
      { step: "Execute controlled cases", detail: "Apply one boundary or fault condition at a time using documented settings and expected responses." },
      { step: "Package the evidence", detail: "Store setup revisions, raw captures, measurements, limits, results and unresolved observations together." },
    ],
    outputs: ["Approved equipment and interface configuration", "Versioned test procedure and case matrix", "Synchronized communication and electrical records", "Reviewable result package for engineering or pre-compliance decisions"],
    confirmBeforeProject: ["Exact standards and editions", "Connector and maximum voltage, current and power", "Included versus external source and load equipment", "Automation, report and calibration requirements"],
    relatedProductSlugs: ["ast-9000", "st-hcdc-hpc", "st-hcac-gb-ua-ea", "st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["prepare-ev-charger-standards-validation", "ev-charging-protocol-testing", "evse-test-plan-checklist"],
    publishedAt,
    modifiedAt,
  },
  {
    slug: "mobile-ev-charger-commissioning-workflow",
    title: "Mobile EV Charger Commissioning and Maintenance Workflow",
    category: "Field operations",
    description: "A field workflow for bringing the correct charger interface, measurement tools and repeatable evidence process to installed charging sites.",
    summary: "This mobile workflow supports commissioning, maintenance and fault isolation when a charger cannot be moved to a fixed laboratory. The project configuration must match the installed connector and ratings, define how charging energy will be handled and keep the field record within the checks actually executed.",
    image: "/assets/products/ast-9000c-mobile-platform.webp",
    imageAlt: "Vehicle-based mobile EV charger testing platform",
    intendedFor: ["Charging station operators", "Commissioning and maintenance contractors", "Manufacturer field service teams"],
    objectives: ["Reproduce a vehicle-side charging sequence without using a customer EV as the primary test instrument", "Compare site behavior with a known commissioning baseline", "Preserve evidence needed for repair confirmation or laboratory escalation"],
    configuration: [
      { component: "Mobile test platform", purpose: "Carries the selected tester, accessories and supporting instruments to the charging site." },
      { component: "Connector-specific tester", purpose: "Simulates the required GB/T, CCS2, CHAdeMO, Type 1 or Type 2 vehicle-side workflow." },
      { component: "Approved energy path", purpose: "Uses a compatible external load or other approved arrangement where sustained power transfer is required." },
      { component: "Field evidence package", purpose: "Records charger identity, tester configuration, measurements, messages and the result of each planned check." },
    ],
    workflow: [
      { step: "Prepare from site information", detail: "Confirm charger model, connector, rating, supply, access, visit purpose and available load before dispatch." },
      { step: "Complete safety preconditions", detail: "Follow the site procedure for visual, grounding, supply and connector checks before functional testing." },
      { step: "Run the normal sequence", detail: "Observe connection, readiness, charging, measured output and controlled stop using a repeatable baseline." },
      { step: "Investigate the reported condition", detail: "Change only the condition required to reproduce the issue and retain surrounding protocol and measurement evidence." },
      { step: "Confirm handover or escalation", detail: "Repeat affected checks after repair, or preserve the configuration and first divergent state for laboratory reproduction." },
    ],
    outputs: ["Site-specific test scope and equipment list", "Baseline or post-repair functional record", "Measurements and communication evidence tied to the charger", "Open findings with a defined owner and follow-up action"],
    confirmBeforeProject: ["Installed connector and charger rating", "Permitted field tests and site safety controls", "External load or energy-absorption arrangement", "Required acceptance report and escalation process"],
    relatedProductSlugs: ["st-9980a-pro", "st-9980ea-hpc", "st-6680b-plus", "st-6680ca-dc", "st-6680ea-ac", "st-6680ea-dc", "st-6680ua-ac", "st-6680ua-dc", "st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["field-commissioning-test-equipment", "post-installation-evse-testing", "type-2-ac-evse-testing"],
    publishedAt,
    modifiedAt,
  },
  {
    slug: "evse-production-end-of-line-architecture",
    title: "EVSE Production End-of-Line and Aging Test Architecture",
    category: "Factory testing",
    description: "A modular production architecture for repeatable charger identity, functional, communication and power checks with traceable result handling.",
    summary: "This production architecture separates fast, stable end-of-line decisions from deeper laboratory diagnosis and longer aging duties. Each station should be configured around the charger variants, cycle-time target, measurable limits, fixtures and data interface required by the manufacturer.",
    image: "/assets/products/图片1.webp",
    imageAlt: "Modular EV charger production and aging test equipment",
    intendedFor: ["AC and DC charger manufacturers", "Production engineering teams", "Quality and manufacturing data teams"],
    objectives: ["Detect assembly, configuration and calibration issues with stable pass or fail limits", "Keep operator actions and variant selection controlled", "Link measurements and retest history to the charger identity"],
    configuration: [
      { component: "End-of-line test station", purpose: "Runs product-specific identity, safety precondition, interface, communication and measured-output checks." },
      { component: "Connector fixtures and switching", purpose: "Provides controlled, rated connections for each supported charger variant." },
      { component: "Power and aging equipment", purpose: "Applies the specified duty profile using separately rated source, load, cooling and protection systems." },
      { component: "Test control and data interface", purpose: "Selects the correct program and stores measurements, limits, results, versions and authorized retests." },
    ],
    workflow: [
      { step: "Map production risks", detail: "Select checks that detect likely assembly, wiring, firmware, configuration or calibration defects." },
      { step: "Define station limits", detail: "Set initial conditions, stimulus, measurement, numeric acceptance limit and evidence for each product variant." },
      { step: "Validate fixtures and references", detail: "Use controlled reference units and fixture checks to establish repeatability across stations and shifts." },
      { step: "Sequence for cycle time", detail: "Run identity and fast preconditions before longer communication, power or aging operations." },
      { step: "Control failures and retests", detail: "Route diagnostic work away from the main line and require a recorded reason for repair, retest or override." },
    ],
    outputs: ["Product-variant test matrix", "Station acceptance and reference checks", "Serial-number-linked measurements and results", "First-pass yield and failure data suitable for production review"],
    confirmBeforeProject: ["Product variants and required takt time", "Power and aging duty profile", "Fixture, safety and facility interfaces", "MES or report format and retest permissions"],
    relatedProductSlugs: ["ast-9000", "st-hcdc-hpc", "st-hcac-gb-ua-ea", "st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["evse-end-of-line-testing", "production-vs-laboratory-validation", "evse-test-plan-checklist"],
    publishedAt,
    modifiedAt,
  },
  {
    slug: "pv-storage-ev-charging-test-architecture",
    title: "PV, Energy Storage and EV Charging Test Architecture",
    category: "Energy system integration",
    description: "A project-planning architecture for coordinating photovoltaic generation, storage, grid conditions and DC charging tests without obscuring subsystem responsibilities.",
    summary: "This architecture treats the EV charger as one subsystem in a wider photovoltaic, storage and grid-connected energy flow. The project team must define operating scenarios, control ownership, power ratings, facility limits and evidence for each subsystem before selecting programmable sources, loads and charger interface equipment.",
    image: "/assets/products/图片9.webp",
    imageAlt: "PV energy storage and EV charging integrated test architecture",
    intendedFor: ["Commercial and industrial energy project teams", "Power electronics and microgrid laboratories", "Charging infrastructure system integrators"],
    objectives: ["Exercise coordinated energy-flow scenarios under controlled conditions", "Separate charger-interface behavior from site energy-management behavior", "Record commands, setpoints and measured power at system boundaries"],
    configuration: [
      { component: "Charger interface and protocol test system", purpose: "Represents the selected vehicle-side charging workflow and records charger communication and output." },
      { component: "Programmable source and grid simulation", purpose: "Reproduces the supply conditions and operating envelope defined by the energy-system test plan." },
      { component: "Storage and load path", purpose: "Absorbs, returns or redirects energy according to the specified ratings, controls and facility permissions." },
      { component: "Supervisory measurement and control", purpose: "Aligns energy-management commands with charger, storage, grid and load measurements." },
    ],
    workflow: [
      { step: "Draw the power and control boundary", detail: "Identify every source, storage device, converter, charger, load, controller and measurement point." },
      { step: "Define operating scenarios", detail: "Specify initial state, energy priority, setpoints, transitions, limits and expected protective behavior." },
      { step: "Validate subsystems first", detail: "Establish stable charger and power-equipment baselines before testing coordinated control." },
      { step: "Run controlled transitions", detail: "Change one operating condition at a time and synchronize commands with measured power and charger state." },
      { step: "Review energy and protection evidence", detail: "Confirm that observed flows, limits, alarms and shutdown behavior match the approved project procedure." },
    ],
    outputs: ["System boundary and responsibility diagram", "Scenario matrix with initial states and limits", "Synchronized control and measurement record", "Findings separated by charger, storage, grid and supervisory subsystem"],
    confirmBeforeProject: ["Power ratings and bidirectional requirements", "Grid-connection and regeneration permissions", "Energy-management interfaces and control ownership", "Protection, measurement accuracy and report requirements"],
    relatedProductSlugs: ["ast-9000", "st-9980ea-hpc", "st-hcdc-hpc"],
    relatedResourceSlugs: ["regenerative-load-considerations", "choose-ev-charger-test-system", "evse-test-plan-checklist"],
    publishedAt,
    modifiedAt,
  },
];

export function getApplicationExample(slug: string) {
  return applicationExamples.find((application) => application.slug === slug);
}

export function getProductApplications(productSlug: string) {
  return applicationExamples.filter((application) => application.relatedProductSlugs.includes(productSlug));
}

export function getResourceApplications(resourceSlug: string) {
  return applicationExamples.filter((application) => application.relatedResourceSlugs.includes(resourceSlug));
}
