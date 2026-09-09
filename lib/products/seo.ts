export type ProductSeoContent = {
  title: string;
  description: string;
  intro: string;
  faqs: Array<{ question: string; answer: string }>;
};

export const priorityProductSeo: Record<string, ProductSeoContent> = {
  "st-hcdc-hpc": {
    title: "ST-HCDC-HPC High-Power DC EV Charger Tester | APEX",
    description: "Test high-power GB/T DC chargers with 0-1100 V battery simulation, BMS communication, protocol conformance, metering verification and external loads up to 250 A.",
    intro: "Use ST-HCDC-HPC when a repeatable instrument must replace a vehicle during high-power GB/T charger development, factory acceptance or field diagnosis. It combines charger communication, battery-voltage simulation, measurement access and fault simulation in a portable system.",
    faqs: [
      { question: "Does ST-HCDC-HPC contain a high-power load?", answer: "No. It provides terminals for a separate load and supports an external load connection up to 250 A." },
      { question: "Which DC charger workflows does it support?", answer: "It supports GB/T protocol analysis, BMS simulation, insulation-fault checks, metering verification and selected external-load tests." },
      { question: "Can it be used outside a laboratory?", answer: "Yes. The portable enclosure and included PC software support factory, commissioning and field-service workflows." },
    ],
  },
  "st-6680ca-dc": {
    title: "ST-6680CA-DC CHAdeMO Charger Tester | APEX",
    description: "Validate CHAdeMO DC chargers with a portable 600 V, 200 A interface, battery-voltage simulation, 100 ms communication frames, waveform options and external-load testing.",
    intro: "ST-6680CA-DC is built for teams that need repeatable CHAdeMO charger testing without relying on a vehicle. It supports communication diagnosis, startup-voltage and insulation checks, signal measurement and field acceptance through a portable test workflow.",
    faqs: [
      { question: "What charger interface does ST-6680CA-DC use?", answer: "It uses one CHAdeMO vehicle-side socket rated for DC 600 V and 200 A." },
      { question: "Does the tester support remote operation?", answer: "Optional Wi-Fi connects the tester to PC software for remote operation and test monitoring." },
      { question: "Is a load included?", answer: "No built-in load is included. The tester provides an external-load interface supporting up to 200 A." },
    ],
  },
  "ast-9000": {
    title: "AST-9000 Multi-Standard DC Charger Test System | APEX",
    description: "Build repeatable GB/T, IEC and SAE DC charger R&D tests with 0-1100 V battery simulation, BMS communication, CAN capture, programmable sources and automated reports.",
    intro: "AST-9000 is an integrated laboratory platform for charger development and repeatable validation. It coordinates interface simulation, programmable power equipment, communication capture and reporting so engineers can reproduce charging sequences and retain test evidence.",
    faqs: [
      { question: "Which markets can AST-9000 be configured for?", answer: "The system can be configured around GB/T, European IEC/CCS and North American SAE charging requirements." },
      { question: "Can AST-9000 automate charger tests?", answer: "Yes. Its software coordinates configured instruments, executes test sequences and generates reports with recorded data." },
      { question: "What communication evidence can it capture?", answer: "It supports BMS simulation plus CAN message capture, export and parsing for charging-state and fault analysis." },
    ],
  },
  "st-9980ea-hpc": {
    title: "ST-9980EA-HPC Portable CCS2 Charger Tester | APEX",
    description: "Test CCS2 DC chargers up to 1000 V and 500 A with ISO 15118 and DIN SPEC 70121 communication, optional PLC capture, waveform analysis and remote operation.",
    intro: "ST-9980EA-HPC gives European DC charger teams a portable alternative to vehicle-based acceptance testing. It combines a CCS2 interface, live charging data, EVCC simulation and optional PLC and waveform diagnostics for commissioning and interoperability work.",
    faqs: [
      { question: "Which communication standards are supported?", answer: "The tester supports ISO 15118 and DIN SPEC 70121 charging communication workflows." },
      { question: "Can it inspect lower-layer PLC traffic?", answer: "Optional HomePlug Green PHY monitoring can capture and save PLC packets for detailed analysis." },
      { question: "What is the connector rating?", answer: "The CCS2 vehicle socket is rated for DC 1000 V and 500 A test connections." },
    ],
  },
  "st-hcac-gb-ua-ea": {
    title: "ST-HCAC Three-Standard AC Charger Tester | APEX",
    description: "Test GB, European and North American AC chargers in one portable platform with interoperability checks, pilot simulation, optional 0.05-class metering and waveform capture.",
    intro: "ST-HCAC-GB / UA / EA consolidates three regional AC charging interfaces into one validation platform. It is intended for manufacturers, laboratories and inspection teams comparing charger behavior, metering and control-pilot signals across target markets.",
    faqs: [
      { question: "Which AC interfaces are included?", answer: "The platform supports GB, European and North American AC charging interfaces with independent line control." },
      { question: "Can it perform metering verification?", answer: "An optional 0.05-class metering configuration supports higher-precision verification, including GB AC charger workflows." },
      { question: "What loads can be connected?", answer: "Dedicated terminals support resistive, electronic, battery or regenerative external loads." },
    ],
  },
};

export function getProductSeo(slug: string) {
  return priorityProductSeo[slug];
}
