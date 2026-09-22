export type ResourceSection = { heading: string; paragraphs: string[]; checklist?: string[] };
export type Resource = {
  slug: string; title: string; description: string; topic: string;
  intent: "selection" | "comparison" | "technical" | "process";
  publishedAt: string; modifiedAt: string; summaryAnswer: string;
  sections: ResourceSection[]; faqs: Array<{ question: string; answer: string }>;
  relatedProductSlugs: string[]; relatedResourceSlugs: string[];
};

const publishedAt = "2026-08-28";
const modifiedAt = "2026-09-18";

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
    relatedResourceSlugs: ["evse-test-plan-checklist", "integrated-vs-portable-test-systems", "prepare-ev-charger-standards-validation", "ccs2-dc-fast-charger-testing", "gbt-dc-charger-conformance-testing"],
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
    relatedProductSlugs: ["st-hcac-gb-ua-ea", "st-hcdc-hpc", "st-9980ea-hpc", "st-6680ea-ac", "st-6680ua-ac", "st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["choose-ev-charger-test-system", "ev-charging-protocol-testing", "regenerative-load-considerations", "type-2-ac-evse-testing", "ccs2-dc-fast-charger-testing"],
  },
  {
    slug: "ev-charging-protocol-testing",
    title: "EV Charging Protocol Testing and Signal Diagnosis",
    description: "Plan EVSE communication protocol tests with CAN or PLC capture, pilot signals, charging-state checks and repeatable fault-diagnosis evidence.",
    topic: "EV charging protocol diagnosis",
    intent: "technical",
    publishedAt, modifiedAt,
    summaryAnswer: "Protocol testing should connect each communication event to the charger state and measured electrical response. Build a repeatable timeline from connection and initialization through parameter exchange, energy transfer and termination, then inject one fault at a time and retain the raw messages needed to explain the result.",
    sections: [
      { heading: "Select the interface and communication test scope", paragraphs: [
        "EV charger communication protocol testing starts with the connector and protocol revision. GB/T and CHAdeMO workflows can involve CAN communication; CCS workflows can involve PLC communication. Specify the actual charger implementation, required messages and test cases rather than assuming one analyzer covers every interface.",
        "Use the product configuration as the equipment boundary: AST-9000 provides an integrated laboratory route, ST-9980EA-HPC is a portable CCS2 option with optional PLC capture, and ST-6680CA-DC addresses CHAdeMO testing. Confirm capture, decoding, fault-injection and measurement options separately with the engineer.",
      ], checklist: ["Identify connector and protocol revision", "Confirm CAN or PLC capture requirements", "Define normal, timeout and termination cases"] },
      { heading: "Build a synchronized charging timeline", paragraphs: [
        "Begin by recording the physical connection, pilot state and communication startup. For CAN-based or PLC-based charging, capture the raw traffic together with timestamps and charger measurements. A decoded message table is useful, but it should not replace the original data because timing, repetition and malformed fields can explain behavior that a summary hides.",
        "Mark the transition into parameter negotiation, readiness, current demand, active charging and shutdown. Compare requested voltage and current with charger output and tester measurements at each stage. This makes it possible to distinguish a communication disagreement from an electrical response problem.",
      ], checklist: ["Retain raw messages and timestamps", "Record pilot and contactor transitions", "Align requests with measured output"] },
      { heading: "Test faults without losing context", paragraphs: [
        "A protocol fault test should change one controlled condition and define the expected recovery or shutdown behavior before execution. Examples include a delayed message, an out-of-range parameter, a communication interruption or a simulated insulation condition. Avoid changing several signals together because the resulting shutdown cannot be attributed confidently.",
        "Capture data before the injection, during the abnormal condition and after recovery. The surrounding messages often show whether the charger detected the intended fault, reacted to a secondary condition or continued using stale state information.",
      ] },
      { heading: "Example: diagnose a charger that stops during negotiation", paragraphs: [
        "Save a normal reference session, then reproduce the stopped session using the same charger firmware and tester configuration. Identify the last completed charging state and compare the parameter exchange, pilot behavior and measured output with the reference.",
        "If a communication timeout is suspected, check the raw message interval and the charger response before drawing a conclusion. If messages continue but power transfer does not begin, review readiness conditions and electrical measurements. Set pass or fail limits from the applicable test procedure; a missing charging session alone does not identify the cause.",
      ], checklist: ["Save a normal reference capture", "Find the first state that differs", "Retest after the corrective change"] },
      { heading: "Turn captures into repeatable evidence", paragraphs: [
        "Store the tester configuration, software version, charger identity, standard version and test-case revision with every capture. A useful engineering report links the test step to message evidence, electrical measurements and the observed charger response. When a failure is reproduced, the same setup should produce a comparable timeline rather than a screenshot without context.",
      ], checklist: ["Record protocol and software versions", "Link raw evidence to each test step", "Repeat the sequence after corrective action"] },
    ],
    faqs: [
      { question: "Is decoded protocol data enough for fault analysis?", answer: "Not always. Keep raw traffic and timestamps because message timing, repetition and encoding details may be needed to explain a failure." },
      { question: "Should protocol and waveform data be captured together?", answer: "When the fault involves pilot behavior, switching or output response, synchronized protocol and waveform evidence makes the diagnosis much stronger." },
    ],
    relatedProductSlugs: ["ast-9000", "st-9980ea-hpc", "st-6680ca-dc", "st-6680ea-dc", "st-6680ua-dc"],
    relatedResourceSlugs: ["prepare-ev-charger-standards-validation", "evse-test-plan-checklist", "ac-vs-dc-evse-testing", "ccs2-dc-fast-charger-testing", "gbt-dc-charger-conformance-testing"],
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
    relatedResourceSlugs: ["evse-test-plan-checklist", "integrated-vs-portable-test-systems", "choose-ev-charger-test-system", "evse-end-of-line-testing"],
  },
  {
    slug: "field-commissioning-test-equipment",
    title: "Field Commissioning Test Equipment for EV Chargers",
    description: "Plan EVSE testing after installation: select portable AC/DC charger equipment, confirm the external load and record commissioning and acceptance evidence.",
    topic: "EV charger field commissioning",
    intent: "selection",
    publishedAt, modifiedAt,
    summaryAnswer: "Field commissioning equipment should safely reproduce a vehicle connection, show the charging sequence, measure the values needed for acceptance and preserve evidence that can be reviewed later. Portability matters, but connector coverage, environmental protection, setup checks and a defined external-load plan matter more than case size alone.",
    sections: [
      { heading: "Prepare the site and test boundary", paragraphs: [
        "Confirm the installed charger model, connector, rated output, upstream supply and site access before dispatching equipment. The field team should know whether the work is initial commissioning, periodic inspection, metering verification or fault diagnosis because each objective requires different accessories and evidence.",
        "Document how charging energy will be handled. Some portable testers simulate the vehicle interface but do not contain a high-power load. In that case, plan a compatible resistive, electronic, regenerative or vehicle load and confirm the cables, ratings and site procedure before connection.",
      ], checklist: ["Confirm connector and charger rating", "Define the energy-absorption path", "Check cables, supply and site access"] },
      { heading: "Match portable equipment to the installed charger", paragraphs: [
        "For GB/T DC sites, compare ST-9980A+ Pro; for CCS2 DC sites, compare ST-9980EA-HPC; for CHAdeMO sites, compare ST-6680CA-DC. For AC EVSE work, choose an AC tester configured for the installed connector and required measurements. These are different equipment configurations, not interchangeable adapters.",
        "Separate vehicle-interface simulation from sustained power testing. ST-9980A+ Pro has no built-in load and supports an external load up to 250 A. Confirm each selected tester's ratings, load interface, accessories and optional metering or protocol modules before dispatch.",
      ], checklist: ["Match AC or DC and the installed connector", "Confirm tester and external-load ratings", "List required measurement and software options"] },
      { heading: "Use a repeatable commissioning sequence", paragraphs: [
        "Start with visual and protective-earth checks, then verify connection states before enabling power transfer. Observe the charger startup sequence, requested and delivered values, metering behavior and normal termination. Record the configuration so another technician can reproduce the same test after maintenance.",
        "For fault diagnosis, capture the normal sequence first and introduce only the condition needed to reproduce the complaint. Portable message capture, pilot measurement and configurable fault simulation can reduce repeated vehicle tests and make intermittent behavior easier to explain.",
      ] },
      { heading: "EVSE testing after commissioning or maintenance", paragraphs: [
        "Keep the original acceptance record as a reference. After installation changes, repair or firmware updates, repeat the affected connection, startup, power-transfer and termination checks using a versioned procedure. Identify any change in the supply, connector, charger firmware or tester configuration.",
        "Create a separate record for each connector. Retain requested and measured output, relevant communication logs and the result of each defined check. Escalate unexplained differences with the original and new captures so the service or laboratory team can reproduce the condition.",
      ], checklist: ["Compare against the acceptance baseline", "Record changes and affected test cases", "Track unresolved findings through retest"] },
      { heading: "Leave evidence that supports handover", paragraphs: [
        "A commissioning record should identify the site, charger, connector, tester, software version and procedure. Include measured values, relevant logs, photos where appropriate and clear pass or fail limits. If a test cannot be completed because the site lacks a required load or supply condition, record that limitation instead of treating a partial connection as full acceptance.",
      ], checklist: ["Identify every charger and instrument", "Export measurements and communication logs", "Record limitations and follow-up actions"] },
    ],
    faqs: [
      { question: "Does a portable charger tester include a power load?", answer: "Not necessarily. Many portable testers provide the vehicle interface and measurement functions but require a separate load for sustained power tests. Confirm the exact configuration." },
      { question: "What is the minimum useful field record?", answer: "Record site and charger identity, test configuration, measured values, result limits, relevant logs and any conditions that prevented completion." },
    ],
    relatedProductSlugs: ["st-9980a-pro", "st-9980ea-hpc", "st-6680b-plus", "st-6680ca-dc", "st-6680ea-ac", "st-6680ua-ac", "st-6680ua-dc"],
    relatedResourceSlugs: ["integrated-vs-portable-test-systems", "evse-test-plan-checklist", "regenerative-load-considerations", "post-installation-evse-testing", "type-2-ac-evse-testing"],
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
    relatedResourceSlugs: ["ev-charging-protocol-testing", "evse-test-plan-checklist", "choose-ev-charger-test-system", "ccs2-dc-fast-charger-testing", "gbt-dc-charger-conformance-testing"],
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
    relatedProductSlugs: ["st-hcdc-hpc", "st-9980a-pro", "st-9980ea-hpc", "ast-9000", "st-6680ea-dc"],
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
  {
    slug: "ccs2-dc-fast-charger-testing",
    title: "CCS2 DC Fast Charger Testing: Interface, PLC and Load Planning",
    description: "Plan CCS2 DC fast charger tests around connector ratings, PLC communication, ISO 15118 or DIN workflows, external loads and recorded evidence.",
    topic: "CCS2 DC fast charger testing",
    intent: "technical",
    publishedAt: "2026-09-21",
    modifiedAt: "2026-09-21",
    summaryAnswer: "A CCS2 DC fast charger test setup must combine the correct Combo 2 interface, control-pilot behavior, PLC communication, charger output measurement and a power-absorption path. Confirm the required ISO 15118 or DIN communication version, maximum voltage and current, load arrangement and evidence format before selecting the tester.",
    sections: [
      { heading: "Define the CCS2 charger and communication scope", paragraphs: [
        "Record the charger model, firmware, Combo 2 connector rating and target market before choosing test equipment. CCS2 identifies the physical charging system, but it does not by itself define every communication version, optional function or acceptance limit required by a project.",
        "List whether the work covers basic connection and startup, DIN SPEC 70121 behavior, a specific part and edition of ISO 15118, interoperability diagnosis or a formal conformance program. The tester, PLC module and test cases must support the same protocol scope as the charger under test.",
      ], checklist: ["Confirm Combo 2 connection and cable rating", "Name the protocol and edition in scope", "Record charger firmware and configured options"] },
      { heading: "Separate communication from high-power loading", paragraphs: [
        "The vehicle simulator establishes pilot and high-level communication states, while the external load or laboratory power system absorbs charger output. Verify the tester connection limit separately from the load voltage, current, continuous power, cooling and facility requirements.",
        "Plan normal startup, requested-current changes, charging stop and protective shutdown before applying high power. Synchronize protocol messages, pilot state, voltage, current and load demand so a failed sequence can be traced to communication, power conversion or the test setup.",
      ] },
      { heading: "Retain evidence for diagnosis and comparison", paragraphs: [
        "Save the charger configuration, tester configuration, message trace, key waveform or measured values and result rule for every test. A communication trace without electrical timing can miss contactor or output behavior, while electrical data without the message sequence can hide the reason for a charger decision.",
        "Start with one known-good reference session and one controlled fault. Review the final completed state and the first divergence between sessions before expanding the campaign to boundary conditions or repeated interoperability tests.",
      ], checklist: ["Capture PLC messages and pilot state", "Record synchronized voltage and current", "Keep a known-good reference session"] },
    ],
    faqs: [
      { question: "Does a CCS2 tester include a full-power load?", answer: "Not necessarily. Portable testers commonly simulate the vehicle interface and connect to a separate load. Confirm both the tester connection limit and the external load specification." },
      { question: "Is ISO 15118 testing the same as CCS2 connector testing?", answer: "No. The connector and electrical interface are only part of the scope. ISO 15118 testing addresses defined communication behavior and requires compatible communication hardware, software and test cases." },
    ],
    relatedProductSlugs: ["st-9980ea-hpc", "st-6680ea-dc", "ast-9000"],
    relatedResourceSlugs: ["ev-charging-protocol-testing", "regenerative-load-considerations", "evse-test-plan-checklist"],
  },
  {
    slug: "gbt-dc-charger-conformance-testing",
    title: "GB/T DC Charger Conformance and Interoperability Testing",
    description: "Structure GB/T DC charger testing around the required standard editions, BMS communication, electrical limits, faults and traceable results.",
    topic: "GB/T DC charger testing",
    intent: "technical",
    publishedAt: "2026-09-21",
    modifiedAt: "2026-09-21",
    summaryAnswer: "Plan GB/T DC charger testing by fixing the connector, communication and interoperability standard editions first, then mapping each requirement to a reproducible charger state, BMS message sequence, electrical measurement, fault stimulus and acceptance rule. Do not assume that equipment supporting one GB/T revision automatically covers another revision or every certification case.",
    sections: [
      { heading: "Freeze the applicable GB/T editions", paragraphs: [
        "Identify the target-market requirement, charger firmware and exact editions named by the test plan. Connector, charging communication, interoperability and protocol-conformance documents can change on different schedules, so a general statement of GB/T support is not a sufficient test boundary.",
        "Create a requirement matrix that links each case to its source clause, initial state, simulated BMS behavior and expected charger response. Mark optional functions and project-specific limits separately so they are not reported as universal requirements.",
      ], checklist: ["List every applicable document and edition", "Record charger hardware and firmware", "Separate mandatory and optional cases"] },
      { heading: "Exercise the complete charging sequence", paragraphs: [
        "Cover physical connection, handshake, parameter configuration, charging, controlled stop and completion states. Retain CAN messages and timing together with output voltage and current so the reviewer can see whether the charger followed the requested state and electrical limits.",
        "Add controlled abnormal cases only after a repeatable normal session is available. Examples may include message timing deviations, values outside the declared operating envelope, insulation-related conditions or interrupted communication, but the exact stimuli and limits must come from the selected test specification.",
      ] },
      { heading: "Distinguish conformance from interoperability", paragraphs: [
        "Conformance testing checks observed implementation behavior against a defined test suite. Interoperability testing checks whether the charger completes representative sessions with another implementation. Passing one activity increases confidence but does not replace the other.",
        "Use stable case identifiers, exportable traces and explicit pass or fail rules. When firmware or the applicable standard edition changes, perform an impact review and repeat affected cases instead of combining results from incompatible configurations.",
      ], checklist: ["Keep conformance and interoperability results separate", "Use stable case identifiers", "Repeat cases affected by revisions"] },
    ],
    faqs: [
      { question: "Which GB/T version should the tester support?", answer: "It should match the exact connector, communication and test-document editions required by the project. Confirm this against the charger firmware and procurement specification before ordering." },
      { question: "Can vehicle charging prove protocol conformance?", answer: "A successful vehicle session is useful interoperability evidence, but it does not execute a defined conformance suite or provide controlled coverage of boundary and fault cases." },
    ],
    relatedProductSlugs: ["st-9980a-pro", "st-hcdc-hpc", "ast-9000"],
    relatedResourceSlugs: ["prepare-ev-charger-standards-validation", "ev-charging-protocol-testing", "evse-test-plan-checklist"],
  },
  {
    slug: "nacs-ac-evse-testing",
    title: "NACS AC EVSE Testing and SAE J3400 Test Planning",
    description: "Plan NACS AC charger tests around the coupler, pilot states, electrical ratings, safety behavior, measurements and applicable SAE J3400 requirements.",
    topic: "NACS AC EVSE testing",
    intent: "technical",
    publishedAt: "2026-09-21",
    modifiedAt: "2026-09-21",
    summaryAnswer: "A NACS AC EVSE test plan should identify the coupler configuration, SAE J3400 edition, AC voltage and current, pilot-state behavior, switching, fault simulations, metering needs and retained evidence. Because J3400 covers both AC and DC power transfer through the coupler, the test scope must explicitly state that the selected equipment and procedure address the intended AC application.",
    sections: [
      { heading: "Define the NACS AC boundary", paragraphs: [
        "Record the EVSE rating, connector and cable configuration, supply arrangement and the exact SAE J3400 revision required by the project. Do not infer DC charging coverage from an AC tester merely because the same coupler family can support both forms of power transfer.",
        "List normal pilot states, current-capacity signaling, connection detection, switching behavior and any project-specific safety checks. Confirm which measurements are standard in the proposed tester and which require optional acquisition or external instruments.",
      ], checklist: ["State AC scope explicitly", "Confirm J3400 revision", "Record voltage, current and supply arrangement"] },
      { heading: "Test state transitions and abnormal behavior", paragraphs: [
        "Build a reference session from disconnected state through connection, readiness, energized charging and controlled stop. Observe pilot behavior and EVSE output together, because a valid signal state without the expected switching response is not a complete functional result.",
        "Introduce one controlled abnormal condition at a time and verify both the immediate response and recovery path. Document fixtures, resistance settings, timing and acceptance limits so another engineer can repeat the case without relying on operator judgment.",
      ] },
      { heading: "Plan laboratory and field evidence", paragraphs: [
        "Laboratory work may need wider fault adjustment, synchronized waveforms and automated sequences. Field acceptance usually prioritizes safe connection checks, repeatable state transitions, measured output and a concise record tied to the charger identity and firmware.",
        "Use the same case names and result fields where laboratory and field procedures overlap. This makes it easier to escalate an installed-site failure into a controlled reproduction without treating the two environments as equivalent.",
      ], checklist: ["Synchronize pilot and electrical evidence", "Identify charger and firmware", "Use compatible laboratory and field records"] },
    ],
    faqs: [
      { question: "Does every NACS tester support both AC and DC charging?", answer: "No. Confirm the tester's stated AC or DC scope, electrical ratings, communication functions and load arrangement. Coupler compatibility alone does not establish test coverage." },
      { question: "What should be included in a NACS AC inquiry?", answer: "Provide the SAE J3400 revision, EVSE voltage and current, supply phase, required pilot and fault cases, metering accuracy, waveform needs and laboratory or field environment." },
    ],
    relatedProductSlugs: ["st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["type-2-ac-evse-testing", "ac-vs-dc-evse-testing", "evse-test-plan-checklist"],
  },
  {
    slug: "type-2-ac-evse-testing",
    title: "Type 2 AC EVSE Testing for IEC 61851 Workflows",
    description: "Plan Type 2 AC charging station tests for control-pilot states, proximity detection, switching, metering, faults and field acceptance.",
    topic: "Type 2 AC EVSE testing",
    intent: "technical",
    publishedAt: "2026-09-21",
    modifiedAt: "2026-09-21",
    summaryAnswer: "Type 2 AC EVSE testing should verify the configured connector and cable rating, IEC 61851 control-pilot sequence, proximity or cable-coding behavior, EVSE switching, voltage and current measurement, protective responses and recovery. State the applicable standards and evidence requirements explicitly rather than treating every Type 2 charger as the same configuration.",
    sections: [
      { heading: "Record the Type 2 installation and rating", paragraphs: [
        "Identify single- or three-phase operation, socketed or tethered cable arrangement, maximum current and the applicable IEC 61851 and connector requirements. The tester connection, cables, adapters and measurement path must be rated for the planned setup.",
        "Separate functional state testing from energy measurement, waveform capture and installation checks. These functions can require different sensors or instruments even when they are performed during one charging session.",
      ], checklist: ["Record phase and current rating", "Identify socketed or tethered arrangement", "List required measurements and evidence"] },
      { heading: "Verify pilot states and EVSE output", paragraphs: [
        "Exercise the normal control-pilot sequence from connection through readiness, energized charging and stop. Record the simulated vehicle state, pilot observation and EVSE output together so the result proves both signaling and power switching behavior.",
        "Where in scope, vary proximity or cable-coding conditions and controlled pilot faults. Use defined resistance, diode and timing settings with explicit expected responses; do not substitute an informal plug-in check for a repeatable case.",
      ] },
      { heading: "Adapt the procedure for field acceptance", paragraphs: [
        "At an installed charging station, begin with supply, grounding, connector and visual checks before functional tests. Keep the field sequence within the site's permitted current and safety controls, and record the charger identity, firmware, location and tester configuration.",
        "A field tester can support commissioning and fault isolation, but formal conformity assessment may require additional laboratory controls, calibrated instrumentation and test methods. Define the intended claim before deciding which results the field report can support.",
      ], checklist: ["Complete site safety checks first", "Record charger and tester identity", "Keep report claims within the executed scope"] },
    ],
    faqs: [
      { question: "What is the difference between a Type 2 tester and a load?", answer: "The tester simulates vehicle-side connection and pilot behavior and may measure the session. A load provides the electrical path that draws charging power; confirm whether it is internal or external." },
      { question: "Can a portable Type 2 tester be used for commissioning?", answer: "Yes, when its ratings and functions match the site procedure. Confirm supply arrangement, maximum current, required safety checks, evidence and any external load." },
    ],
    relatedProductSlugs: ["st-6680ea-ac", "st-hcac-gb-ua-ea", "st-hcac-ea-ua-na"],
    relatedResourceSlugs: ["field-commissioning-test-equipment", "ac-vs-dc-evse-testing", "post-installation-evse-testing"],
  },
  {
    slug: "evse-end-of-line-testing",
    title: "EVSE End-of-Line Testing for Charger Production",
    description: "Design repeatable EVSE end-of-line tests for identity, safety, charging states, measurements, communication, reports and production traceability.",
    topic: "EVSE end-of-line testing",
    intent: "process",
    publishedAt: "2026-09-21",
    modifiedAt: "2026-09-21",
    summaryAnswer: "An EVSE end-of-line test should confirm unit identity, configuration, essential safety checks, interface states, charging communication, measured output and required fault responses within a controlled cycle time. Automate stable pass or fail limits and store results against the charger serial number while routing deeper diagnosis outside the main production station.",
    sections: [
      { heading: "Convert product requirements into station limits", paragraphs: [
        "Define the charger variants that will use the station, including connector, power class, firmware and market configuration. Map each production check to a measurable stimulus, response and limit rather than copying a broad laboratory validation plan into the line.",
        "Prioritize faults that assembly, wiring, configuration or calibration can introduce. Confirm which checks require energized power, a communication simulator, metering reference, safety instrument or external load, and assign safe ownership of every connection.",
      ], checklist: ["Identify product variants and firmware", "Define numeric pass or fail limits", "Assign fixtures and instruments to each check"] },
      { heading: "Balance coverage with cycle time", paragraphs: [
        "Run fast identity and precondition checks before expensive power or communication sequences so obvious failures exit early. Use stable fixtures, automatic configuration and controlled test data to reduce operator choices and prevent variant settings from carrying into the next unit.",
        "Keep full boundary investigation and long-duration aging outside the end-of-line station unless the production requirement explicitly needs them. The line should detect and contain nonconforming units; engineering diagnosis can use a separate station without blocking takt time.",
      ] },
      { heading: "Build traceability and recovery", paragraphs: [
        "Store serial number, hardware and software versions, fixture and instrument identifiers, test-program version, measurements, limits, result and timestamp. A simple pass record without configuration and measured values is difficult to audit or use for trend detection.",
        "Define retest rules and require a reason for overrides. Review first-pass yield, failures by case and recurrence after repair, then use the data to improve assembly controls and the test sequence instead of treating every failure as an isolated operator event.",
      ], checklist: ["Link results to charger serial number", "Version the test program", "Control retest and override permissions"] },
    ],
    faqs: [
      { question: "Should end-of-line testing repeat every laboratory validation case?", answer: "Usually no. Select production-relevant checks with stable limits and short cycle time, then use laboratory or diagnostic stations for deeper investigation and boundary testing." },
      { question: "What data should an EVSE production test retain?", answer: "Retain unit identity, configuration, test-program version, instrument or fixture identity, measured values, limits, result, timestamp and any authorized retest or override." },
    ],
    relatedProductSlugs: ["ast-9000", "st-hcdc-hpc", "st-hcac-gb-ua-ea", "st-9980a-pro"],
    relatedResourceSlugs: ["production-vs-laboratory-validation", "evse-test-plan-checklist", "choose-ev-charger-test-system"],
  },
  {
    slug: "post-installation-evse-testing",
    title: "Post-Installation EVSE Testing After Commissioning",
    description: "Plan EVSE checks after installation, repair or configuration changes using a safe baseline, functional sequence and traceable site evidence.",
    topic: "EVSE testing after commissioning",
    intent: "process",
    publishedAt: "2026-09-21",
    modifiedAt: "2026-09-21",
    summaryAnswer: "Post-installation EVSE testing should confirm site identity and configuration, supply and grounding preconditions, connector condition, normal charging states, measured output, communication evidence and safe stop behavior. Repeat the baseline after firmware, network, protection, power-module or wiring changes and compare results with the commissioning record.",
    sections: [
      { heading: "Start with site and change history", paragraphs: [
        "Record the charger identifier, location, connector, rating, hardware and firmware, backend configuration and reason for the visit. Review commissioning results and recent repairs before energizing tests so the procedure addresses what changed without losing the original acceptance baseline.",
        "Complete visual, supply, grounding and connector checks required by the site's safety procedure. Confirm that the tester, adapters and external load are rated for the planned session and that the charging area can be controlled during the work.",
      ], checklist: ["Identify the charger and change reason", "Review commissioning baseline", "Complete site safety preconditions"] },
      { heading: "Run a repeatable functional sequence", paragraphs: [
        "Use the same normal connection, readiness, charging and stop sequence for routine comparisons. Record pilot or communication state and measured output at defined points instead of relying only on a successful session indicator.",
        "Add targeted checks for the changed subsystem, such as communication after a firmware update, switching after contactor work or measured output after a power-module replacement. Avoid broad fault injection at a live site unless the approved procedure and equipment explicitly support it.",
      ] },
      { heading: "Close the visit with actionable evidence", paragraphs: [
        "Retain tester configuration, timestamps, measured values, message or waveform evidence where needed, result limits and observed charger alarms. Distinguish a confirmed failure from an inconclusive test caused by site supply, network, load or access limits.",
        "Compare the new record with commissioning or the last known-good visit. If the issue requires laboratory reproduction, preserve the charger firmware, configuration and last completed protocol state so the engineering team can recreate the failure efficiently.",
      ], checklist: ["Save repeatable baseline results", "Record site limitations", "Preserve evidence needed for escalation"] },
    ],
    faqs: [
      { question: "When should EVSE testing be repeated after commissioning?", answer: "Repeat the relevant baseline after changes that can affect charging behavior, including firmware, communication, protection, wiring, connector, contactor or power-module work, and according to the operator's maintenance plan." },
      { question: "Is a successful charging session enough after repair?", answer: "It is useful evidence but may not prove the changed function, measured limits or protective response. Use a defined sequence and retain values tied to the repair scope." },
    ],
    relatedProductSlugs: ["st-9980a-pro", "st-9980ea-hpc", "st-6680b-plus", "st-6680ca-dc", "st-6680ea-ac", "st-6680ea-dc", "st-6680ua-ac", "st-6680ua-dc"],
    relatedResourceSlugs: ["field-commissioning-test-equipment", "evse-test-plan-checklist", "integrated-vs-portable-test-systems"],
  },
];
