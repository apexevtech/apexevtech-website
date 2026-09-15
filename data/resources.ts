export type ResourceSection = { heading: string; paragraphs: string[]; checklist?: string[] };
export type Resource = {
  slug: string; title: string; description: string; topic: string;
  intent: "selection" | "comparison" | "technical" | "process";
  publishedAt: string; modifiedAt: string; summaryAnswer: string;
  sections: ResourceSection[]; faqs: Array<{ question: string; answer: string }>;
  relatedProductSlugs: string[]; relatedResourceSlugs: string[];
};

const publishedAt = "2026-08-28";
const modifiedAt = "2026-09-15";

export const resources: Resource[] = [
  {
    slug: "choose-ev-charger-test-system",
    title: "How to Choose an EV Charger Test System",
    description: "A practical framework for matching charger interfaces, standards, electrical ranges and evidence requirements to a test platform.",
    topic: "EV charger test system selection",
    intent: "selection",
    publishedAt, modifiedAt,
    summaryAnswer: "Choose an EV charger test system by defining the connector, communication standard, voltage and current range, test environment and required evidence before comparing equipment. The correct platform is the one that reproduces the target charging workflow and records the measurements your team must review.",
    sections: [
      { heading: "Define the charger and target market", paragraphs: [
        "Start with the actual charger interface rather than a general request for an EVSE tester. Record whether the equipment is AC or DC, the vehicle-side connector, the markets where it will be used and the standards named in the test plan. A Type 2 AC charger, a GB/T DC charger and a CCS2 high-power charger require different pilot circuits, communication stacks and connection ratings.",
        "Then document the maximum operating voltage and current, expected charging sequence and any unusual site conditions. These values determine the safe connection envelope and whether the tester can work directly with the charger or must coordinate with external sources, loads or measurement instruments.",
      ], checklist: ["Identify AC or DC and the exact connector", "List target-market standards", "Record maximum voltage and current"] },
      { heading: "Separate functional checks from diagnostic evidence", paragraphs: [
        "A pass or fail result is not the same as diagnostic evidence. Development teams may need message capture, waveform acquisition and adjustable fault simulation, while field teams may prioritize portability, fast setup and clear acceptance records. Certification preparation can require repeatable sequences and traceable exports that are unnecessary for a basic commissioning check.",
        "Ask which signals must be observed and which results must be retained. Charging voltage, current, energy, control-pilot state, CAN or PLC messages and safety responses should be listed individually so that optional functions are not mistaken for standard coverage.",
      ] },
      { heading: "Validate the proposed configuration", paragraphs: [
        "Before ordering, review a configuration against one representative charger and one representative test case. Confirm connector ratings, communication versions, measurement accuracy, included software, report formats and external-load requirements. This acceptance review is more reliable than comparing model names alone and gives both the supplier and engineering team a measurable boundary for delivery.",
      ], checklist: ["Review one representative test sequence", "Confirm included and optional modules", "Agree on evidence and export formats"] },
    ],
    faqs: [
      { question: "Can one system test both AC and DC chargers?", answer: "An integrated laboratory can combine AC and DC modules, but the connectors, communication methods and power paths remain different. Confirm each interface and test function separately." },
      { question: "What information should be sent with a quotation request?", answer: "Include charger type, connector, target standards, voltage and current range, laboratory or field use, required fault simulations and the reports or raw data your team must retain." },
    ],
    relatedProductSlugs: ["ast-9000", "st-hcdc-hpc", "st-hcac-gb-ua-ea"],
    relatedResourceSlugs: ["evse-test-plan-checklist", "integrated-vs-portable-test-systems", "prepare-ev-charger-standards-validation"],
  },
  {
    slug: "ac-vs-dc-evse-testing",
    title: "AC vs DC EVSE Testing: What Changes?",
    description: "Compare the electrical interfaces, protocol workflows and field constraints that shape AC and DC charger validation.",
    topic: "AC and DC EVSE testing",
    intent: "comparison",
    publishedAt, modifiedAt,
    summaryAnswer: "AC EVSE testing focuses heavily on control-pilot states, proximity detection, switching and metering, while DC charger testing adds high-voltage output control, digital charging communication, insulation behavior and an external power-absorption path. The test plan and equipment must follow the selected connector and regional standard.",
    sections: [
      { heading: "Electrical and connection differences", paragraphs: [
        "In AC charging, the vehicle receives AC power and controls charging through pilot and proximity circuits. Tests commonly examine CP states, PP or CS resistance, contactor behavior, phase configuration, protective-earth conditions and energy measurement. The tester must reproduce vehicle-side pilot states without obscuring the charger response.",
        "A DC charger supplies controlled DC power directly to the vehicle interface. The test setup must account for output voltage, available current, pre-charge behavior, insulation checks and the path used to absorb charging energy. Connector ratings and safe switching procedures therefore become central parts of the equipment configuration.",
      ] },
      { heading: "Communication and fault workflow", paragraphs: [
        "AC workflows may use analog control-pilot signaling alone or combine it with higher-level communication, depending on the standard and application. DC charging normally depends on a digital exchange between the charger and a simulated vehicle controller. Engineers need synchronized views of requested values, measured output, state transitions and relevant message traffic.",
        "Fault tests also differ. AC teams may vary pilot resistance or interrupt protective conductors, while DC teams may examine communication timeouts, insulation faults, voltage mismatch and charging termination. A useful test case defines the injected condition, expected charger response and evidence to retain.",
      ], checklist: ["Map pilot and communication states", "Define safe fault insertion", "Synchronize messages with electrical measurements"] },
      { heading: "Choose equipment by workflow", paragraphs: [
        "Use a dedicated AC tester when control-pilot, metering and regional socket coverage are the primary tasks. Choose a DC platform when BMS or EVCC simulation, higher-voltage measurement and external-load coordination are required. A combined laboratory is appropriate when the same team must execute repeatable tests across both categories, but each module should still have a clear acceptance boundary.",
      ] },
    ],
    faqs: [
      { question: "Is DC charger testing always a high-power test?", answer: "No. Communication, pilot, insulation and low-current sequence checks can be performed without a full-power run, but the connection ratings and energy path must still match the planned test." },
      { question: "Can an AC tester validate a DC connector?", answer: "No. AC and DC interfaces use different power paths and may use different communication methods. Use equipment configured for the exact connector and standard." },
    ],
    relatedProductSlugs: ["st-hcac-gb-ua-ea", "st-hcdc-hpc", "st-9980ea-hpc"],
    relatedResourceSlugs: ["choose-ev-charger-test-system", "ev-charging-protocol-testing", "regenerative-load-considerations"],
  },
  {
    slug: "ev-charging-protocol-testing",
    title: "EV Charging Protocol Testing and Signal Diagnosis",
    description: "A structured workflow for capturing charging messages, pilot signals and fault conditions during engineering diagnosis.",
    topic: "EV charging protocol diagnosis",
    intent: "technical",
    publishedAt, modifiedAt,
    summaryAnswer: "Protocol testing should connect each communication event to the charger state and measured electrical response. Build a repeatable timeline from connection and initialization through parameter exchange, energy transfer and termination, then inject one fault at a time and retain the raw messages needed to explain the result.",
    sections: [
      { heading: "Build a synchronized charging timeline", paragraphs: [
        "Begin by recording the physical connection, pilot state and communication startup. For CAN-based or PLC-based charging, capture the raw traffic together with timestamps and charger measurements. A decoded message table is useful, but it should not replace the original data because timing, repetition and malformed fields can explain behavior that a summary hides.",
        "Mark the transition into parameter negotiation, readiness, current demand, active charging and shutdown. Compare requested voltage and current with charger output and tester measurements at each stage. This makes it possible to distinguish a communication disagreement from an electrical response problem.",
      ], checklist: ["Retain raw messages and timestamps", "Record pilot and contactor transitions", "Align requests with measured output"] },
      { heading: "Test faults without losing context", paragraphs: [
        "A protocol fault test should change one controlled condition and define the expected recovery or shutdown behavior before execution. Examples include a delayed message, an out-of-range parameter, a communication interruption or a simulated insulation condition. Avoid changing several signals together because the resulting shutdown cannot be attributed confidently.",
        "Capture data before the injection, during the abnormal condition and after recovery. The surrounding messages often show whether the charger detected the intended fault, reacted to a secondary condition or continued using stale state information.",
      ] },
      { heading: "Turn captures into repeatable evidence", paragraphs: [
        "Store the tester configuration, software version, charger identity, standard version and test-case revision with every capture. A useful engineering report links the test step to message evidence, electrical measurements and the observed charger response. When a failure is reproduced, the same setup should produce a comparable timeline rather than a screenshot without context.",
      ], checklist: ["Record protocol and software versions", "Link raw evidence to each test step", "Repeat the sequence after corrective action"] },
    ],
    faqs: [
      { question: "Is decoded protocol data enough for fault analysis?", answer: "Not always. Keep raw traffic and timestamps because message timing, repetition and encoding details may be needed to explain a failure." },
      { question: "Should protocol and waveform data be captured together?", answer: "When the fault involves pilot behavior, switching or output response, synchronized protocol and waveform evidence makes the diagnosis much stronger." },
    ],
    relatedProductSlugs: ["ast-9000", "st-9980ea-hpc", "st-6680ca-dc"],
    relatedResourceSlugs: ["prepare-ev-charger-standards-validation", "evse-test-plan-checklist", "ac-vs-dc-evse-testing"],
  },
  {
    slug: "production-vs-laboratory-validation",
    title: "Production-Line vs Laboratory EV Charger Validation",
    description: "Choose between repeatable end-of-line checks and deeper laboratory investigation without duplicating equipment unnecessarily.",
    topic: "EV charger production and laboratory testing",
    intent: "comparison",
    publishedAt, modifiedAt,
    summaryAnswer: "Production testing should be fast, repeatable and tied to traceable pass or fail limits; laboratory validation should provide wider operating ranges, adjustable faults and detailed diagnostic evidence. Separate these objectives first, then share fixtures, software or instruments only where doing so does not slow production or restrict investigation.",
    sections: [
      { heading: "Design for the decision being made", paragraphs: [
        "An end-of-line station answers whether a manufactured charger is ready to proceed. Its test sequence should cover critical safety, communication, output and metering checks within a predictable cycle time. Operator steps, fixture identification and automatic result storage matter as much as the range of available functions.",
        "A laboratory answers why a charger behaves in a particular way and whether it remains compliant across boundary conditions. Engineers need adjustable parameters, raw protocol and waveform data, deliberate fault insertion and enough access to change the sequence during investigation.",
      ] },
      { heading: "Define what can be shared", paragraphs: [
        "Common test definitions, connector fixtures and result formats can reduce duplication, but production and laboratory equipment should not be assumed interchangeable. A flexible laboratory setup can be too slow or operator-dependent for a production line, while a fixed production station may hide the diagnostic data needed to investigate a failure.",
        "Create a handoff rule for failed units. The production station should retain the unit identity, failed step, measured values and relevant log segment so the laboratory can reproduce the condition without starting from an incomplete description.",
      ], checklist: ["Set production cycle-time limits", "Define laboratory diagnostic depth", "Create a failed-unit evidence handoff"] },
      { heading: "Validate repeatability and traceability", paragraphs: [
        "For production, run the same reference unit across shifts and confirm stable results, fixture checks and record linkage. For the laboratory, repeat selected boundary and fault cases with saved configurations. Both environments benefit from version-controlled procedures, but their acceptance criteria should reflect the different decisions they support.",
      ] },
    ],
    faqs: [
      { question: "Can one platform serve production and R&D?", answer: "It can share modules or software, but production cycle time and laboratory flexibility should be evaluated separately before choosing a combined architecture." },
      { question: "What should a production failure record contain?", answer: "Keep unit identity, test configuration, failed step, measured values, limits, timestamps and the relevant communication or waveform evidence." },
    ],
    relatedProductSlugs: ["ast-9000", "st-hcdc-hpc", "st-hcac-gb-ua-ea"],
    relatedResourceSlugs: ["evse-test-plan-checklist", "integrated-vs-portable-test-systems", "choose-ev-charger-test-system"],
  },
  {
    slug: "field-commissioning-test-equipment",
    title: "Field Commissioning Test Equipment for EV Chargers",
    description: "Plan portable commissioning work around interoperability, metering, safety simulation and service evidence.",
    topic: "EV charger field commissioning",
    intent: "selection",
    publishedAt, modifiedAt,
    summaryAnswer: "Field commissioning equipment should safely reproduce a vehicle connection, show the charging sequence, measure the values needed for acceptance and preserve evidence that can be reviewed later. Portability matters, but connector coverage, environmental protection, setup checks and a defined external-load plan matter more than case size alone.",
    sections: [
      { heading: "Prepare the site and test boundary", paragraphs: [
        "Confirm the installed charger model, connector, rated output, upstream supply and site access before dispatching equipment. The field team should know whether the work is initial commissioning, periodic inspection, metering verification or fault diagnosis because each objective requires different accessories and evidence.",
        "Document how charging energy will be handled. Some portable testers simulate the vehicle interface but do not contain a high-power load. In that case, plan a compatible resistive, electronic, regenerative or vehicle load and confirm the cables, ratings and site procedure before connection.",
      ], checklist: ["Confirm connector and charger rating", "Define the energy-absorption path", "Check cables, supply and site access"] },
      { heading: "Use a repeatable commissioning sequence", paragraphs: [
        "Start with visual and protective-earth checks, then verify connection states before enabling power transfer. Observe the charger startup sequence, requested and delivered values, metering behavior and normal termination. Record the configuration so another technician can reproduce the same test after maintenance.",
        "For fault diagnosis, capture the normal sequence first and introduce only the condition needed to reproduce the complaint. Portable message capture, pilot measurement and configurable fault simulation can reduce repeated vehicle tests and make intermittent behavior easier to explain.",
      ] },
      { heading: "Leave evidence that supports handover", paragraphs: [
        "A commissioning record should identify the site, charger, connector, tester, software version and procedure. Include measured values, relevant logs, photos where appropriate and clear pass or fail limits. If a test cannot be completed because the site lacks a required load or supply condition, record that limitation instead of treating a partial connection as full acceptance.",
      ], checklist: ["Identify every charger and instrument", "Export measurements and communication logs", "Record limitations and follow-up actions"] },
    ],
    faqs: [
      { question: "Does a portable charger tester include a power load?", answer: "Not necessarily. Many portable testers provide the vehicle interface and measurement functions but require a separate load for sustained power tests. Confirm the exact configuration." },
      { question: "What is the minimum useful field record?", answer: "Record site and charger identity, test configuration, measured values, result limits, relevant logs and any conditions that prevented completion." },
    ],
    relatedProductSlugs: ["st-9980a-pro", "st-9980ea-hpc", "st-6680b-plus", "st-6680ca-dc"],
    relatedResourceSlugs: ["integrated-vs-portable-test-systems", "evse-test-plan-checklist", "regenerative-load-considerations"],
  },
  {
    slug: "prepare-ev-charger-standards-validation",
    title: "Preparing for IEC, SAE, NACS and GB/T Validation",
    description: "Organize standards coverage and test evidence before configuring an EV charger validation system.",
    topic: "EV charger standards validation",
    intent: "process",
    publishedAt, modifiedAt,
    summaryAnswer: "Prepare for charger standards validation by fixing the target market, connector, charger type and exact document versions before selecting tests. Build a requirements matrix that maps each applicable clause to a test method, equipment configuration, expected result and retained evidence; do not treat a list of standard names as proof of coverage.",
    sections: [
      { heading: "Freeze the applicable document set", paragraphs: [
        "Regional labels such as IEC, SAE, NACS or GB/T do not define a complete test scope. Record the connector standard, system requirements, communication specification, metering rules and local safety requirements that apply to the charger. Include publication years or revisions because signal definitions and expected sequences can change.",
        "Identify whether the project is formal certification, pre-compliance engineering, customer acceptance or internal regression testing. The same clause can require different evidence and laboratory controls depending on the decision being supported.",
      ], checklist: ["List exact standard numbers and revisions", "Identify market and connector", "Define certification or engineering purpose"] },
      { heading: "Build a traceable requirements matrix", paragraphs: [
        "For each requirement, define the charger state, stimulus, measurement, limit and evidence. Separate communication conformance, interoperability, electrical output, metering and safety behavior so that equipment coverage is visible. Mark any test that requires an external load, programmable source, environmental condition or specialist instrument.",
        "Review the matrix for assumptions. A tester may support a protocol family without including every optional connector, waveform channel, accuracy level or automated case. The configuration should be checked against the planned evidence rather than the product category alone.",
      ] },
      { heading: "Run a representative pre-validation", paragraphs: [
        "Before the full campaign, execute one normal charging sequence and selected boundary or fault cases using the intended report workflow. Confirm that timestamps, raw data, configuration records and result limits are retained. Resolve ambiguous responsibilities between the charger, tester, external load and laboratory before scheduling the complete validation run.",
      ], checklist: ["Execute one end-to-end sequence", "Review exported evidence", "Resolve uncovered equipment or procedure gaps"] },
    ],
    faqs: [
      { question: "Is a supported-standard list enough to select a tester?", answer: "No. Confirm the exact revision, connector, test cases, electrical range, optional modules and evidence required by your validation plan." },
      { question: "When should pre-compliance testing begin?", answer: "Begin after the applicable requirements and interfaces are stable enough to create repeatable cases, and before formal testing makes design changes expensive." },
    ],
    relatedProductSlugs: ["ast-9000", "st-hcac-ea-ua-na", "st-9980ea-hpc", "st-9980a-pro"],
    relatedResourceSlugs: ["ev-charging-protocol-testing", "evse-test-plan-checklist", "choose-ev-charger-test-system"],
  },
  {
    slug: "regenerative-load-considerations",
    title: "Regenerative Load Considerations for Charger Testing",
    description: "Understand when an external or regenerative load belongs in a charger test architecture and what to specify.",
    topic: "regenerative loads for charger testing",
    intent: "technical",
    publishedAt, modifiedAt,
    summaryAnswer: "Use a regenerative load when the test program requires sustained charger power and returning energy to the facility can reduce heat and operating cost. Specify voltage, current, power, dynamic response, grid connection, protection and tester control separately; a charger interface simulator and a power load perform different jobs.",
    sections: [
      { heading: "Separate interface simulation from power absorption", paragraphs: [
        "A charger tester may reproduce the vehicle connector, pilot state and communication behavior without absorbing full charging power. The load provides the electrical path for energy transfer. Treating these as separate functions makes ratings, safety responsibilities and integration requirements clearer.",
        "Determine whether the planned cases need brief low-power sequence checks, steady full-power operation, programmable current demand or dynamic transitions. This duty profile sets the required load power, cooling approach and control behavior more accurately than the charger's nameplate rating alone.",
      ] },
      { heading: "Specify the regenerative power path", paragraphs: [
        "A regenerative load returns absorbed energy to the facility supply rather than dissipating all of it as heat. Confirm the permitted grid connection, return-power limits, power quality, isolation, emergency shutdown and facility protection. Site approval is part of the test architecture, not an accessory decision after delivery.",
        "Check DC voltage and current range across the complete operating envelope, including low-voltage startup and any current-limited regions. Also define command update rates and measurement synchronization when the test sequence changes demand dynamically.",
      ], checklist: ["Define voltage, current and continuous power", "Confirm facility regeneration approval", "Specify protection and emergency shutdown"] },
      { heading: "Integrate control and evidence", paragraphs: [
        "Decide which system commands the load and how the charger request, load demand and measured output will be synchronized. For automated testing, store the load setpoints and actual values with protocol and tester data. Validate one normal and one protective shutdown sequence before high-power campaigns so every component reaches a safe state when communication or facility power is interrupted.",
      ], checklist: ["Assign control ownership", "Synchronize setpoints and measurements", "Verify protective shutdown behavior"] },
    ],
    faqs: [
      { question: "Is a regenerative load included in a portable charger tester?", answer: "Usually it is a separate system. Confirm the tester's external-load interface and the load ratings, controls and protection required for the planned power tests." },
      { question: "When is a resistive load sufficient?", answer: "A resistive load may suit limited fixed-point tests when heat, efficiency and dynamic control are acceptable. Sustained or automated programs may benefit from an electronic or regenerative load." },
    ],
    relatedProductSlugs: ["st-hcdc-hpc", "st-9980a-pro", "st-9980ea-hpc", "ast-9000"],
    relatedResourceSlugs: ["field-commissioning-test-equipment", "ac-vs-dc-evse-testing", "choose-ev-charger-test-system"],
  },
  {
    slug: "integrated-vs-portable-test-systems",
    title: "Integrated vs Portable EV Charger Test Systems",
    description: "Compare laboratory platforms and portable testers by workflow, coverage, repeatability and deployment needs.",
    topic: "integrated and portable EV charger testers",
    intent: "comparison",
    publishedAt, modifiedAt,
    summaryAnswer: "Choose an integrated system when repeatable multi-instrument workflows, automation and laboratory traceability are primary. Choose a portable tester when equipment must travel to chargers for commissioning or fault isolation. Many teams need both, with compatible procedures and evidence formats rather than one device forced into every environment.",
    sections: [
      { heading: "Compare the operating environment", paragraphs: [
        "An integrated laboratory can coordinate interface simulators, programmable power equipment, loads, waveform instruments and automated reporting in a controlled space. It is suited to development, standards preparation and repeated boundary testing where setup stability and detailed access matter.",
        "A portable tester brings vehicle simulation, measurement and diagnostic functions to an installed charger. Field value depends on rugged transport, clear connection checks, usable controls and fast evidence export. The equipment still needs a planned power path and accessories matched to the charger rating.",
      ] },
      { heading: "Evaluate coverage and repeatability", paragraphs: [
        "Integrated systems usually offer wider configuration options and stronger automation, but require facility planning and trained operation. Portable equipment can shorten field diagnosis and commissioning, but may rely on external loads or provide fewer synchronized measurement channels. Compare the actual test cases instead of using size as a proxy for capability.",
        "Repeatability also depends on procedures and records. Save configurations, identify cables and adapters, define connection checks and use consistent result formats. A portable sequence can be repeatable, and a large laboratory can still produce inconsistent evidence if setup changes are not controlled.",
      ], checklist: ["Compare required cases and optional modules", "Plan facility or site connections", "Define common evidence formats"] },
      { heading: "Create a laboratory-to-field workflow", paragraphs: [
        "Use the laboratory to develop reference sequences and investigate boundary behavior, then reduce those sequences to field acceptance steps where appropriate. When a field failure needs deeper analysis, retain enough configuration and log data to reproduce it in the laboratory. This division avoids overloading field work while keeping diagnostic escalation traceable.",
      ] },
    ],
    faqs: [
      { question: "Is a portable tester suitable for certification work?", answer: "It can support preparation and selected measurements, but formal certification scope depends on the required methods, accuracy, traceability and laboratory controls." },
      { question: "Does an integrated system replace field testing?", answer: "No. Laboratory coverage cannot reproduce every installed-site condition, so commissioning and post-installation verification remain separate activities." },
    ],
    relatedProductSlugs: ["ast-9000", "st-9980a-pro", "st-6680b-plus", "st-9980ea-hpc"],
    relatedResourceSlugs: ["field-commissioning-test-equipment", "production-vs-laboratory-validation", "choose-ev-charger-test-system"],
  },
  {
    slug: "evse-test-plan-checklist",
    title: "EVSE Test Plan Checklist for Engineering Teams",
    description: "A concise checklist for turning a charger validation brief into measurable test cases and recorded evidence.",
    topic: "EVSE test planning",
    intent: "process",
    publishedAt, modifiedAt,
    summaryAnswer: "An EVSE test plan should define the charger and interface, applicable requirements, operating envelope, test states, fault conditions, instruments, limits and retained evidence. Each case needs a reproducible setup, explicit stimulus, expected response and result rule so another engineer can execute and review it consistently.",
    sections: [
      { heading: "Document scope and configuration", paragraphs: [
        "Identify the charger model, hardware and software versions, connector, AC or DC rating and target market. List the exact standards and customer requirements in scope. Record the tester, cables, adapters, external load, programmable sources and measurement instruments needed for each configuration.",
        "Define environmental and facility assumptions such as supply limits, grounding, network access and the permitted energy path. Mark exclusions clearly. A test plan is more useful when it states what will not be verified than when it uses broad language that cannot be tied to evidence.",
      ], checklist: ["Identify hardware and software versions", "List standards and customer requirements", "Record instruments, fixtures and exclusions"] },
      { heading: "Write measurable test cases", paragraphs: [
        "Each case should state its initial charger condition, connection state, parameter settings, operator or automated action, expected response and acceptance limits. Separate normal charging, boundary values, communication behavior, metering checks and safety faults so a failure has a clear source.",
        "Include timing where sequence behavior matters. Specify which messages, waveforms, measured values, screenshots or reports must be retained. Use stable case identifiers that appear in both the procedure and result export, allowing findings to be traced without manually matching descriptions.",
      ] },
      { heading: "Review execution and change control", paragraphs: [
        "Run a small pilot set before the full campaign to identify ambiguous instructions, unavailable ranges and missing evidence. Require reviewers to check both the result and the supporting record. When charger firmware, tester software or a procedure changes, record the revision and decide which cases must be repeated rather than silently combining incompatible results.",
      ], checklist: ["Pilot representative normal and fault cases", "Review evidence with results", "Version procedures and rerun affected cases"] },
    ],
    faqs: [
      { question: "How detailed should an EVSE test case be?", answer: "It should allow a second trained engineer to reproduce the setup, stimulus and acceptance decision using the specified equipment and retained evidence." },
      { question: "Should every firmware change trigger a complete retest?", answer: "Use impact analysis to select affected cases, but record the firmware change and rationale so the retained results remain traceable." },
    ],
    relatedProductSlugs: ["ast-9000", "st-hcdc-hpc", "st-hcac-gb-ua-ea", "st-9980a-pro"],
    relatedResourceSlugs: ["prepare-ev-charger-standards-validation", "ev-charging-protocol-testing", "production-vs-laboratory-validation"],
  },
];
