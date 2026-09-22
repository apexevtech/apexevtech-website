export type ProductSeoContent = {
  title: string;
  description: string;
  intro: string;
  selection?: {
    workflow: string;
    load: string;
    options: string;
    alternatives: Array<{ slug: string; label: string }>;
  };
  faqs: Array<{ question: string; answer: string }>;
};

export const priorityProductSeo: Record<string, ProductSeoContent> = {
  "st-6680b-plus": {
    title: "ST-6680B+ Portable GB/T AC EV Charger Tester",
    description: "Test GB/T AC chargers with the portable ST-6680B+: 440 V / 63 A sockets, vehicle-state and fault simulation, adjustable R2/R3 and optional metering.",
    intro: "Choose ST-6680B+ for GB/T AC charger development, factory acceptance and field inspection. Adjustable R2/R3 resistance and CC/CP/PE switching reproduce vehicle states and faults, while live measurements help document charger behavior. Specify the metering accuracy and field accessories needed for your procedure.",
    selection: {
      workflow: "GB/T AC charger testing with two AC 440 V / 63 A sockets. For Type 2 or SAE J1772 sites, select the corresponding regional tester.",
      load: "No built-in load; external load connection up to 63 A. Confirm voltage, phase arrangement, cables and load controls for sustained charging tests.",
      options: "Confirm optional 0.05-class metering, internal battery, GPS and environmental modules. IP67 applies to the closed protective case.",
      alternatives: [{ slug: "st-6680ea-ac", label: "Type 2 AC: ST-6680EA-AC" }, { slug: "st-6680ua-ac", label: "Type 1 AC: ST-6680UA-AC" }],
    },
    faqs: [
      { question: "Does ST-6680B+ test European or North American AC connectors?", answer: "This model is configured for GB/T AC chargers. Choose ST-6680EA-AC for Type 2 or ST-6680UA-AC for Type 1 / SAE J1772, and confirm the exact connector before ordering." },
      { question: "Is a power load included?", answer: "No built-in load is included. The external-load connection supports up to 63 A; specify the compatible load, phase arrangement and accessories separately." },
      { question: "Are precision metering and battery operation standard?", answer: "The 0.05-class metering module and internal battery are optional, as are GPS and temperature/humidity modules. Confirm included functions and accessories in the quotation." },
    ],
  },
  "st-6680ea-ac": {
    title: "ST-6680EA-AC Portable Type 2 AC Charger Tester",
    description: "Test Type 2 AC EVSE with a portable 415 V / 32 A interface, PP/CP/PE simulation and optional precision metering. Separate external load required.",
    intro: "Use ST-6680EA-AC for European Type 2 AC charger debugging, factory acceptance and field inspection. It reproduces pilot and continuity states without relying on a vehicle, displays live charger measurements and supports PC operation. Match the socket, load and measurement configuration to the installed charger.",
    selection: {
      workflow: "Type 2 AC testing with a standard AC 415 V / 32 A socket. A 63 A socket is optional; confirm the complete configuration before specifying higher-current tests.",
      load: "No built-in load; the listed external-load limit is 32 A. An optional 63 A socket does not by itself establish a 63 A load path.",
      options: "Specify optional precision metering, internal battery, GPS and environmental modules. PC software is included; IP67 applies to the closed case.",
      alternatives: [{ slug: "st-6680ua-ac", label: "Type 1 AC: ST-6680UA-AC" }, { slug: "st-hcac-ea-ua-na", label: "Multiple AC interfaces: ST-HCAC-EA / UA / NA" }],
    },
    faqs: [
      { question: "Can the tester replace an EV during Type 2 AC checks?", answer: "It simulates vehicle-side PP, CP and PE states and adjustable R2/R3 resistance for charging-sequence and fault checks. Sustained energy transfer still requires a suitable external load." },
      { question: "Does the optional 63 A socket mean all tests can run at 63 A?", answer: "No. The standard socket is 32 A and the listed external-load limit is 32 A. Confirm the complete current path, load connection and cables with the engineer before planning higher-current operation." },
      { question: "Which field accessories should be specified?", answer: "Confirm load cables, the optional internal battery, GPS, environmental measurement and required metering accuracy. The IP67 protection rating applies to the case when closed." },
    ],
  },
  "st-6680ea-dc": {
    title: "ST-6680EA-DC Portable CCS2 DC Charger Tester",
    description: "Validate CCS2 DC chargers with a 1000 V / 300 A interface, CP/PE/DC fault simulation, live measurements and optional metering. External load required.",
    intro: "Choose ST-6680EA-DC for CCS2 charger development, acceptance and site commissioning. It combines charging-sequence checks, live measurements and panel-controlled fault simulation in a portable platform. Review the charger protocol version, external-load arrangement and evidence requirements before configuring the test setup.",
    selection: {
      workflow: "CCS2 DC testing with a 1000 V / 300 A socket. Define the required DIN SPEC 70121 or ISO 15118 test cases and protocol version.",
      load: "Separate resistive, electronic or regenerative loads connect through the high-power load interface, up to 300 A. Specify voltage, power, cooling and control compatibility separately.",
      options: "Confirm optional 0.05-class metering and required cables. Included PC software supports operation; the case's IP67 rating applies when closed.",
      alternatives: [{ slug: "st-9980ea-hpc", label: "500 A CCS2 interface: ST-9980EA-HPC" }, { slug: "st-6680ca-dc", label: "CHAdeMO: ST-6680CA-DC" }],
    },
    faqs: [
      { question: "Is the 1000 V / 300 A rating a built-in load rating?", answer: "It describes the CCS2 socket and test connection. Sustained charging tests use a separate compatible load; review its voltage, power and controls alongside the tester's connection limits." },
      { question: "Which faults can be simulated from the panel?", answer: "Listed functions include CP open, CP ground, DC+/- open and PE pin faults. Use the selected procedure to define expected charger responses and retained evidence." },
      { question: "How does this model differ from ST-9980EA-HPC?", answer: "ST-6680EA-DC lists a 300 A CCS2 socket; ST-9980EA-HPC lists a 500 A socket and optional PLC capture. Review the whole load path and diagnostic options rather than choosing by socket rating alone." },
    ],
  },
  "st-6680ua-ac": {
    title: "ST-6680UA-AC Portable SAE J1772 AC Charger Tester",
    description: "Validate Type 1 / SAE J1772 AC chargers with a portable 240 V / 50 A interface, live measurements and optional precision metering. External load required.",
    intro: "ST-6680UA-AC suits North American Type 1 AC charger development, factory acceptance and field commissioning. It reproduces vehicle-side charging behavior and displays charger measurements without using an EV as the test instrument. Confirm any optional interoperability, metering and battery functions against the intended acceptance procedure.",
    selection: {
      workflow: "Type 1 / SAE J1772 AC testing with one AC 240 V / 50 A socket. NACS and Type 2 testing require a different interface configuration.",
      load: "No built-in load; external load connection up to 50 A. Confirm supply, cables, load rating and test duration for energy-transfer checks.",
      options: "Metering, interoperability testing, internal battery, GPS and environmental modules are optional. Confirm the required functions and delivered accessories in the quote.",
      alternatives: [{ slug: "st-6680ea-ac", label: "Type 2 AC: ST-6680EA-AC" }, { slug: "st-hcac-ea-ua-na", label: "NACS and multiple AC interfaces: ST-HCAC-EA / UA / NA" }],
    },
    faqs: [
      { question: "Does this Type 1 tester also support NACS?", answer: "The listed connector is Type 1 / SAE J1772. For NACS AC tests, compare ST-HCAC-EA / UA / NA and confirm the interface and load limits for that configuration." },
      { question: "Does the tester contain a power load?", answer: "No. A separate external load up to 50 A is required for sustained charging tests. Confirm voltage, cables and the energy-handling arrangement." },
      { question: "Which functions need to be selected when ordering?", answer: "Precision metering, interoperability testing, internal battery, GPS and environmental measurement are listed as optional. Define the required accuracy and field operating conditions in the quotation request." },
    ],
  },
  "st-6680ua-dc": {
    title: "ST-6680UA-DC North American DC Charger Tester",
    description: "Test North American DC chargers with a 1000 V / 300 A interface, EVCC simulation and optional waveform or Wi-Fi diagnostics. Separate load required.",
    intro: "Use ST-6680UA-DC for North American DC charger development, factory acceptance and field inspection. EVCC parameter setup, EVSE data display and charging-sequence views support repeatable communication diagnosis. Confirm the actual connector and protocol configuration against your charger before ordering; a regional model name alone does not establish compatibility.",
    selection: {
      workflow: "One North American DC socket rated 1000 V / 300 A. Send the exact charger connector and protocol version for a compatibility review.",
      load: "No built-in load; external load connection up to 300 A. Review resistive, electronic or regenerative load compatibility, voltage, power and cooling.",
      options: "Wi-Fi remote testing and multi-channel waveform capture are optional. Confirm required capture channels, measurement functions and supplied cables; PC software is included.",
      alternatives: [{ slug: "st-6680ea-dc", label: "CCS2: ST-6680EA-DC" }, { slug: "st-6680ca-dc", label: "CHAdeMO: ST-6680CA-DC" }],
    },
    faqs: [
      { question: "Can the regional model name confirm connector compatibility?", answer: "No. The current specification describes a North American DC interface. Send the exact connector, protocol version and intended test cases for review; do not assume NACS or another connector is included." },
      { question: "Is waveform capture included as standard?", answer: "Multi-channel waveform capture and Wi-Fi remote testing are optional. Specify the channels, signals and remote-operation workflow required in your configuration." },
      { question: "What is needed for a sustained power test?", answer: "The tester has no built-in load and supports an external load up to 300 A. Specify a compatible load, rated cables, voltage/power limits, cooling and control arrangement." },
    ],
  },
  "st-hcac-ea-ua-na": {
    title: "ST-HCAC Type 1, Type 2 & NACS AC Charger Tester",
    description: "Compare Type 1, Type 2 and NACS AC chargers with a modular 6U or cabinet tester, R2/R3 simulation, fault checks and separately configured external loads.",
    intro: "Choose ST-HCAC-EA / UA / NA when one laboratory needs Type 1, Type 2 and NACS AC charger interfaces. The module can operate in a protective 6U case or integrate into a custom test cabinet. Define each interface's test current, external load, fault sequence and evidence requirements before agreeing the system configuration.",
    selection: {
      workflow: "Multi-interface AC validation: Type 1 240 V / 80 A, Type 2 415 V / 63 A and NACS 240 V / 200 A socket ratings. Choose the 6U or cabinet arrangement for your workflow.",
      load: "Listed external-load limits: Type 1 80 A, Type 2 63 A and NACS 80 A. The NACS socket's 200 A rating does not establish a 200 A external-load path.",
      options: "Confirm optional waveform capture and precision measurement, interface cables and cabinet integration. RS232, RJ45 and PC software support configured operation.",
      alternatives: [{ slug: "st-6680ua-ac", label: "Dedicated Type 1 field tester: ST-6680UA-AC" }, { slug: "st-6680ea-ac", label: "Dedicated Type 2 field tester: ST-6680EA-AC" }, { slug: "st-hcac-gb-ua-ea", label: "Include GB/T AC coverage: ST-HCAC-GB / UA / EA" }],
    },
    faqs: [
      { question: "Can the NACS interface run external-load tests at 200 A?", answer: "The socket is rated 240 V / 200 A, but the listed NACS external-load limit is 80 A. Use the complete configured current-path limit, not the socket rating alone, when planning tests." },
      { question: "Can the tester be integrated into a laboratory cabinet?", answer: "Yes. The modular design supports a protective 6U case or cabinet integration. Confirm mechanical layout, interface access, load connections and software controls for the project." },
      { question: "Does this model provide GB/T or DC coverage?", answer: "This configuration lists Type 1, Type 2 and NACS AC interfaces. For GB/T AC, compare ST-HCAC-GB / UA / EA; use a dedicated DC platform for DC charger tests." },
    ],
  },
  "st-9980a-pro": {
    title: "ST-9980A+ Pro Portable GB/T DC EV Charger Tester",
    description: "Portable GB/T DC EVSE tester with dual 1000 V / 250 A sockets, charging-message analysis and short-circuit pre-checks. Separate external load required.",
    intro: "Choose ST-9980A+ Pro for GB/T DC charger development, factory acceptance and field commissioning. It simulates the vehicle charging sequence and captures charger messages. The dual sockets are rated for DC 1000 V / 250 A; sustained power tests require a separate compatible load. Confirm optional protocol, interoperability and metering modules against your test plan.",
    selection: {
      "workflow": "GB/T DC charger development, factory acceptance and field commissioning with dual 1000 V / 250 A sockets. Confirm the required GB/T protocol revision and optional test modules.",
      "load": "No built-in load; external load connection up to 250 A. Specify compatible load voltage, power, cooling, cables and controls separately.",
      "options": "Confirm optional protocol conformance, interoperability, metering, waveform, GPS, environmental and removable-battery modules. IP67 applies to the closed case.",
      "alternatives": [
        {
          "slug": "st-hcdc-hpc",
          "label": "GB/T battery simulation: ST-HCDC-HPC"
        },
        {
          "slug": "st-9980ea-hpc",
          "label": "CCS2: ST-9980EA-HPC"
        },
        {
          "slug": "st-6680ca-dc",
          "label": "CHAdeMO: ST-6680CA-DC"
        }
      ]
    },
    faqs: [
      { question: "Is ST-9980A+ Pro a CCS2 or CHAdeMO tester?", answer: "This model uses GB/T DC charging sockets. For CCS2, compare ST-9980EA-HPC; for CHAdeMO, compare ST-6680CA-DC. Confirm the connector and protocol before ordering." },
      { question: "Does the 1000 V / 250 A rating include a built-in load?", answer: "No. These are socket ratings. The tester has no built-in power load and supports an external load up to 250 A. Load voltage, power, cooling and controls must be specified separately." },
      { question: "Which functions require configuration review?", answer: "Protocol conformance, interoperability and metering modules are optional. Waveform, GPS, environmental measurement and battery options should also be confirmed in the quotation. The IP67 rating applies to the closed case." },
    ],
  },
  "st-hcdc-hpc": {
    title: "ST-HCDC-HPC High-Power DC EV Charger Tester",
    description: "Test high-power GB/T DC chargers with 0-1100 V battery simulation, BMS communication, protocol conformance, metering verification and external loads up to 250 A.",
    intro: "Use ST-HCDC-HPC when a repeatable instrument must replace a vehicle during high-power GB/T charger development, factory acceptance or field diagnosis. It combines charger communication, battery-voltage simulation, measurement access and fault simulation in a portable system.",
    selection: {
      "workflow": "GB/T DC charger communication, insulation-fault and metering workflows. Review the listed 2015/2017 reference standards against the revision required by your project.",
      "load": "No built-in load; external load connection up to 250 A. The 0–1100 V battery simulator has a 20 mA maximum output and is not a high-power battery source. The Hall sensor range does not determine load-path current.",
      "options": "PC software is included. Confirm optional BMS communication and high-speed waveform modules, measurement connections and the cables needed by your procedure.",
      "alternatives": [
        {
          "slug": "st-9980a-pro",
          "label": "Newer listed GB/T references: ST-9980A+ Pro"
        },
        {
          "slug": "ast-9000",
          "label": "Integrated laboratory system: AST-9000"
        }
      ]
    },
    faqs: [
      { question: "Does ST-HCDC-HPC contain a high-power load?", answer: "No. It provides terminals for a separate load and supports an external load connection up to 250 A." },
      { question: "Which DC charger workflows does it support?", answer: "It supports GB/T protocol analysis, BMS simulation, insulation-fault checks, metering verification and selected external-load tests." },
      { question: "Can it be used outside a laboratory?", answer: "Yes. The portable enclosure and included PC software support factory, commissioning and field-service workflows." },
      { question: "Does the battery simulator or Hall sensor define high-power capability?", answer: "No. The battery-voltage simulator outputs a maximum of 20 mA, and the Hall sensor measurement range is separate from the power path. Sustained charging tests require a compatible external load within the listed 250 A connection limit." },
    ],
  },
  "st-6680ca-dc": {
    title: "ST-6680CA-DC CHAdeMO Charger Tester",
    description: "Validate CHAdeMO DC chargers with a portable 600 V, 200 A interface, battery-voltage simulation, 100 ms communication frames, waveform options and external-load testing.",
    intro: "ST-6680CA-DC is built for teams that need repeatable CHAdeMO charger testing without relying on a vehicle. It supports communication diagnosis, startup-voltage and insulation checks, signal measurement and field acceptance through a portable test workflow.",
    selection: {
      "workflow": "CHAdeMO charger development and field acceptance with a 600 V / 200 A socket. Specify the actual protocol version and charging states to be verified.",
      "load": "No built-in load; external load connection up to 200 A. The wider measurement range does not increase the 600 V / 200 A socket limit. Confirm all cables, load power and controls.",
      "options": "Wi-Fi remote testing, waveform capture and high-voltage reverse-connection simulation are optional. PC software and the 10.1-inch display are listed in the configuration.",
      "alternatives": [
        {
          "slug": "st-6680ea-dc",
          "label": "CCS2: ST-6680EA-DC"
        },
        {
          "slug": "st-9980a-pro",
          "label": "GB/T DC: ST-9980A+ Pro"
        }
      ]
    },
    faqs: [
      { question: "What charger interface does ST-6680CA-DC use?", answer: "It uses one CHAdeMO vehicle-side socket rated for DC 600 V and 200 A." },
      { question: "Does the tester support remote operation?", answer: "Optional Wi-Fi connects the tester to PC software for remote operation and test monitoring." },
      { question: "Is a load included?", answer: "No built-in load is included. The tester provides an external-load interface supporting up to 200 A." },
      { question: "Are all diagnostic options included?", answer: "Wi-Fi remote testing, multi-channel waveform capture and high-voltage reverse-connection simulation are optional. Confirm the exact functions and supplied accessories in the quotation." },
    ],
  },
  "ast-9000": {
    title: "AST-9000 Multi-Standard DC Charger Test System",
    description: "Build repeatable GB/T, IEC and SAE DC charger R&D tests with 0-1100 V battery simulation, BMS communication, CAN capture, programmable sources and automated reports.",
    intro: "AST-9000 is an integrated laboratory platform for charger development and repeatable validation. It coordinates interface simulation, programmable power equipment, communication capture and reporting so engineers can reproduce charging sequences and retain test evidence.",
    selection: {
      "workflow": "Integrated DC charger R&D, repeatable factory tests and laboratory validation. Define the regional connector, protocol version, test sequence and report evidence for each configured interface.",
      "load": "The listed system combines a programmable resistance load, programmable AC source and control software. Their voltage, current and power ratings must be agreed for the project; 0–1100 V describes battery-voltage simulation, not complete system power.",
      "options": "Agree the instruments, fixtures, cables, automation scope and report format in the system quotation. Confirm the exact included equipment and supported tests before ordering.",
      "alternatives": [
        {
          "slug": "st-hcdc-hpc",
          "label": "Portable GB/T diagnosis: ST-HCDC-HPC"
        },
        {
          "slug": "st-9980ea-hpc",
          "label": "Portable CCS2 diagnosis: ST-9980EA-HPC"
        }
      ]
    },
    faqs: [
      { question: "Which markets can AST-9000 be configured for?", answer: "The system can be configured around GB/T, European IEC/CCS and North American SAE charging requirements." },
      { question: "Can AST-9000 automate charger tests?", answer: "Yes. Its software coordinates configured instruments, executes test sequences and generates reports with recorded data." },
      { question: "What communication evidence can it capture?", answer: "It supports BMS simulation plus CAN message capture, export and parsing for charging-state and fault analysis." },
      { question: "Which power ratings and instruments are included in a quotation?", answer: "The architecture lists a programmable resistance load and programmable AC source, but their voltage, current and power ratings are project configuration decisions. Agree the instrument list, fixtures, automation scope and report format before ordering." },
    ],
  },
  "st-9980ea-hpc": {
    title: "ST-9980EA-HPC Portable CCS2 Charger Tester",
    description: "Test CCS2 DC chargers up to 1000 V and 500 A with ISO 15118 and DIN SPEC 70121 communication, optional PLC capture, waveform analysis and remote operation.",
    intro: "ST-9980EA-HPC gives European DC charger teams a portable alternative to vehicle-based acceptance testing. It combines a CCS2 interface, live charging data, EVCC simulation and optional PLC and waveform diagnostics for commissioning and interoperability work.",
    selection: {
      "workflow": "CCS2 charger commissioning and communication diagnosis with a 1000 V / 500 A socket. Confirm ISO 15118 or DIN SPEC 70121 versions and the required test cases.",
      "load": "The 500 A socket rating is not a confirmed complete load-system rating. Agree the energy-handling arrangement, load-path limits, cables, cooling and duration for the proposed configuration.",
      "options": "PLC packet capture, multi-channel waveform acquisition and Wi-Fi remote testing are optional. Specify which raw captures and signals must be saved with the test results.",
      "alternatives": [
        {
          "slug": "st-6680ea-dc",
          "label": "300 A CCS2 interface: ST-6680EA-DC"
        },
        {
          "slug": "ast-9000",
          "label": "Integrated DC laboratory: AST-9000"
        }
      ]
    },
    faqs: [
      { question: "Which communication standards are supported?", answer: "The tester supports ISO 15118 and DIN SPEC 70121 charging communication workflows." },
      { question: "Can it inspect lower-layer PLC traffic?", answer: "Optional HomePlug Green PHY monitoring can capture and save PLC packets for detailed analysis." },
      { question: "What is the connector rating?", answer: "The CCS2 vehicle socket is rated for DC 1000 V and 500 A test connections." },
      { question: "Does the 500 A socket rating confirm a complete 500 A power-test system?", answer: "No. Confirm the configured load path, energy-handling arrangement, cables, cooling and test duration separately. The socket rating alone does not specify load capacity or sustained system power." },
    ],
  },
  "st-hcac-gb-ua-ea": {
    title: "ST-HCAC Three-Standard AC Charger Tester",
    description: "Test GB, European and North American AC chargers in one portable platform with interoperability checks, pilot simulation, optional 0.05-class metering and waveform capture.",
    intro: "ST-HCAC-GB / UA / EA consolidates three regional AC charging interfaces into one validation platform. It is intended for manufacturers, laboratories and inspection teams comparing charger behavior, metering and control-pilot signals across target markets.",
    selection: {
      "workflow": "GB, European and North American AC charger validation in one platform. Confirm the connectors and test current for each regional interface before configuring the station.",
      "load": "Terminals accept resistive, electronic, battery or regenerative loads. Interface and load-path limits need configuration review; the up-to-100 A energy-acquisition range is not a guarantee that every connector supports 100 A.",
      "options": "Precision 0.05-class metering, multi-channel waveform capture and Wi-Fi operation are optional. Specify calibration connections, accessories and portable or cabinet installation.",
      "alternatives": [
        {
          "slug": "st-hcac-ea-ua-na",
          "label": "Type 1, Type 2 and NACS AC: ST-HCAC-EA / UA / NA"
        },
        {
          "slug": "st-6680b-plus",
          "label": "Dedicated GB/T AC field tester: ST-6680B+"
        }
      ]
    },
    faqs: [
      { question: "Which AC interfaces are included?", answer: "The platform supports GB, European and North American AC charging interfaces with independent line control." },
      { question: "Can it perform metering verification?", answer: "An optional 0.05-class metering configuration supports higher-precision verification, including GB AC charger workflows." },
      { question: "What loads can be connected?", answer: "Dedicated terminals support resistive, electronic, battery or regenerative external loads." },
      { question: "Does the 100 A acquisition range apply to every connector?", answer: "No. Energy acquisition and connector current limits are different specifications. Confirm socket, cable and external-load limits for each selected regional interface." },
    ],
  },
};

export function getProductSeo(slug: string) {
  return priorityProductSeo[slug];
}
