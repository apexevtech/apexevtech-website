export type InterfaceTopic = {
  slug: string;
  name: string;
  title: string;
  description: string;
  summary: string;
  scope: string[];
  planningSteps: Array<{ title: string; detail: string }>;
  faqs: Array<{ question: string; answer: string }>;
  relatedProductSlugs: string[];
  relatedResourceSlugs: string[];
  publishedAt: string;
  modifiedAt: string;
};

const publishedAt = "2026-09-21";
const modifiedAt = "2026-09-22";

export const interfaceTopics: InterfaceTopic[] = [
  {
    slug: "ccs2-ev-charger-testing",
    name: "CCS2",
    title: "CCS2 EV Charger Testing Equipment and Workflow",
    description: "Compare CCS2 DC charger test equipment and plan PLC communication, control-pilot, electrical measurement, external-load and evidence requirements.",
    summary: "A CCS2 test system must match the Combo 2 connection, charger voltage and current, PLC communication scope and planned power path. Define the required DIN SPEC 70121 or ISO 15118 edition, diagnostic evidence and external-load arrangement before selecting a portable tester or integrated laboratory.",
    scope: ["Combo 2 connector and cable ratings", "Control-pilot and PLC communication sequence", "Requested versus measured DC output", "External load, protection and shutdown behavior"],
    planningSteps: [
      { title: "Identify the protocol boundary", detail: "Record charger firmware and the exact DIN SPEC 70121 or ISO 15118 parts and editions required by the project." },
      { title: "Define the electrical path", detail: "Confirm tester connection limits separately from the external load voltage, current, continuous power and facility requirements." },
      { title: "Choose portable or integrated equipment", detail: "Use portable equipment for field diagnosis and acceptance, or an integrated platform for repeatable laboratory automation and wider instrumentation." },
      { title: "Specify retained evidence", detail: "Align PLC messages, pilot state, requested values, charger output and protective responses on one reviewable timeline." },
    ],
    faqs: [
      { question: "Does a CCS2 charger tester include a full-power load?", answer: "Not necessarily. Many testers simulate the vehicle interface and connect to a separate compatible load. Confirm both connection and load ratings." },
      { question: "Can connector compatibility prove ISO 15118 coverage?", answer: "No. Confirm communication hardware, software, protocol editions and test cases separately from the physical Combo 2 connection." },
    ],
    relatedProductSlugs: ["st-9980ea-hpc", "st-6680ea-dc", "ast-9000"],
    relatedResourceSlugs: ["ccs2-dc-fast-charger-testing", "ev-charging-protocol-testing", "regenerative-load-considerations"],
    publishedAt, modifiedAt,
  },
  {
    slug: "gbt-ev-charger-testing",
    name: "GB/T",
    title: "GB/T EV Charger Testing Equipment and Workflow",
    description: "Plan GB/T AC and DC charger testing with the correct connector, communication revision, BMS simulation, metering and production or field workflow.",
    summary: "GB/T charger testing should begin with the AC or DC interface and exact standards editions in scope. Select equipment by charger rating, communication and fault cases, measurement accuracy, test environment and the evidence required for engineering, production, field acceptance or conformance preparation.",
    scope: ["GB/T AC or DC connector configuration", "BMS or control-pilot simulation", "Protocol, interoperability and fault cases", "Metering, waveform and result records"],
    planningSteps: [
      { title: "Separate AC and DC requirements", detail: "Record the connector, supply or output range and charging sequence instead of treating GB/T as one interchangeable interface." },
      { title: "Freeze standards editions", detail: "List connector, system, communication, interoperability and metering documents with their required revisions." },
      { title: "Match equipment to the environment", detail: "Choose portable equipment for commissioning or configurable laboratory and production systems for automated, repeatable cases." },
      { title: "Keep conformance and interoperability distinct", detail: "A completed vehicle session supports interoperability evidence but does not replace a defined protocol-conformance procedure." },
    ],
    faqs: [
      { question: "Can one GB/T tester cover AC and DC chargers?", answer: "Only when the configured system contains the separate AC and DC interfaces, power paths and communication functions required by the test plan." },
      { question: "Which GB/T revision should be selected?", answer: "Use the exact editions required by the target market, charger firmware, customer specification and test procedure; do not assume automatic coverage across revisions." },
    ],
    relatedProductSlugs: ["st-9980a-pro", "st-hcdc-hpc", "st-6680b-plus", "st-hcac-gb-ua-ea", "ast-9000"],
    relatedResourceSlugs: ["gbt-dc-charger-conformance-testing", "ev-charging-protocol-testing", "evse-end-of-line-testing"],
    publishedAt, modifiedAt,
  },
  {
    slug: "nacs-evse-testing",
    name: "NACS",
    title: "NACS EVSE Testing Equipment and SAE J3400 Planning",
    description: "Plan NACS EVSE testing around SAE J3400 scope, AC or DC use, coupler ratings, pilot behavior, measurements, faults and laboratory evidence.",
    summary: "NACS equipment selection must state whether the project covers AC or DC power transfer, because coupler compatibility alone does not establish the tester's electrical or communication scope. For AC EVSE work, define the SAE J3400 edition, supply, current, pilot cases, switching, faults, measurements and retained evidence.",
    scope: ["NACS coupler and intended AC or DC use", "SAE J3400 edition and project requirements", "Pilot states, switching and controlled faults", "Laboratory, production or field evidence"],
    planningSteps: [
      { title: "State AC or DC explicitly", detail: "Do not infer complete AC and DC test coverage from use of the same coupler family." },
      { title: "Record ratings and supply", detail: "Identify voltage, current, phase, cable arrangement, load path and the limits of every connector and measurement channel." },
      { title: "Define functional cases", detail: "Plan connection, readiness, energized charging, controlled stop and approved abnormal conditions with expected responses." },
      { title: "Confirm options and evidence", detail: "Check which metering, waveform, automation and reporting functions are included and which require additional modules." },
    ],
    faqs: [
      { question: "Does every NACS tester support AC and DC?", answer: "No. Verify the stated AC or DC scope, electrical ratings, communication functions and power arrangement for the selected equipment." },
      { question: "What information is needed for a NACS AC quotation?", answer: "Provide the SAE J3400 revision, voltage, current, phase, required pilot and fault cases, metering or waveform needs and test environment." },
    ],
    relatedProductSlugs: ["st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["nacs-ac-evse-testing", "ac-vs-dc-evse-testing", "evse-test-plan-checklist"],
    publishedAt, modifiedAt,
  },
  {
    slug: "type-2-evse-testing",
    name: "Type 2",
    title: "Type 2 EVSE Testing Equipment and IEC 61851 Workflow",
    description: "Compare Type 2 AC EVSE test equipment and plan control-pilot states, proximity behavior, switching, metering, faults and commissioning evidence.",
    summary: "Type 2 EVSE testing should match the socket or tethered-cable arrangement, single- or three-phase supply, current rating and applicable IEC requirements. A repeatable workflow connects simulated vehicle states with pilot observations, EVSE switching, measured output, protective responses and clear result limits.",
    scope: ["Type 2 socket or tethered cable", "Single- or three-phase rating", "Control-pilot and proximity behavior", "Switching, metering and protective response"],
    planningSteps: [
      { title: "Record the installed configuration", detail: "Identify connector arrangement, phases, voltage, current and any site or fixture limits before connecting test equipment." },
      { title: "Define the pilot sequence", detail: "Specify connection, readiness, energized charging and stop states together with resistance, diode and timing settings." },
      { title: "Select the evidence depth", detail: "Decide whether the work needs functional indication, electrical values, metering reference, waveform capture or automated reports." },
      { title: "Keep field claims within scope", detail: "Portable commissioning checks do not automatically replace laboratory controls or formal conformity-assessment procedures." },
    ],
    faqs: [
      { question: "Can a portable Type 2 tester be used for commissioning?", answer: "Yes, when its ratings and functions match the approved site procedure, required measurements and external-load arrangement." },
      { question: "Is the Type 2 tester also the charging load?", answer: "Not always. The tester can simulate the vehicle connection and pilot behavior while a separate load provides the power-absorption path." },
    ],
    relatedProductSlugs: ["st-6680ea-ac", "st-hcac-gb-ua-ea", "st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["type-2-ac-evse-testing", "field-commissioning-test-equipment", "post-installation-evse-testing"],
    publishedAt, modifiedAt,
  },
  {
    slug: "chademo-dc-charger-testing",
    name: "CHAdeMO",
    title: "CHAdeMO DC Charger Testing Equipment and Workflow",
    description: "Plan CHAdeMO DC charger testing around protocol version, CAN communication, voltage and current limits, insulation checks, external load and retained evidence.",
    summary: "CHAdeMO charger testing requires more than a matching connector. Define the protocol version, charger voltage and current, CAN message scope, startup and insulation sequence, external-load path and evidence needed for development, production or field acceptance before choosing equipment.",
    scope: ["CHAdeMO connector and protocol version", "CAN messages and charging sequence", "Startup voltage, insulation and output checks", "External load, faults and result records"],
    planningSteps: [
      { title: "Freeze the protocol scope", detail: "Record the charger firmware, target CHAdeMO version, required messages, timing and approved abnormal cases before configuring the test plan." },
      { title: "Confirm every electrical limit", detail: "Check the tester socket, measurement channels, charger output and external load voltage, current and continuous-power limits independently." },
      { title: "Reproduce the charging sequence", detail: "Plan connection, CAN negotiation, startup and insulation checks, current demand, controlled stop and protective responses in a repeatable order." },
      { title: "Align the evidence", detail: "Retain time-correlated CAN records, requested values, measured charger output, insulation observations, waveforms and pass or fail criteria." },
    ],
    faqs: [
      { question: "Does a CHAdeMO tester absorb full charger power?", answer: "Not necessarily. The tester can simulate the vehicle-side interface while a separate compatible load absorbs power. Confirm the external-load arrangement and ratings." },
      { question: "Can a CCS tester be used for CHAdeMO testing with an adapter?", answer: "A connector adapter does not replace CHAdeMO CAN communication, sequence control or safety behavior. Use equipment configured for the required CHAdeMO version and test scope." },
    ],
    relatedProductSlugs: ["st-6680ca-dc", "ast-9000"],
    relatedResourceSlugs: ["ev-charging-protocol-testing", "field-commissioning-test-equipment", "evse-test-plan-checklist"],
    publishedAt: "2026-09-22", modifiedAt,
  },
  {
    slug: "type-1-j1772-evse-testing",
    name: "Type 1 / SAE J1772",
    title: "Type 1 SAE J1772 EVSE Testing Equipment and Workflow",
    description: "Plan Type 1 SAE J1772 AC EVSE testing for control-pilot states, proximity behavior, supply ratings, switching, metering, faults and field evidence.",
    summary: "Type 1 EVSE testing should match the SAE J1772 edition, connector arrangement, supply voltage, current and the required laboratory or field procedure. Build the workflow around vehicle-state simulation, pilot behavior, EVSE switching, measured output, protective responses and traceable results.",
    scope: ["Type 1 connector and SAE J1772 edition", "Control-pilot and proximity behavior", "AC supply, switching and measurements", "Fault cases, field checks and reports"],
    planningSteps: [
      { title: "Identify the installed configuration", detail: "Record the SAE J1772 edition, tethered connector, supply voltage, current and upstream protection for the charger under test." },
      { title: "Define simulated vehicle states", detail: "Specify connection, readiness, ventilation where applicable, energized charging and controlled stop with expected pilot and switching behavior." },
      { title: "Select measurement depth", detail: "Choose functional checks, live electrical values, precision metering, waveform capture and optional modules according to the acceptance procedure." },
      { title: "Document scope and limits", detail: "Record the tester rating, external-load path, test conditions and evidence so field checks are not mistaken for formal certification." },
    ],
    faqs: [
      { question: "Is Type 1 the same as SAE J1772?", answer: "Type 1 commonly refers to the SAE J1772 AC connector and charging interface. Confirm the exact standard edition, regional requirements and equipment ratings for the project." },
      { question: "Can one Type 1 tester also test NACS or Type 2 EVSE?", answer: "Only a specifically configured multi-interface system can cover those connections. A dedicated Type 1 tester does not gain NACS or Type 2 coverage through its pilot functions alone." },
    ],
    relatedProductSlugs: ["st-6680ua-ac", "st-hcac-ea-ua-na", "st-hcac-gb-ua-ea"],
    relatedResourceSlugs: ["ac-vs-dc-evse-testing", "field-commissioning-test-equipment", "post-installation-evse-testing"],
    publishedAt: "2026-09-22", modifiedAt,
  },
];

export function getInterfaceTopic(slug: string) {
  return interfaceTopics.find((topic) => topic.slug === slug);
}

export function getProductInterfaceTopics(productSlug: string) {
  return interfaceTopics.filter((topic) => topic.relatedProductSlugs.includes(productSlug));
}
