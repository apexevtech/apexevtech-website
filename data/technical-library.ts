export type TechnicalLibraryCategory = {
  id: string;
  label: string;
};

export type TechnicalLibraryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type TechnicalLibrarySource = {
  publisher: "SAITER";
  title: string;
  summary: string;
  scopeNote: string;
  image?: TechnicalLibraryImage;
};

export type TechnicalLibraryEntry = {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  requirements: [string, string, string];
  reviewOutput: string;
  planningNote: string;
  relatedHref: string;
  relatedLabel: string;
  source: TechnicalLibrarySource;
};

export const solutionBriefCategories: TechnicalLibraryCategory[] = [
  { id: "solution-evse-laboratory", label: "EVSE laboratory" },
  { id: "solution-vehicle-interaction", label: "Vehicle interaction" },
  { id: "solution-pv-storage", label: "PV and storage" },
  { id: "solution-power-interfaces", label: "Battery and power interfaces" },
  { id: "solution-field-diagnostics", label: "Field diagnostics" },
  { id: "solution-custom-integration", label: "Custom integration" },
];

export const applicationScenarioCategories: TechnicalLibraryCategory[] = [
  { id: "audience-vehicle-engineering", label: "Vehicle engineering" },
  { id: "audience-independent-testing", label: "Independent testing" },
  { id: "audience-public-inspection", label: "Public inspection" },
  { id: "audience-charger-manufacturing", label: "Charger manufacturing" },
];

export const solutionBriefs: TechnicalLibraryEntry[] = [
  {
    id: "evse-laboratory-planning",
    categoryId: "solution-evse-laboratory",
    title: "EVSE Laboratory Planning",
    summary: "Define a laboratory around the charger interfaces and questions that need investigation. Coordinate simulated vehicle behavior, electrical measurements, communication records and the power path within one reviewed test boundary.",
    requirements: [
      "Identify charger variants, connectors, firmware and the exact standards editions in scope.",
      "Separate interface ratings from sustained power requirements, external loads and facility limits.",
      "Define test conditions, expected responses and the raw records needed for engineering review.",
    ],
    reviewOutput: "A configuration boundary, equipment responsibility list and versioned test matrix for laboratory planning.",
    planningNote: "Equipment selection and test coverage require configuration review; this brief does not establish laboratory accreditation or a conformity result.",
    relatedHref: "/applications/integrated-ev-charger-validation-laboratory",
    relatedLabel: "Laboratory reference architecture",
    source: {
      publisher: "SAITER",
      title: "EV charger testing",
      image: { src: "/assets/library/solution-evse.jpg", alt: "AC charging stations with connected charging cables", width: 617, height: 399 },
      summary: "SAITER describes a simulated laboratory setting for investigating charger functions, vehicle interaction and abnormal conditions. The page outlines topics rather than publishing a reproducible test procedure or a complete results record.",
      scopeNote: "Third-party overview, not evidence of an APEX delivery. Equipment configuration, standards editions and raw results are not provided.",
    },
  },
  {
    id: "vehicle-charger-interaction-planning",
    categoryId: "solution-vehicle-interaction",
    title: "Vehicle-to-Charger Interaction Scope",
    summary: "Plan the interaction between a defined vehicle-side implementation and selected charging interfaces. Separate session sequencing, communication behavior and electrical response so that each compatibility question has a reviewable test condition.",
    requirements: [
      "List the vehicle-side role, charger interfaces, communication options and software revisions.",
      "Choose normal, boundary and controlled fault sequences with explicit start and stop conditions.",
      "Align message captures, pilot states and electrical observations on a shared session timeline.",
    ],
    reviewOutput: "A bounded interaction matrix with configuration dependencies and evidence requirements for each session.",
    planningNote: "A selected test matrix cannot establish compatibility with every vehicle or charger; supported implementations require separate confirmation.",
    relatedHref: "/resources/ev-charging-protocol-testing",
    relatedLabel: "Charging protocol planning guide",
    source: {
      publisher: "SAITER",
      title: "New energy vehicle charging tests",
      image: { src: "/assets/library/solution-vehicle.jpg", alt: "Illustration of an electric vehicle connected to a charging station", width: 1920, height: 960 },
      summary: "SAITER discusses differences in charging efficiency, charging time and access to infrastructure. The article frames general vehicle-charging questions but does not identify a study sample, equipment setup or measured dataset.",
      scopeNote: "Third-party overview, not evidence of an APEX delivery. Charging-time and efficiency observations are not independently verified results.",
    },
  },
  {
    id: "pv-storage-integration-planning",
    categoryId: "solution-pv-storage",
    title: "PV and Storage Integration Planning",
    summary: "Treat the charger, generation, storage and site controller as separate subsystems before planning combined operation. Identify who commands each energy flow and where power, limits and protective responses need observation.",
    requirements: [
      "Draw the sources, storage, converters, charger, load and measurement points in the power path.",
      "Specify initial energy states, control ownership, transitions and operating limits for each scenario.",
      "Confirm facility permissions, protection responsibilities and any proposed regeneration path.",
    ],
    reviewOutput: "A subsystem responsibility diagram and a scenario matrix for coordinated energy-flow review.",
    planningNote: "This is an integration-planning boundary, not a claim that any particular PV, storage or bidirectional configuration is included.",
    relatedHref: "/applications/pv-storage-ev-charging-test-architecture",
    relatedLabel: "Energy integration reference architecture",
    source: {
      publisher: "SAITER",
      title: "Photovoltaic and energy storage testing",
      image: { src: "/assets/library/solution-pv-storage.webp", alt: "Photovoltaic panel array", width: 1920, height: 960 },
      summary: "SAITER introduces the relationship between photovoltaic generation and battery storage, including storing energy for later use. The page discusses the integration topic without documenting a specific test system, project configuration or measured performance.",
      scopeNote: "Third-party overview, not evidence of an APEX delivery. No quantified efficiency result or defined test conditions are available.",
    },
  },
  {
    id: "battery-power-interface-planning",
    categoryId: "solution-power-interfaces",
    title: "Battery and Power Interface Planning",
    summary: "Define how a battery-side interface, simulator or external power device participates in a charger project. Keep charger communication and power-path questions separate from cell characterization or battery lifetime testing.",
    requirements: [
      "State whether the project needs a simulated battery response, an actual battery interface or a separately supplied load.",
      "Specify voltage, current, energy direction, duty profile and the protection owner at each connection.",
      "Record interface signals, control responsibilities and the measurements needed to review charger behavior.",
    ],
    reviewOutput: "An interface responsibility sheet and a power-equipment review checklist for the charger test scope.",
    planningNote: "This brief does not offer a battery test system or establish cell, pack, cycling or environmental test capability.",
    relatedHref: "/resources/choose-ev-charger-test-system",
    relatedLabel: "Test system selection guide",
    source: {
      publisher: "SAITER",
      title: "Battery testing",
      image: { src: "/assets/library/solution-battery.jpg", alt: "Illustration of an open battery pack", width: 1920, height: 960 },
      summary: "SAITER outlines battery assessment topics such as repeated charging cycles, environmental exposure and charging speed. Its general comparisons do not identify battery samples, cycling conditions, evaluation methods or an underlying data report.",
      scopeNote: "Third-party topic reference, not an APEX battery-test offering or delivery record. The APEX brief remains limited to charger-project interfaces.",
    },
  },
  {
    id: "field-diagnostics-planning",
    categoryId: "solution-field-diagnostics",
    title: "Field Diagnostics Planning",
    summary: "Prepare a site visit around the installed charger and the condition under investigation. Establish safe preconditions, a repeatable reference sequence and an evidence package that supports repair review or laboratory escalation.",
    requirements: [
      "Record the charger asset, connector, rating, firmware and the reported site condition before dispatch.",
      "Confirm access, safety procedures, instruments and the approved energy-absorption arrangement.",
      "Select repeatable checks and retain matching setup, communication and measurement records.",
    ],
    reviewOutput: "A site-specific visit plan with baseline checks, evidence fields and an escalation decision path.",
    planningNote: "Permitted work depends on site controls and the selected equipment; a diagnostic plan is not an inspection certificate.",
    relatedHref: "/applications/mobile-ev-charger-commissioning-workflow",
    relatedLabel: "Mobile commissioning reference workflow",
    source: {
      publisher: "SAITER",
      title: "Operations and maintenance inspection",
      image: { src: "/assets/library/solution-maintenance.jpg", alt: "A charging connector held beside an electric vehicle", width: 1920, height: 960 },
      summary: "SAITER lists operations and maintenance inspection as a solution category. The readable article concerns internet-platform security, vulnerability scanning and penetration testing rather than a defined charger field-diagnostics method.",
      scopeNote: "Category reference only: the source body has a topic mismatch and does not substantiate the APEX charger workflow or a delivery.",
    },
  },
  {
    id: "custom-test-integration-planning",
    categoryId: "solution-custom-integration",
    title: "Custom Test Integration Planning",
    summary: "Break a custom test request into equipment interfaces, controlled sequences and evidence responsibilities. Review fixture, software, facility and data-system dependencies before defining the intended delivery boundary.",
    requirements: [
      "Describe the device variants, test objectives, exclusions and operating environment.",
      "Identify fixtures, power equipment, safety controls and software interfaces that require separate integration.",
      "Define reviewable acceptance criteria, data formats and responsibility for configuration changes.",
    ],
    reviewOutput: "A scope matrix that assigns each requirement, interface, acceptance check and unresolved dependency.",
    planningNote: "Custom functions and external-system connections remain subject to engineering review rather than implied standard product capability.",
    relatedHref: "/resources/evse-test-plan-checklist",
    relatedLabel: "EVSE test plan checklist",
    source: {
      publisher: "SAITER",
      title: "Other testing categories",
      image: { src: "/assets/library/solution-other.jpg", alt: "Electrical substation equipment", width: 1920, height: 960 },
      summary: "SAITER includes an other-testing category alongside its main solution topics. The article combines a general charger introduction with internet-security testing language, without defining a custom charger-test system or integration boundary.",
      scopeNote: "Category reference only: the source body has a topic mismatch and does not substantiate APEX custom functions or a delivery.",
    },
  },
];

export const applicationScenarios: TechnicalLibraryEntry[] = [
  {
    id: "ccs2-laboratory-scope",
    categoryId: "audience-charger-manufacturing",
    title: "CCS2 Laboratory Scope",
    summary: "Plan a CCS2 charger investigation by connecting the required charging sequences to interface simulation, communication capture and the electrical power path.",
    requirements: [
      "Identify the charger revision, CCS2 connection and communication modes under review.",
      "Separate connector ratings, measured output and sustained-load requirements.",
      "Define normal and controlled fault cases with expected responses and retained evidence.",
    ],
    reviewOutput: "A CCS2 scope sheet with an equipment boundary and case-level evidence list.",
    planningNote: "Interface simulation alone does not establish sustained full-power operation or complete standards coverage.",
    relatedHref: "/resources/ccs2-dc-fast-charger-testing",
    relatedLabel: "CCS2 charger testing guide",
    source: {
      publisher: "SAITER",
      title: "CCS charger test system application",
      image: { src: "/assets/library/case-1-system.png", alt: "Multiple charging-test cabinets", width: 865, height: 548 },
      summary: "SAITER presents CCS charger laboratory testing as an application, discussing supply behavior, charging power, communication and protective functions. The article describes simulated operating conditions without identifying a customer, equipment configuration or retained measurement records.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery. No independently verified project result or complete setup is supplied.",
    },
  },
  {
    id: "site-fault-diagnosis",
    categoryId: "audience-public-inspection",
    title: "Charging-Site Fault Diagnosis",
    summary: "Organize a field investigation around one reported charging condition, keeping site identity, setup and the first divergent session state together.",
    requirements: [
      "Record the installed asset, reported symptom and conditions needed to reproduce it.",
      "Confirm connector access, safety authority and the energy path for permitted checks.",
      "Capture a normal reference and the affected sequence using consistent measurement points.",
    ],
    reviewOutput: "A diagnostic visit record with observations, setup limitations and escalation actions.",
    planningNote: "A field investigation records the conditions checked; it does not establish fault-free operation outside that scope.",
    relatedHref: "/resources/field-commissioning-test-equipment",
    relatedLabel: "Field equipment planning guide",
    source: {
      publisher: "SAITER",
      title: "Field testing with a vehicle-charger diagnostic device",
      summary: "SAITER introduces a diagnostic device for collecting charging information, examining faults and alerting maintenance staff. Its case page offers a general product-use description rather than documenting the named site's investigation or measured repair outcome.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery. Customer identity, setup and claimed maintenance benefits are not independently verified.",
    },
  },
  {
    id: "interoperability-scope-review",
    categoryId: "audience-public-inspection",
    title: "Interoperability Scope Review",
    summary: "Define which vehicle-side and charger-side implementations belong in an interoperability review, then select reproducible interactions rather than an unrestricted compatibility claim.",
    requirements: [
      "List interface types, communication implementations and hardware or firmware combinations.",
      "Choose session transitions, boundary values and controlled exceptions for comparison.",
      "Define the evidence needed to distinguish a setup issue from an interaction mismatch.",
    ],
    reviewOutput: "A bounded interoperability matrix with configuration identifiers and open assumptions.",
    planningNote: "Coverage applies only to the configurations and cases selected for review; no universal interoperability outcome is implied.",
    relatedHref: "/resources/ev-charging-protocol-testing",
    relatedLabel: "Protocol scope planning guide",
    source: {
      publisher: "SAITER",
      title: "Vehicle interoperability test system ST-9980X",
      summary: "SAITER describes simulating charging facilities to examine communication, data exchange and vehicle-charger interaction. ST-9980X appears in the page title, while the article does not specify an implemented configuration, test matrix or results.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery. The source mixes interaction terminology; system scope and outcomes need confirmation.",
    },
  },
  {
    id: "european-interface-evaluation",
    categoryId: "audience-independent-testing",
    title: "Type 2 and CCS2 Interface Plan",
    summary: "Separate Type 2 AC and CCS2 DC requirements before planning an evaluation. Map each electrical, pilot and communication question to the appropriate setup.",
    requirements: [
      "Identify whether Type 2 AC, CCS2 DC or both interfaces fall within the requested scope.",
      "Record applicable standards editions, connector ratings and required observations.",
      "Assign measurements, stimulation and verdict rules separately for each interface.",
    ],
    reviewOutput: "An interface-specific evaluation matrix with equipment and evidence responsibilities.",
    planningNote: "An interface designation is not a conformity result; formal assessment scope requires separate agreement.",
    relatedHref: "/resources/prepare-ev-charger-standards-validation",
    relatedLabel: "Standards validation preparation guide",
    source: {
      publisher: "SAITER",
      title: "European-standard charger testing at an unnamed institute",
      summary: "SAITER organizes European-standard charger assessment into safety, basic operation and compatibility topics. The case identifies an unnamed research institute but does not publish applicable standard editions, equipment details or the project's test records.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery or certification. Standards coverage and assessment outcomes are not independently verified.",
    },
  },
  {
    id: "third-party-measurement-plan",
    categoryId: "audience-independent-testing",
    title: "Third-Party Measurement Plan",
    summary: "Translate a charger measurement request into observable quantities, operating conditions and a reviewable record before choosing instruments or report fields.",
    requirements: [
      "Define each quantity, operating point, reference method and required measurement range.",
      "Review instrument suitability, calibration responsibilities and relevant uncertainty inputs.",
      "Link each reported value to the setup, limits, raw record and configuration revision.",
    ],
    reviewOutput: "A measurement plan and report-field map for independent technical review.",
    planningNote: "The plan does not assert laboratory accreditation, measurement accuracy or a completed verification result.",
    relatedHref: "/resources/evse-test-plan-checklist",
    relatedLabel: "Measurement and evidence checklist",
    source: {
      publisher: "SAITER",
      title: "Charger tester at an unnamed Shanghai research institute",
      summary: "SAITER's case title associates a charger tester with an unnamed Shanghai research organization. The readable page does not include a project narrative, leaving the test setup, requested measurements and implementation outcome unspecified.",
      scopeNote: "Title-level third-party reference only, not evidence of an APEX delivery. No readable project detail or measurement report is supplied.",
    },
  },
  {
    id: "charging-power-scenario-plan",
    categoryId: "audience-independent-testing",
    title: "Charging Power Scenario Planning",
    summary: "Describe the requested charging duty as a sequence of setpoints and transitions, keeping simulated demand separate from measured charger output and site power constraints.",
    requirements: [
      "Specify requested voltage, current, duration, transitions and initial conditions.",
      "Confirm the source, load and cooling envelope for each proposed operating point.",
      "Define where commands and measured power need synchronized recording.",
    ],
    reviewOutput: "A power-scenario table with facility constraints and measurement responsibilities.",
    planningNote: "Scenario planning does not establish energy savings, charging-time improvements or sustained power capability.",
    relatedHref: "/resources/regenerative-load-considerations",
    relatedLabel: "Load and energy-path planning guide",
    source: {
      publisher: "SAITER",
      title: "Charging power simulation for a power research institute",
      summary: "SAITER describes mathematical modeling and simulation of charging demand and energy consumption for layout and scheduling discussions. The article does not provide model inputs, validation records or numerical support for its claimed efficiency benefits.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery. Claimed efficiency improvements are not independently verified measured results.",
    },
  },
  {
    id: "high-power-duty-review",
    categoryId: "audience-independent-testing",
    title: "High-Power Duty Review",
    summary: "Review a proposed high-power charging duty across the entire connection and energy path. Keep interface, instrumentation, load and cooling limits distinct.",
    requirements: [
      "Specify simultaneous voltage and current, duration and the intended duty profile.",
      "Check cables, connectors, external loads, protection and cooling responsibilities.",
      "Define operating limits, stop conditions and measurements needed for review.",
    ],
    reviewOutput: "A duty-envelope review with component limits and unresolved equipment dependencies.",
    planningNote: "A model name or connector rating is not evidence of full-power test operation; the complete setup requires confirmation.",
    relatedHref: "/resources/dc-fast-charger-testing-guide",
    relatedLabel: "DC fast charger planning guide",
    source: {
      publisher: "SAITER",
      title: "Supercharging facility testing associated with CQC",
      summary: "SAITER's case page names China Quality Certification Centre and introduces ST-HCDC-800A for third-party DC charger field checks using simulated vehicle behavior. It lists standards references but does not include project measurements or a verified operating envelope.",
      scopeNote: "Supplier-published case, not an APEX delivery or endorsement. Historical standards references and model naming do not prove current coverage or tested power.",
    },
  },
  {
    id: "integrated-measurement-plan",
    categoryId: "audience-independent-testing",
    title: "Integrated Measurement Plan",
    summary: "Coordinate electrical measurements, session states and communication records so that an engineering reviewer can follow how a charger responds to a defined stimulus.",
    requirements: [
      "Identify measurement points, signals and the instruments responsible for each record.",
      "Specify timing alignment, identifiers and configuration information shared across logs.",
      "Define retained raw data, report fields and handling of incomplete records.",
    ],
    reviewOutput: "A synchronized evidence plan with instrument ownership and a common record structure.",
    planningNote: "Time alignment and software integration depend on the selected tools and interfaces; automatic synchronization is not assumed.",
    relatedHref: "/applications/integrated-ev-charger-validation-laboratory",
    relatedLabel: "Integrated laboratory reference architecture",
    source: {
      publisher: "SAITER",
      title: "Charger tester associated with China Inspection and Certification Group",
      summary: "SAITER associates a charger tester with China Inspection and Certification Group in a brief case description. The page does not identify the equipment model, installed configuration, measurement workflow, acceptance record or quantified project outcome.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery or institutional endorsement. The association is not independently verified.",
    },
  },
  {
    id: "dc-charger-validation-plan",
    categoryId: "audience-independent-testing",
    title: "DC Charger Validation Plan",
    summary: "Group DC charger questions into output behavior, charging sequences and controlled protective responses, with a stated configuration and verdict rule for every planned check.",
    requirements: [
      "Define connector, communication version, operating range and charger revision.",
      "Allocate functional, electrical and controlled fault checks to suitable equipment.",
      "Record expected responses, limits, raw measurements and open exclusions.",
    ],
    reviewOutput: "A DC validation matrix that separates planned scope, equipment and evidence.",
    planningNote: "A validation plan is not a completed test report or proof that all applicable safety requirements are satisfied.",
    relatedHref: "/resources/dc-fast-charger-testing-guide",
    relatedLabel: "DC charger validation planning guide",
    source: {
      publisher: "SAITER",
      title: "DC charger testing associated with a building-materials inspection group",
      summary: "SAITER describes a DC charger test system associated with China Building Material Test and Certification Group, covering current, voltage, power and protective behavior. The article does not supply configuration details, standards editions or raw project results.",
      scopeNote: "Supplier-published case, not an APEX delivery or conformity result. Equipment use and outcomes are not independently verified.",
    },
  },
  {
    id: "protocol-suite-planning",
    categoryId: "audience-independent-testing",
    title: "Protocol Test Suite Planning",
    summary: "Build a bounded protocol suite around named implementations and explicit message conditions. Keep functional communication checks separate from formal conformance assessment.",
    requirements: [
      "Identify the protocol, edition, implementation role and optional features in scope.",
      "Specify preconditions, message changes, timing boundaries and expected responses.",
      "Define capture topology, case identifiers and verdict evidence for each check.",
    ],
    reviewOutput: "A versioned protocol case list with traceable preconditions and verdict rules.",
    planningNote: "Protocol coverage and automation require review against the selected implementation; no certification or complete suite coverage is implied.",
    relatedHref: "/resources/ev-charging-protocol-testing",
    relatedLabel: "Protocol test planning guide",
    source: {
      publisher: "SAITER",
      title: "Off-board charger protocol consistency testing",
      summary: "SAITER outlines communication-data checks and protocol behavior for off-board charging equipment in an unnamed certification-company case. The description discusses completeness and stability without publishing protocol editions, executed cases or assessment evidence.",
      scopeNote: "Supplier-published case, not an APEX delivery or conformance result. Test topology, verdict criteria and implementation details require confirmation.",
    },
  },
  {
    id: "ac-dc-measurement-station",
    categoryId: "audience-independent-testing",
    title: "AC/DC Measurement Station Planning",
    summary: "Plan a shared workspace without treating AC and DC charging as interchangeable. Separate connection methods, measured quantities and energy handling for each station mode.",
    requirements: [
      "List AC and DC variants, connection ratings and the purpose of each measurement.",
      "Define mode-specific fixtures, instruments, interlocks and source or load arrangements.",
      "Control program selection and record the active station configuration with each result.",
    ],
    reviewOutput: "An AC/DC station configuration matrix with mode-specific responsibilities.",
    planningNote: "A combined station concept does not establish that one tester covers every interface, measurement or accuracy requirement.",
    relatedHref: "/resources/ac-vs-dc-evse-testing",
    relatedLabel: "AC and DC testing comparison",
    source: {
      publisher: "SAITER",
      title: "Customized AC/DC charger test equipment for an unnamed organization",
      image: { src: "/assets/library/case-11-system.jpg", alt: "Vehicle carrying portable charging-test instruments, loads and a laptop", width: 1000, height: 626 },
      summary: "SAITER introduces customized AC and DC charger test equipment associated with an unnamed Jiangsu organization. The article discusses electrical measurements and software analysis, without documenting the delivered configuration, instrument accuracy or acceptance results.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery. Custom configuration, measurement performance and acceptance records are not independently verified.",
    },
  },
  {
    id: "charging-site-inspection-plan",
    categoryId: "audience-independent-testing",
    title: "Charging-Site Inspection Plan",
    summary: "Set a site inspection boundary around installed assets, permitted checks and the evidence needed for handover or follow-up, rather than an unrestricted site-wide conclusion.",
    requirements: [
      "Identify inspected assets, connectors, site conditions and the purpose of the visit.",
      "Agree safety preconditions, access limits and available power-absorption equipment.",
      "Define asset-level checks, finding records and responsibility for unresolved items.",
    ],
    reviewOutput: "An asset-linked inspection checklist with exclusions and a finding register.",
    planningNote: "The inspection plan does not replace site safety procedures or establish acceptance of assets that are not checked.",
    relatedHref: "/resources/post-installation-evse-testing",
    relatedLabel: "Post-installation testing guide",
    source: {
      publisher: "SAITER",
      title: "Charging-site test equipment for an unnamed inspection company",
      summary: "SAITER describes charging-site equipment in an unnamed third-party inspection-company case, covering electrical quantities, charging behavior and maintenance faults. The source does not detail the site conditions, chosen instruments or records from a specific inspection.",
      scopeNote: "Supplier-published case, not an APEX delivery or inspection certificate. Customer identity, site scope and measured results remain unverified.",
    },
  },
  {
    id: "custom-dc-test-scope",
    categoryId: "audience-independent-testing",
    title: "Custom DC Test Scope",
    summary: "Turn a specialized DC charger request into a reviewable specification that separates standard equipment functions from fixtures, software and external power integration.",
    requirements: [
      "Describe charger variants, intended checks, operating ranges and explicit exclusions.",
      "Assign custom fixtures, control interfaces, protection and external equipment ownership.",
      "Define acceptance checks, evidence formats and configuration-change responsibilities.",
    ],
    reviewOutput: "A custom-scope matrix with feasibility questions and an acceptance review outline.",
    planningNote: "Requested custom functions remain proposals until engineering review confirms the configuration and scope.",
    relatedHref: "/resources/choose-ev-charger-test-system",
    relatedLabel: "Test system configuration guide",
    source: {
      publisher: "SAITER",
      title: "Customized DC charger equipment for an unnamed testing organization",
      summary: "SAITER presents customized DC charger equipment for an unnamed third-party testing organization. Its description covers electrical behavior and safety checks at a general level, without disclosing the custom arrangement, executed procedures or measured outcomes.",
      scopeNote: "Supplier-published case, not evidence of an APEX delivery. Implementation conditions, customer details and acceptance evidence are not independently verified.",
    },
  },
  {
    id: "embedded-end-of-line-planning",
    categoryId: "audience-charger-manufacturing",
    title: "Embedded End-of-Line Planning",
    summary: "Position charger checks within the production flow while keeping identity, program selection and failure handling traceable at the station boundary.",
    requirements: [
      "Map product variants and likely assembly or configuration faults to station checks.",
      "Define fixtures, operator steps, reference checks and the target cycle-time budget.",
      "Specify serial-number records, retest authorization and proposed manufacturing data interfaces.",
    ],
    reviewOutput: "A station workflow and traceability schema with controlled failure and retest paths.",
    planningNote: "Cycle time, data-system integration and automatic operation are project requirements to review, not demonstrated production results.",
    relatedHref: "/applications/evse-production-end-of-line-architecture",
    relatedLabel: "Production test reference architecture",
    source: {
      publisher: "SAITER",
      title: "Production-line embedded charger test system",
      image: { src: "/assets/library/case-14-system.png", alt: "Test stations arranged along an assembly line", width: 1000, height: 626 },
      summary: "SAITER describes embedding charger checks within a manufacturing line and linking records to batches or serial numbers. The article discusses traceability and integration concepts but does not report a measured cycle time, accuracy or acceptance outcome.",
      scopeNote: "Supplier-published case, not an APEX delivery. Automation, AI and data-system claims are not independently verified production capabilities.",
    },
  },
  {
    id: "vehicle-interaction-session-plan",
    categoryId: "audience-vehicle-engineering",
    title: "Vehicle Charging Interaction Plan",
    summary: "Plan vehicle-side charging sessions around the interfaces and state transitions under investigation, distinguishing simulated behavior from the actual vehicle implementation.",
    requirements: [
      "Identify the vehicle-side role, AC or DC interface and software configuration.",
      "Select connection, readiness, charging, stop and controlled exception sequences.",
      "Define the messages, pilot states and electrical observations retained for each session.",
    ],
    reviewOutput: "A vehicle-side session matrix with implementation assumptions and evidence requirements.",
    planningNote: "The plan does not establish a vehicle development system offering or compatibility with unreviewed implementations.",
    relatedHref: "/resources/ev-charging-protocol-testing",
    relatedLabel: "Vehicle-charger protocol planning guide",
    source: {
      publisher: "SAITER",
      title: "Electric vehicle interoperability test system",
      summary: "SAITER outlines vehicle-side AC and DC charging sequences and controlled fault simulation for interoperability assessment. The description does not identify a specific customer, protocol revision, installed equipment configuration or executed test results.",
      scopeNote: "Supplier-published application, not an APEX delivery or universal compatibility guarantee. Supported implementations and evidence require separate confirmation.",
    },
  },
  {
    id: "message-validation-planning",
    categoryId: "audience-vehicle-engineering",
    title: "Charging Message Validation Plan",
    summary: "Translate communication questions into explicit message conditions, state dependencies and expected reactions so that an unexpected response can be reviewed in context.",
    requirements: [
      "Identify protocol editions, message fields and implementation options in scope.",
      "Define valid references, controlled invalid conditions and timing assumptions.",
      "Retain message captures, session state and the reason behind each planned verdict.",
    ],
    reviewOutput: "A message-validation worksheet with reproducible conditions and reviewable verdict rules.",
    planningNote: "Message checks cover the selected cases only; they do not establish complete protocol conformance or vehicle reliability.",
    relatedHref: "/resources/ev-charging-protocol-testing",
    relatedLabel: "Communication test planning guide",
    source: {
      publisher: "SAITER",
      title: "Electric vehicle communication protocol consistency testing",
      summary: "SAITER discusses checking charging-message formats, instruction handling and error responses for vehicle communication. The unnamed-customer article describes testing aims without publishing a protocol edition, case list, verdict rules or execution records.",
      scopeNote: "Supplier-published case, not an APEX delivery or proven reliability outcome. Protocol scope and actual results are not independently verified.",
    },
  },
  {
    id: "automatic-dc-production-planning",
    categoryId: "audience-charger-manufacturing",
    title: "Automated DC Production Test Planning",
    summary: "Define what a DC charger station should control, measure and record before selecting an automation approach. Keep fast line decisions separate from detailed fault diagnosis.",
    requirements: [
      "Map variants to test programs, fixtures, electrical limits and required operator actions.",
      "Set station preconditions, sequence dependencies, stop rules and diagnostic routing.",
      "Specify measurements, software versions, results and authorized retests in the data record.",
    ],
    reviewOutput: "An automation requirement matrix with station boundaries and serial-number record fields.",
    planningNote: "Automatic adjustment, cycle time and manufacturing-system interfaces require separate configuration and acceptance review.",
    relatedHref: "/resources/evse-end-of-line-testing",
    relatedLabel: "End-of-line testing planning guide",
    source: {
      publisher: "SAITER",
      title: "Automated full-function DC charging production-line testing",
      summary: "SAITER describes automated DC charger production checks involving voltage, current, power and report generation. The unnamed-customer page does not specify a delivered station configuration, measured line throughput or quantitative improvement supported by execution records.",
      scopeNote: "Supplier-published case, not an APEX delivery. Automatic adjustment, throughput and integration scope require independent configuration and outcome confirmation.",
    },
  },
  {
    id: "ultrafast-charging-load-planning",
    categoryId: "audience-charger-manufacturing",
    title: "Ultrafast Charging Load Planning",
    summary: "Review the energy path for a proposed ultrafast charging test, separating the requested operating envelope from the ratings and limitations of each connected component.",
    requirements: [
      "State simultaneous voltage and current, peak and continuous duties, and transition profiles.",
      "Review load capacity, supply, regeneration permissions, cables, cooling and protective controls.",
      "Define measurement points, operating limits and safe termination conditions.",
    ],
    reviewOutput: "A load-path and facility checklist with duty limits and unresolved equipment questions.",
    planningNote: "Ultrafast is a planning context, not a claimed power rating or an observed test result; the complete energy path needs review.",
    relatedHref: "/resources/regenerative-load-considerations",
    relatedLabel: "High-power load planning guide",
    source: {
      publisher: "SAITER",
      title: "Customized DC supercharging test system for an unnamed enterprise",
      summary: "SAITER introduces a customized supercharging test arrangement associated with an unnamed Changshu enterprise, mentioning instruments, controllers, power equipment and analysis software. The description does not establish its actual topology, rated duty or measured results.",
      scopeNote: "Supplier-published case, not an APEX delivery or claimed power capability. Equipment ratings, operating conditions and acceptance evidence are not independently verified.",
    },
  },
];
