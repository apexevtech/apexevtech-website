export type Product = {
  slug: string;
  category: string;
  model: string;
  title: string;
  shortDescription: string;
  overview: string;
  image: string;
  document?: string;
  highlights: string[];
  features: string[];
  specs: Array<[string, string]>;
  applications: string[];
};

export const company = {
  brand: "APEX",
  name: "Jiling (Nanjing) Power Energy Co., Ltd.",
  email: "gu@apexps-nj.com",
  phone: "+8617714412321",
  location: "Nanjing, China",
};

export const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const archivedProducts: Product[] = [
  {
    slug: "st-9980a-pro",
    category: "DC Charger Tester",
    model: "ST-9980A+ Pro",
    title: "DC EV Charger Comprehensive Tester",
    shortDescription:
      "Portable DC charger tester for protocol compliance, interoperability and field metering verification.",
    overview:
      "The ST-9980A+ Pro is a portable DC EV charger comprehensive tester designed for charger manufacturers, laboratories and field service teams. It supports communication protocol conformance, interoperability testing, on-site metering verification and safety simulation workflows.",
    image: "/assets/products/st-9980a-pro.png",
    highlights: [
      "Supports GB/T 27930.2-2024",
      "1500V",
      "250A",
      "Protocol Compliance Testing",
      "Interoperability Testing",
      "Portable Design",
    ],
    features: [
      "Supports GB/T protocol compliance, interoperability, metering, waveform acquisition and safety testing modules.",
      "Simulates PE, DC+/DC-, CC1/CC2, S+/S-, S2/S3, DC short-circuit and battery reverse-connection conditions.",
      "10.1-inch touch screen, Android tablet support, PC software and remote OTA upgrade capability.",
      "Rugged trolley-type protective enclosure for complex field environments.",
    ],
    specs: [
      ["Connector Standard", "GB/T 20234.3-2023"],
      ["Socket Rating", "DC 1500V 250A"],
      ["Voltage Range", "0-1500V; standard ±0.5%FS; optional ±0.05%RD"],
      ["Current Range", "0-250A; standard ±0.5%FS; optional ±0.05%RD"],
      ["Insulation Fault Simulation", "10kΩ-2MΩ, 1kΩ step"],
      ["Dimensions / Weight", "L561 x W455 x H265 mm; approx. 25 kg"],
    ],
    applications: [
      "DC fast charger factory validation",
      "Certification laboratory testing",
      "Charging station commissioning",
      "Protocol conformance troubleshooting",
    ],
  },
  {
    slug: "st-9980-pro-ea-ac",
    category: "AC Charger Tester",
    model: "ST-9980 Pro-EA-AC",
    title: "AC EV Charger Comprehensive Tester",
    shortDescription:
      "Type 2 AC charger tester for IEC-based interoperability and metering verification.",
    overview:
      "The ST-9980 Pro-EA-AC is a portable AC EV charger tester developed for Type 2 AC charging piles. It provides interoperability testing, on-site metering verification, data query functions and safety-oriented field operation.",
    image: "/assets/products/st-9980-pro-ea-ac-box.png",
    highlights: [
      "IEC 61851",
      "IEC 62196",
      "Type 2",
      "Metering Verification",
      "Portable Design",
    ],
    features: [
      "Reference standards include IEC 62196-2:2022, IEC 61851-1:2017, IEC 61851-21 and IEC 62196-1:2022.",
      "Optional multi-channel high-precision high-speed waveform acquisition for charging voltage, current and pilot signals.",
      "Real-time visualization of voltage, current, power, status and charging sequence diagrams.",
      "Message export and parsing for charger status analysis and fault diagnosis.",
    ],
    specs: [
      ["Socket Standard", "Type 2"],
      ["Socket Rating", "AC 415V 32A / AC 440V 63A optional"],
      ["Sampling Accuracy", "Standard ±0.5%RD; optional metering class ±0.05%RD"],
      ["Power Supply", "100-240VAC, 50Hz/60Hz; 150W / 12.8V 15Ah"],
      ["Interfaces", "RS232 x2, LAN x1, WiFi x1"],
      ["Dimensions / Weight", "L561 x W455 x H265 mm; approx. 25 kg"],
    ],
    applications: [
      "AC charging pile factory testing",
      "Field maintenance",
      "Metering verification",
      "Interoperability validation",
    ],
  },
  {
    slug: "st-9980-pro-ua-ac",
    category: "EV Charger / EVSE Analyzer",
    model: "ST-9980 Pro-UA-AC",
    title: "Type 1 AC EV Charger / EVSE Analyzer",
    shortDescription:
      "North American Type 1 AC charger tester for EV charger validation and field diagnostics.",
    overview:
      "The ST-9980 Pro-UA-AC is designed for Type 1 North American AC charging applications. It supports interoperability, field metering verification, switch signal simulation and rugged portable testing.",
    image: "/assets/products/st-9980-pro-ua-ac.png",
    highlights: [
      "SAE J1772",
      "UL 2251",
      "UL 2594",
      "Type 1",
      "Field Diagnostics",
    ],
    features: [
      "Developed around SAE J1772, UL 2251, UL 2594, UL 2231-1 and SAE J3400 RP requirements.",
      "Manual control interface for CP, CS, S2, diode short-circuit and electronic lock controls.",
      "Optional waveform acquisition module for voltage, current and pilot signal capture.",
      "IP57 trolley-type protective case for waterproof, shock-resistant and corrosion-resistant use.",
    ],
    specs: [
      ["Socket Standard", "Type 1"],
      ["Socket Rating", "AC 240V 50A / AC 240V 80A optional"],
      ["Sampling Accuracy", "Standard ±0.5%RD; optional metering class ±0.05%RD"],
      ["External Load", "No built-in load; supports external load up to 50A / 80A optional"],
      ["Display", "10.1-inch touch screen with PC software support"],
      ["Dimensions / Weight", "L561 x W455 x H265 mm; approx. 25 kg"],
    ],
    applications: [
      "AC charger production testing",
      "North American AC charger validation",
      "On-site troubleshooting",
      "Laboratory compliance preparation",
    ],
  },
];

export const products: Product[] = [
  {
    slug: "st-hcdc-hpc",
    category: "DC Charger Testing / Laboratory Testing / Field Service",
    model: "ST-HCDC-HPC",
    title: "High-Power DC EV Charger Comprehensive Tester",
    shortDescription:
      "Portable high-power DC charger test system for laboratory, production and field-service validation, with GB/T protocol analysis, BMS simulation, metering verification and external-load testing.",
    overview:
      "ST-HCDC-HPC is a third-party field test system for non-vehicle conductive EV chargers. Built around GB/T 27930-2015, GB/T 34658-2017 and GB/T 34657.1-2017, it replaces test vehicles for repeatable charger validation, avoiding incomplete coverage, battery wear from repeated charging and potential vehicle damage caused by charger faults. The system supports R&D debugging, metering verification and end-of-line testing for charger manufacturers, laboratories and charging facilities.",
    image: "/assets/products/ST-HCDC-HPC.png",
    document: "/product-documents/ST-HCDC-HPC.docx",
    highlights: [
      "High-Power DC Charger Testing",
      "DC 0-1100 V Battery Simulation",
      "0.1% Hall Sensor, 10-1000 A",
      "GB/T 34658 Protocol Conformance",
      "GB/T 34657.1 Interoperability Support",
      "Portable Design, <=25 kg",
    ],
    features: [
      "Built-in battery-voltage simulation from DC 0 to 1100 V continuously adjustable, with a 20 mA maximum output, R4 resistance simulation and U2 pull-up-voltage simulation at two test points.",
      "Built-in 0.1% high-precision Hall current transformer covering 10-1000 A, with both voltage-type and current-type test interfaces for multiple calibration methods.",
      "PC software exports and parses test messages, monitors charger data in real time, supports abnormal-state diagnosis and generates GB/T 34658-2017 protocol conformance reports.",
      "Simulates BMS-to-charger communication across handshake, parameter configuration, charging and charge-completion stages. Optional BMS communication and high-speed waveform acquisition modules support plug-in testing.",
      "Eight selectable resistance levels provide insulation-fault simulation for insulation-monitoring function tests.",
      "External high-power load terminals make it possible to connect a separate load for partial NBT 33008.1-2018 load-test items. The tester has no built-in load and supports an external load up to 250 A.",
      "Modular, easy to integrate and suitable for field use, with a protective design and total weight no greater than 25 kg.",
    ],
    specs: [
      ["Test Object", "Non-vehicle conductive DC charger"],
      ["Connector Socket Count", "1"],
      ["R4 Equivalent Resistance", "200-11,000 ohm, 1 ohm step"],
      ["Voltage / Current Sampling", "±0.5% RD; voltage 200-1000 V; current 10-300 A"],
      ["Working Power", "100-240 VAC, 50 Hz; 35 W"],
      ["Communication Interfaces", "LAN, RS232, Wi-Fi"],
      ["External Load", "No built-in load; external load up to 250 A"],
      ["Dimensions", "L561 x W455 x H265 mm"],
      ["PC Software", "Included"],
      ["Operating Environment", "Operating: -20 to 50 °C; storage: -30 to 70 °C; relative humidity: 90% (10-30 °C), <=75% (30-40 °C), 45% (40-50 °C)"],
      ["Reference Standards", "GB/T 18487.1-2015; GB/T 20234.1-2015; GB/T 20234.4-2022; GB/T 27930-2015; GB/T 34658-2017; GB/T 34657.1-2017"],
    ],
    applications: [
      "EV charger R&D and debugging",
      "Factory acceptance and end-of-line testing",
      "Metering verification and calibration",
      "Charging-facility commissioning and field service",
    ],
  },
  {
    slug: "st-hcac-gb-ua-ea",
    category: "AC Charger Testing / Field Service / Laboratory Testing",
    model: "ST-HCAC-GB / UA / EA",
    title: "Three-Standard AC EV Charger Comprehensive Tester",
    shortDescription:
      "Portable GB, European and North American AC charger tester for interoperability, protocol, metering, waveform and field acceptance testing.",
    overview:
      "ST-HCAC-GB / UA / EA is a portable three-standard AC EV charger tester that combines GB, European and North American charging interfaces in one system. It provides interoperability and protocol-conformance testing, independent line switching, high-current capability for laboratory work and field acceptance workflows. The system is designed for charger manufacturers, power utilities, third-party laboratories, buyers and inspection teams carrying out R&D debugging, production tests, commissioning and verification.",
    image: "/assets/products/ST-HCAC-GB：UA：EA.png",
    document: "/product-documents/ST-HCAC-GB：UA：EA.docx",
    highlights: [
      "GB / European / North American Interfaces",
      "Interoperability & Protocol Testing",
      "Optional 0.05-Class Metering",
      "Remote Wi-Fi Operation",
      "Optional Waveform Capture",
      "External High-Power Load Terminals",
    ],
    features: [
      "Supports GB, European and North American AC charging interfaces, with independent control of line switching and high-current carrying capability for laboratory testing.",
      "RS232 computer connection and optional Wi-Fi operation support remote control, while dedicated voltage, pilot-signal and hardware-synchronization terminals can feed external instruments.",
      "Optional 0.05-class metering supports verification of GB AC chargers against JJG 1148-2022. An optional multi-channel waveform module captures charging voltage, current and signal timing.",
      "Simulates the vehicle control-pilot circuit and the real charging process, with adjustable vehicle-side resistance and real-time voltage, current, power, status and charging-sequence displays.",
      "Provides standard GB, European and North American AC vehicle sockets, dedicated calibration terminals and load terminals for resistive, electronic, battery or regenerative loads.",
      "Built-in energy acquisition covers up to 100 A. L1, L2, L3, N, PE, CP and CC/PP safety terminals provide direct signal access for measurement and inspection.",
      "Compact and suitable for laboratory cabinets, with a complete PC interface that helps test engineers run repeatable charger verification workflows while conserving bench space.",
    ],
    specs: [
      ["Supported Interfaces", "GB / European / North American AC charging interfaces"],
      ["Communications", "RS232; optional Wi-Fi"],
      ["Metering", "Optional 0.05-class metering; JJG 1148-2022 support for GB AC chargers"],
      ["Energy Acquisition Range", "Up to 100 A"],
      ["Signal Terminals", "L1, L2, L3, N, PE, CP and CC/PP; 4 mm safety terminals"],
      ["Waveform Acquisition", "Optional multi-channel charging voltage, current and signal capture"],
      ["External Load", "Terminals for resistive, electronic, battery or regenerative loads"],
      ["Installation", "Portable; suitable for laboratory cabinets"],
      ["Reference Standards", "JJG 1148-2022; GB AC charging and interoperability test requirements"],
    ],
    applications: [
      "AC charger R&D and debugging",
      "Factory acceptance and delivery testing",
      "Third-party laboratory and metering verification",
      "Field acceptance, commissioning and inspection",
    ],
  },
  {
    slug: "ast-9000",
    category: "DC Charger Testing / Laboratory Testing",
    model: "AST-9000",
    title: "Multi-Standard DC EV Charger R&D Test System",
    shortDescription:
      "Integrated GB, European and North American DC charger R&D system with battery simulation, BMS communication, CAN capture, programmable sources and automated reports.",
    overview:
      "AST-9000 is a highly integrated R&D and validation system for non-vehicle conductive DC chargers. It combines a charger test system, programmable resistance load, programmable AC source and configuration software to support charger debugging, function verification and factory testing. The platform is developed around GB/T, IEC and SAE charging requirements and is intended for charger manufacturers, charging-facility builders, power utilities and metrology organizations.",
    image: "/assets/products/AST-9000.png",
    document: "/product-documents/AST-9000.docx",
    highlights: [
      "GB / European / North American DC Interfaces",
      "DC 0-1100 V Battery Simulation",
      "BMS Communication Simulation",
      "Integrated CAN Message Capture",
      "Programmable Source and Load",
      "Automatic Tests and Reports",
    ],
    features: [
      "Built-in battery-voltage simulation from DC 0 to 1100 V lets users set the charger startup voltage for repeatable DC charging tests.",
      "Vehicle control-pilot and BMS communication simulation identifies handshake, parameter configuration, charging-stage and charge-completion messages.",
      "A vehicle charging simulation circuit supports insulation-fault simulation and insulation-monitoring function tests.",
      "The integrated architecture combines charger interface simulation, battery-voltage simulation, BMS communication, CAN message capture and an embedded controller so the charger can be tested after connection without a complex multi-instrument setup.",
      "Power-analysis instruments accurately collect test data. PC software exports and parses charger messages for operating-state analysis and abnormal-fault diagnosis.",
      "System software communicates with all configured instruments, supports coordinated control and automatic test execution, and produces a report with recorded test data.",
    ],
    specs: [
      ["System Configuration", "AST-9000 test system, programmable resistance load, programmable AC source and control software"],
      ["Battery Voltage Simulation", "DC 0-1100 V"],
      ["Communication / Capture", "BMS simulation, CAN message capture, export and parsing"],
      ["Test Automation", "Integrated instrument control, automatic test execution and report generation"],
      ["Reference Standards", "GB/T 18487.1-2015; GB/T 27930-2015; GB/T 34657.1-2017; GB/T 34658-2017; NB/T 33008.1-2018; JJG 1149-2022; IEC 61851-1; IEC 61851-23; SAE J1772-2017"],
    ],
    applications: [
      "DC charger R&D and functional debugging",
      "Factory end-of-line testing",
      "Laboratory compliance and interoperability testing",
      "Utility and metrology organization verification",
    ],
  },
  {
    slug: "st-9980ea-hpc",
    category: "DC Charger Testing / Field Service / Laboratory Testing",
    model: "ST-9980EA-HPC",
    title: "European DC EV Charger High-Power Comprehensive Tester",
    shortDescription:
      "Portable CCS2 DC charger tester for field acceptance, interoperability validation and high-power charger diagnostics up to 1000 V and 500 A.",
    overview:
      "ST-9980EA-HPC is a portable tester for European non-vehicle conductive DC chargers. It is designed for field testing, product acceptance, R&D and third-party inspection, replacing a test vehicle with a repeatable instrument that improves test coverage and avoids vehicle damage caused by charger faults. The trolley-case system supports CCS2 charging, ISO 15118 and DIN SPEC 70121 communication testing, live charger monitoring and optional waveform and PLC data analysis.",
    image: "/assets/products/ST-9980EA-HPC.png",
    document: "/product-documents/ST-9980EA-HPC.docx",
    highlights: [
      "CCS2, DC 1000 V / 500 A",
      "ISO 15118 / DIN SPEC 70121",
      "10.1-Inch Touch Display",
      "Portable High-Protection Trolley Case",
      "Optional Waveform Capture",
      "Optional Wi-Fi and PLC Monitoring",
    ],
    features: [
      "A portable trolley-case design keeps the tester compact, light and protected for field acceptance, commissioning and inspection work.",
      "One CCS2 vehicle socket supports DC 1000 V and 500 A charging test connections.",
      "The tester follows ISO 15118 and DIN SPEC 70121 charging communication requirements for charging-sequence and interoperability validation.",
      "A 10.1-inch touch interface displays charging voltage, current, CP state and other charger information in real time. PC software configures charging parameters and outputs current message data.",
      "Optional multi-channel high-precision high-speed waveform acquisition captures charging voltage, current and pilot signals. Vehicle-control-pilot simulation and dedicated calibration terminals support signal verification.",
      "EVCC parameters and EVSE parameters can be displayed and configured, with charging voltage, current, power, status, sequence diagrams and optional waveform diagrams.",
      "Optional Wi-Fi enables remote wireless testing. Optional HomePlug Green PHY monitoring captures and saves PLC packets for lower-layer charging communication analysis.",
    ],
    specs: [
      ["Connector Standard", "CCS2"],
      ["Socket Rating", "DC 1000 V, 500 A"],
      ["Display", "10.1-inch touch screen"],
      ["Software", "PC software for charging parameter setup, status display and message output"],
      ["Waveform Acquisition", "Optional multi-channel high-precision high-speed capture"],
      ["Wireless Testing", "Optional Wi-Fi remote control"],
      ["PLC Monitoring", "Optional HomePlug Green PHY packet capture and storage"],
      ["Reference Standards", "IEC 61851-1:2017; IEC 61851-23:2014; ISO 15118-1:2013; ISO 15118-2:2014; ISO 15118-3:2015; DIN 70121:2014"],
    ],
    applications: [
      "European DC charger R&D",
      "Field acceptance and commissioning",
      "Third-party inspection and periodic checks",
      "Laboratory interoperability testing",
    ],
  },
  {
    slug: "st-6680b-plus",
    category: "AC Charger Testing / Field Service",
    model: "ST-6680B+",
    title: "GB/T AC EV Charger Comprehensive Tester",
    shortDescription:
      "Portable GB/T AC charger tester with charge and fault simulation, R2/R3 adjustment, live data acquisition, optional metering and an IP67 field case.",
    overview:
      "ST-6680B+ is a portable third-party tester for GB/T AC EV chargers. It supports interoperability testing, independent line switching, vehicle-state and fault simulation, live voltage and current acquisition, field acceptance and inspection. The rugged trolley case is designed for outdoor service, while optional battery, GPS, temperature/humidity and 0.05-class metering modules extend the instrument for field and verification workflows.",
    image: "/assets/products/ST-6680B+.png",
    document: "/product-documents/ST-6680B+.docx",
    highlights: [
      "GB/T AC Charger Testing",
      "2 Sockets, AC 440 V / 63 A",
      "IP67 Rugged Trolley Case",
      "R2 / R3 Resistance Simulation",
      "LAN, RS232 and Wi-Fi",
      "Optional 0.05-Class Metering",
    ],
    features: [
      "LAN, RS232 and Wi-Fi interfaces support local and remote communication with the tester and PC software.",
      "The trolley-style protective case is waterproof, pressure-resistant, shock-resistant and corrosion-resistant. Its closed-state protection rating is IP67 and its wheels and handle support outdoor mobility.",
      "The tester simulates the charging process and common faults, supports vehicle states with or without the S2 switch, and provides adjustable vehicle-side R2 and R3 resistance.",
      "CC, CP and PE continuity switching can be simulated. Voltage, current and charger parameters are acquired and displayed in real time.",
      "Optional internal battery operation supports sites without external power. Optional GPS and temperature/humidity modules provide time synchronization and precision timing functions.",
      "An optional metering module provides 0.05-class accuracy for higher-precision verification work.",
    ],
    specs: [
      ["Test Object", "GB/T AC charger"],
      ["Connector Sockets", "2; AC 440 V, 63 A"],
      ["Sampling Accuracy", "Standard ±0.5% FS (10 V<=U<=380 V; 10 A<=I<=100 A); optional ±0.05% RD (30 V<=U<=480 V; 0.1 A<=I<=100 A)"],
      ["R2 Resistance", "200-11,000 ohm; default 1,300 ohm; 1 ohm step"],
      ["R3 Resistance", "200-11,000 ohm; default 2,740 ohm; 1 ohm step"],
      ["Working Power", "100-240 VAC, 50 Hz; 35 W"],
      ["Communication Interfaces", "LAN, RS232, Wi-Fi"],
      ["External Load", "No built-in load; external load up to 63 A"],
      ["PC Software", "Included"],
      ["Operating / Storage Temperature", "-20 to 50 °C / -30 to 70 °C"],
      ["Relative Humidity", "<=90% RH (10-30 °C); <=75% RH (30-40 °C); <=45% RH (40-50 °C)"],
      ["Panel Signal Terminals", "L1, L2, L3, N, CC, CP, PE, R2, R3"],
      ["Display", "10.1-inch touch screen"],
      ["Dimensions / Weight", "L561 x W455 x H265 mm; approx. 25 kg"],
      ["Reference Standards", "GB/T 20234.1-2023; GB/T 20234.2-2015; GB/T 18487.1-2023; GB/T 34657.1-2017; JJG 1148-2022; JJG 1193-2023"],
    ],
    applications: [
      "GB/T AC charger R&D and debugging",
      "Factory acceptance and end-of-line testing",
      "Field acceptance and periodic inspection",
      "Third-party testing and metering verification",
    ],
  },
  {
    slug: "st-6680ca-dc",
    category: "DC Charger Testing / Field Service",
    model: "ST-6680CA-DC",
    title: "CHAdeMO DC EV Charger Tester",
    shortDescription:
      "Portable CHAdeMO DC charger tester for Japanese-standard charger R&D, factory testing, field acceptance and interoperability diagnostics.",
    overview:
      "ST-6680CA-DC is a portable field tester for Japanese-standard CHAdeMO DC chargers. Developed around the CHAdeMO protocol, it supports charger debugging, function verification, factory testing and on-site acceptance for charger manufacturers, utilities, metrology organizations and charger buyers. Its repeatable test workflow reduces reliance on an EV test vehicle and supports communication, insulation, waveform and load-related checks.",
    image: "/assets/products/ST-6680CA-DC.png",
    document: "/product-documents/ST-6680CA-DC.docx",
    highlights: [
      "CHAdeMO DC Charging",
      "DC 600 V / 200 A Socket",
      "100 ms Communication Frames",
      "Optional Wi-Fi Remote Testing",
      "Optional Waveform Capture",
      "External Load up to 200 A",
    ],
    features: [
      "Developed around CHAdeMO communication, with charging messages sent at the 100 ms interval specified by the protocol.",
      "Optional Wi-Fi enables remote testing from PC software. An optional multi-channel high-precision high-speed waveform module captures charging voltage, current and pilot signals for interoperability checks.",
      "Built-in battery-voltage simulation supports charger startup-voltage and insulation tests. An optional high-voltage reverse-connection function extends fault coverage.",
      "The standard CHAdeMO vehicle socket, dedicated calibration terminals and high-power load interface support signal verification, external-load connection and vehicle-control-pilot simulation.",
      "The tester provides a 10.1-inch touch display, PC software and a portable enclosure for field acceptance, commissioning and inspection work.",
    ],
    specs: [
      ["Connector Standard", "CHAdeMO"],
      ["Connector Socket", "1; DC 600 V, 200 A"],
      ["Test Object", "Japanese-standard CHAdeMO DC charger"],
      ["Voltage / Current Sampling", "±0.5% RD; voltage 200-1000 V; current 10-300 A"],
      ["Working Power", "100-240 VAC, 50-60 Hz; 35 W"],
      ["Communication Interfaces", "RJ45, Wi-Fi, RS232"],
      ["External Load", "No built-in load; external load up to 200 A"],
      ["Display", "10.1-inch touch screen"],
      ["PC Software", "Included"],
      ["Dimensions", "L561 x W455 x H265 mm"],
      ["Operating Environment", "Operating: -20 to 50 °C; storage: -30 to 70 °C; relative humidity: <90% (10-30 °C), <=75% (30-40 °C), 45% (40-50 °C)"],
      ["Reference Standards", "CHAdeMO"],
    ],
    applications: [
      "CHAdeMO charger R&D and debugging",
      "Factory acceptance testing",
      "Field commissioning and periodic inspection",
      "Third-party charger verification",
    ],
  },
  {
    slug: "st-6680ea-ac",
    category: "AC Charger Testing / Field Service",
    model: "ST-6680EA-AC",
    title: "Type 2 AC EV Charger Tester",
    shortDescription:
      "Portable European Type 2 AC charger tester with PP/CP/PE simulation, live data acquisition, optional metering and IP67 field protection.",
    overview:
      "ST-6680EA-AC is a portable third-party tester for European Type 2 AC chargers. It supports field testing, product acceptance, R&D debugging, factory testing and inspection while reducing the need to use an EV as the test instrument. The rugged trolley case, configurable vehicle-state simulation and optional battery, GPS, environmental and metering modules make it suitable for outdoor and laboratory workflows.",
    image: "/assets/products/ST-6680EA-AC.png",
    document: "/product-documents/ST-6680EA-AC.docx",
    highlights: [
      "Type 2, AC 415 V / 32 A",
      "IEC 61851-1 / IEC 61851-22",
      "IP67 Rugged Trolley Case",
      "PP / CP / PE Simulation",
      "Optional 0.05-Class Metering",
      "Optional Internal Battery",
    ],
    features: [
      "Supports LAN, Wi-Fi and RS232 communication for PC connection and field operation.",
      "The trolley-style protective case is waterproof, pressure-resistant, shock-resistant and corrosion-resistant. Its closed-state protection rating is IP67 and wheels and a handle support outdoor mobility.",
      "Simulates PP, CP and PE continuity states, the charging process and common faults, with vehicle states available with or without the S2 switch and adjustable vehicle-side R2/R3 resistance.",
      "Collects voltage and current in real time and displays charger parameters. Optional internal battery operation supports sites without external power.",
      "Optional GPS, temperature/humidity and metering modules provide time synchronization, precision timing and 0.05-class measurement capability.",
    ],
    specs: [
      ["Connector Standard", "Type 2"],
      ["Connector Socket", "1; AC 415 V, 32 A; 63 A optional"],
      ["Test Object", "European Type 2 AC charger"],
      ["Sampling Accuracy", "Standard ±0.5% RD (30 V<=U<=400 V; 10 A<=I<=100 A); optional ±0.05% RD (10 V<=U<=1000 V; 1 A<=I<=250 A), 0.05-class energy metering"],
      ["Working Power", "100-240 VAC, 50 Hz; 35 W"],
      ["Communication Interfaces", "LAN, RS232, Wi-Fi"],
      ["External Load", "No built-in load; external load up to 32 A"],
      ["Panel Signal Terminals", "L1, L2, L3, N, PP, CP, PE, R2, R3"],
      ["Display", "10.1-inch touch screen"],
      ["PC Software", "Included"],
      ["Operating / Storage Temperature", "-20 to 50 °C / -30 to 70 °C"],
      ["Relative Humidity", "<=90% RH (10-30 °C); <=75% RH (30-40 °C); <=45% RH (40-50 °C)"],
      ["Dimensions / Weight", "L561 x W455 x H265 mm; approx. 20 kg"],
      ["Reference Standards", "IEC 61851-1:2017; IEC 61851-22:2002"],
    ],
    applications: [
      "European AC charger R&D",
      "Factory acceptance and delivery testing",
      "Field acceptance and inspection",
      "Third-party interoperability and metering verification",
    ],
  },
  {
    slug: "st-6680ea-dc",
    category: "DC Charger Testing / Field Service",
    model: "ST-6680EA-DC",
    title: "CCS2 DC EV Charger Tester",
    shortDescription:
      "Portable European CCS2 DC charger tester for field acceptance, interoperability testing, high-power load connection and charger diagnostics.",
    overview:
      "ST-6680EA-DC is a portable third-party tester for European CCS2 DC chargers. It supports charger R&D, product acceptance, field inspection and commissioning against IEC 61851, DIN SPEC 70121 and ISO 15118 requirements. The system combines a CCS2 interface, external-load connection, fault simulation, live data acquisition and a rugged IP67 trolley case.",
    image: "/assets/products/ST-6680EA-DC.png",
    document: "/product-documents/ST-6680EA-DC.docx",
    highlights: [
      "CCS2, DC 1000 V / 300 A",
      "IEC 61851 / ISO 15118 / DIN SPEC 70121",
      "IP67 Rugged Trolley Case",
      "External Load up to 300 A",
      "Optional 0.05-Class Metering",
      "CP / PE / DC Fault Simulation",
    ],
    features: [
      "Provides a CCS2 DC socket rated at 1000 V and 300 A, with socket definition aligned to IEC 62196-3 requirements.",
      "External high-power load terminals and a load socket rated up to 300 A support resistive, electronic or regenerative load connections.",
      "The mobile protective case is waterproof, pressure-resistant, shock-resistant and corrosion-resistant, with an IP67 closed-state protection rating for outdoor work.",
      "Accumulates multiple test cases for charger validation and supports LAN, RS232 and Wi-Fi communication.",
      "Collects voltage and current in real time and displays charger parameters. Optional 0.05-class metering supports higher-precision verification.",
      "CP disconnection, CP grounding, DC+/- disconnection and PE pin faults can be simulated from the panel for charger protection and diagnostic tests.",
    ],
    specs: [
      ["Connector Standard", "CCS2"],
      ["Connector Socket", "DC 1000 V, 300 A"],
      ["Test Object", "CCS2 DC charger"],
      ["Sampling Accuracy", "Standard ±0.5% FS (200 V<=U<=1000 V; 10 A<=I<=300 A); optional ±0.05% RD over the same ranges, 0.05-class energy metering"],
      ["Working Power", "100-240 VAC, 50 Hz/60 Hz; 100 W"],
      ["Communication Interfaces", "LAN, RS232, Wi-Fi"],
      ["External Load", "Up to 300 A"],
      ["Panel Signal Terminals", "DC+, DC-, CP, PE, PP"],
      ["Fault Simulation", "CP open, CP ground, DC+/- open and PE pin fault"],
      ["PC Software", "Included"],
      ["Operating / Storage Temperature", "-20 to 50 °C / -30 to 70 °C"],
      ["Relative Humidity", "<=90% RH (10-30 °C); <=75% RH (30-40 °C); <=45% RH (40-50 °C)"],
      ["Dimensions / Weight", "L561 x W455 x H265 mm; approx. 25 kg"],
      ["Reference Standards", "IEC 61851-1:2017; DIN SPEC 70121:2012; ISO 15118-2:2019; IEC 61851-23:2014"],
    ],
    applications: [
      "European DC charger R&D",
      "Factory acceptance and product validation",
      "Field commissioning and inspection",
      "Third-party interoperability testing",
    ],
  },
  {
    slug: "st-6680ua-ac",
    category: "AC Charger Testing / Field Service",
    model: "ST-6680UA-AC",
    title: "SAE J1772 AC EV Charger Tester",
    shortDescription:
      "Portable North American AC charger tester for SAE J1772 conformance, interoperability, metering and field acceptance testing.",
    overview:
      "ST-6680UA-AC is a portable third-party tester for North American AC EV chargers. It supports charger R&D, factory testing, field inspection, interoperability and acceptance without relying on an EV as the test instrument. The system follows SAE J1772-2017, provides real-time data acquisition and supports optional metering, battery, GPS and environmental modules.",
    image: "/assets/products/ST-6680UA-AC.png",
    document: "/product-documents/ST-6680UA-AC.docx",
    highlights: [
      "SAE J1772-2017",
      "AC 240 V / 50 A Socket",
      "Interoperability Testing",
      "External Load up to 50 A",
      "Optional 0.05-Class Metering",
      "LAN, RS232 and Wi-Fi",
    ],
    features: [
      "Developed against SAE J1772-2017 physical, electrical, communication and performance requirements for EV charging systems and connectors.",
      "LAN, RS232 and Wi-Fi communication support local PC control and field diagnostics.",
      "An output load socket rated up to 50 A supports external load connection. The mobile trolley case is rain-resistant, pressure-resistant, shock-resistant and corrosion-resistant for outdoor use.",
      "Supports protocol-conformance testing, optional metering verification and optional interoperability testing, with live voltage, current and charger-parameter display.",
      "Optional internal battery supports operation where no external power is available. GPS and temperature/humidity modules can provide time synchronization and precision timing.",
      "Optional metering module provides 0.05-class measurement accuracy.",
    ],
    specs: [
      ["Connector Standard", "Type 1 / SAE J1772"],
      ["Connector Socket", "1; AC 240 V, 50 A"],
      ["Test Object", "North American AC charger"],
      ["Sampling Accuracy", "Standard ±0.5% FS (30 V<=U<=300 V; 1 A<=I<=80 A); optional ±0.05% RD over the same ranges, 0.05-class energy metering"],
      ["Working Power", "100-240 VAC; export option 85-305 VAC; 50/60 Hz; 35 W; internal battery optional"],
      ["Communication Interfaces", "LAN, RS232, Wi-Fi"],
      ["External Load", "No built-in load; external load up to 50 A"],
      ["Signal Terminals", "L1, N, PE, CP, CS"],
      ["Display", "10.1-inch touch screen"],
      ["PC Software", "Included"],
      ["Operating / Storage Temperature", "-20 to 50 °C / -30 to 70 °C"],
      ["Relative Humidity", "<=90% RH (10-30 °C); <=75% RH (30-40 °C); <=45% RH (40-50 °C)"],
      ["Weight", "Approx. 20 kg"],
      ["Reference Standards", "SAE J1772-2017; IEC 61851-1:2017"],
    ],
    applications: [
      "North American AC charger R&D",
      "Factory acceptance testing",
      "Field commissioning and inspection",
      "Third-party interoperability and metering verification",
    ],
  },
  {
    slug: "st-6680ua-dc",
    category: "DC Charger Testing / Field Service",
    model: "ST-6680UA-DC",
    title: "North American DC EV Charger Tester",
    shortDescription:
      "Portable North American DC charger tester for SAE J1772 communication, interoperability, waveform, metering and field acceptance testing.",
    overview:
      "ST-6680UA-DC is a portable tester for North American DC EV chargers with interoperability test support. It is designed for charger manufacturers, utilities, third-party labs, buyers and inspection teams carrying out R&D, factory testing, field inspection and acceptance. The system simulates the vehicle charging process, displays EVCC/EVSE parameters and provides optional wireless and waveform analysis functions.",
    image: "/assets/products/ST-6680UA-DC.png",
    document: "/product-documents/ST-6680UA-DC.docx",
    highlights: [
      "North American DC Interface",
      "DC 1000 V / 300 A",
      "SAE J1772-2017",
      "Optional Wi-Fi Remote Testing",
      "Optional Waveform Capture",
      "External Load up to 300 A",
    ],
    features: [
      "Developed around SAE J1772-2017 requirements for EV charging system and connector physical, electrical, communication and performance behavior.",
      "Optional Wi-Fi enables remote wireless testing from PC software. Optional multi-channel high-precision high-speed waveform capture records charging voltage, current and pilot signals.",
      "Vehicle-control-pilot simulation reproduces the charging process and supports voltage, current, power, status and charging-sequence displays, together with EVCC parameter setup and EVSE parameter display.",
      "The standard North American DC vehicle socket, dedicated calibration terminals and high-power load interface support signal verification and resistive, electronic or regenerative load connections.",
      "The tester provides a 10.1-inch touch display and PC software with message-cycle settings for charger communication analysis.",
    ],
    specs: [
      ["Connector Standard", "North American DC interface"],
      ["Connector Socket", "1; DC 1000 V, 300 A"],
      ["Test Object", "North American DC charger"],
      ["Voltage / Current Sampling", "±0.5% RD; voltage 200-1000 V; current 10-300 A"],
      ["Working Power", "100-240 VAC, 50 Hz; 35 W"],
      ["Communication Interfaces", "RS232 x2, RJ45, Wi-Fi"],
      ["External Load", "No built-in load; external load up to 300 A"],
      ["Display", "10.1-inch touch screen"],
      ["PC Software", "Included"],
      ["Dimensions", "L561 x W455 x H265 mm"],
      ["Operating Environment", "Operating: -20 to 50 °C; storage: -30 to 70 °C; relative humidity: 90% (10-30 °C), <=75% (30-40 °C), 45% (40-50 °C)"],
      ["Reference Standards", "IEC 61851-1:2017; SAE J1772-2017"],
    ],
    applications: [
      "North American DC charger R&D",
      "Factory acceptance testing",
      "Field commissioning and inspection",
      "Third-party interoperability testing",
    ],
  },
  {
    slug: "st-9980a-pro",
    category: "DC Charger Testing / Field Service / Laboratory Testing",
    model: "ST-9980A+ Pro",
    title: "DC EV Charger Comprehensive Tester",
    shortDescription:
      "Portable GB/T DC charger tester with dual sockets, 1000 V / 250 A coverage, protocol analysis, short-circuit pre-check and IP67 field protection.",
    overview:
      "ST-9980A+ Pro is a portable third-party DC EV charger tester with interoperability test support. It is designed for charger manufacturers, utilities, third-party inspection organizations, buyers and service teams carrying out R&D debugging, factory tests, field inspection and acceptance. It simulates the vehicle charging process, exports and parses charger messages, and adds short-circuit pre-checks for safer field operation.",
    image: "/assets/products/ST-9980A+Pro.png",
    document: "/product-documents/ST-9980A+Pro.docx",
    highlights: [
      "GB/T 20234.3-2023",
      "Dual Sockets, DC 1000 V / 250 A",
      "GB/T 27930.2-2024",
      "IP67 Rugged Trolley Case",
      "Short-Circuit Pre-Check",
      "Android and PC Control",
    ],
    features: [
      "Uses a GB-standard DC EV charging socket and supports current GB/T 2023-2025 standards, with optional protocol conformance, interoperability and metering modules.",
      "Vehicle-control-pilot simulation reproduces the charging process. Manual controls switch PE, DC+/DC-, CC1/CC2, S+/S-, S2/S3 and other charger signals for fault diagnosis.",
      "The tester exports and parses charger messages for operating-state analysis and abnormal-fault diagnosis. A short-circuit pre-check runs before charging to identify wiring risks.",
      "One-key start and stop, an Android operating platform, and PC software provide a direct workflow for test setup, execution and maintenance.",
      "The mobile trolley case is waterproof, pressure-resistant, shock-resistant and corrosion-resistant, with an IP67 closed-state protection rating for complex outdoor environments.",
      "Optional waveform, metering, GPS, temperature/humidity, timing and removable-battery modules extend the tester for interoperability and field verification work.",
    ],
    specs: [
      ["Connector Standard", "GB/T"],
      ["Connector Sockets", "2; DC 1000 V, 250 A"],
      ["Test Object", "DC charger"],
      ["Sampling Accuracy", "Standard ±0.5% FS (10 V<=U<=1000 V; 1 A<=I<=250 A); optional ±0.05% RD over the same ranges, 0.05-class energy metering"],
      ["Equivalent Resistance", "50 ohm-11 kohm, 1 ohm step"],
      ["Insulation Fault Simulation", "10 kohm-2 Mohm, 1 kohm step"],
      ["Charging Parameter Simulation", "PE, DC+/DC-, CC1/CC2, S+/S-, S2/S3 switching; DC short-circuit and battery reverse simulation"],
      ["Working Power", "100-240 VAC, 50 Hz/60 Hz; 150 W"],
      ["Communication Interfaces", "LAN x1, RS232 x2, Wi-Fi x1"],
      ["External Load", "No built-in load; external load up to 250 A"],
      ["Display", "10.1-inch touch screen"],
      ["PC Software", "Included"],
      ["Dimensions / Weight", "L561 x W455 x H265 mm, trolley case; approx. 25 kg"],
      ["Operating Environment", "Operating: -20 to 50 °C; storage: -30 to 70 °C; relative humidity: <=90% (10-30 °C), <=75% (30-40 °C), <=45% (40-50 °C)"],
      ["Reference Standards", "GB/T 20234.1-2023; GB/T 20234.3-2023; GB/T 18487.1-2023 Appendix B; GB/T 18487.5-2024; GB/T 27930-2023; GB/T 27930.2-2024; GB/T 34658-2025; GB/T 34657.1-2025; JJG 1192-2023; JJG 1149-2022; GB/T 44993"],
    ],
    applications: [
      "GB/T DC charger R&D and debugging",
      "Factory acceptance and end-of-line testing",
      "Field commissioning and inspection",
      "Third-party interoperability and metering verification",
    ],
  },
  {
    slug: "st-hcac-ea-ua-na",
    category: "AC Charger Testing / Laboratory Testing / Field Service",
    model: "ST-HCAC-EA / UA / NA",
    title: "Type 1 / Type 2 / NACS AC EV Charger Tester",
    shortDescription:
      "Modular three-standard AC charger tester for Type 1, Type 2 and NACS connectors, with R2/R3 simulation, EVCC/EVSE data and cabinet-ready integration.",
    overview:
      "ST-HCAC-EA / UA / NA is a three-in-one AC EV charger tester for NACS, Type 1 and Type 2 charging equipment. Its integrated control-pilot circuit supports plug-in testing, while the modular design can be supplied as an independent 6U protective-case module or integrated into a test cabinet for a customized laboratory solution. The system combines multiple sockets, load connection, test cases and charger-data acquisition for global AC charger validation.",
    image: "/assets/products/ST-HCAC-EA:UA:NA.png",
    document: "/product-documents/ST-HCAC-EA：UA：NA.docx",
    highlights: [
      "Type 1 / Type 2 / NACS",
      "AC 240 V / 80 A, 415 V / 63 A and 240 V / 200 A",
      "Modular 6U or Cabinet Integration",
      "R2 / R3 Resistance Simulation",
      "EVCC / EVSE Data Display",
      "RS232 and RJ45 Interfaces",
    ],
    features: [
      "Provides Type 1 (AC 240 V, 80 A), Type 2 (AC 415 V, 63 A) and NACS (AC 240 V, 200 A) sockets, with socket definitions aligned to IEC 62196-2 requirements.",
      "The modular design can be deployed in a high-protection 6U case or integrated into a laboratory test cabinet according to the project scenario.",
      "R2 and R3 resistance simulation supports adjustable vehicle-side states. External-load terminals accept resistive or regenerative loads for repeatable test cases.",
      "Stable, interference-resistant architecture meets laboratory testing needs. RS232 and RJ45 communication support control and optional waveform modules.",
      "Displays charging voltage, current, power, status and charging-sequence diagrams, and supports EVCC parameter setup and EVSE parameter display.",
      "Panel fault simulation includes CP open, CP ground, S2 and PE pin faults for interoperability and protection testing.",
    ],
    specs: [
      ["Connector Sockets", "Type 1: AC 240 V, 80 A; Type 2: AC 415 V, 63 A; NACS: AC 240 V, 200 A"],
      ["Test Object", "Type 1, Type 2 and NACS AC chargers"],
      ["Sampling Accuracy", "±0.5% RD at AC 380 V (30 V<=U<=300 V; 10 A<=I<=100 A); optional 0.05% accuracy"],
      ["R2 / R3 Resistance", "200-10,000 ohm; default R2 1,300 ohm and R3 2,740 ohm; 1 ohm step"],
      ["Working Power", "100-240 VAC, 50-60 Hz; 50 W"],
      ["Communication Interfaces", "RS232, RJ45; optional waveform module interface"],
      ["External Load", "Type 1 up to 80 A; Type 2 up to 63 A; NACS up to 80 A"],
      ["PC Software", "Included"],
      ["Operating / Storage Temperature", "-20 to 50 °C / -30 to 70 °C"],
      ["Relative Humidity", "<=90% RH (10-30 °C); <=75% RH (30-40 °C); <=45% RH (40-50 °C)"],
      ["Panel Signal Terminals", "L1, L2, L3, N, CP, PE, PP/CS"],
      ["Fault Simulation", "CP open, CP ground, S2 and PE pin fault"],
      ["Dimensions / Weight", "D477 x W483 x H355 mm; D585 x W615 x H435 mm with case; approx. 25 kg"],
      ["Reference Standards", "IEC 61851-1; IEC 62196-1; IEC 62196-2; SAE J1772-2017; SAE J3400 RP"],
    ],
    applications: [
      "Global AC charger R&D",
      "Laboratory interoperability testing",
      "Production and acceptance testing",
      "Custom cabinet-based test systems",
    ],
  },
];

const archivedBrochureCatalog = [
  {
    model: "AST-9000",
    title: "CCC Charging-Pile Test System",
    category: "Laboratory & Certification",
    description: "Integrated charging-pile functional, capability and compliance testing platform for laboratory workflows.",
    image: "/assets/products/图片1.png",
  },
  {
    model: "AST-9000C",
    title: "Vehicle-Mounted Mobile Test Platform",
    category: "Operations & Maintenance",
    description: "Mobile charging-pile test system platform for on-site commissioning and maintenance operations.",
    image: "/assets/products/ast-9000c-mobile-platform.png",
  },
  {
    model: "ST-HCDC-CA-UA-EA",
    title: "Multi-Standard DC Charger Tester",
    category: "DC Charger Testing",
    description: "Multi-standard DC charging interface tester for charger communication, simulation and diagnostic workflows.",
    image: "/assets/products/st-hcdc-na.png",
  },
  {
    model: "ST-9980A+ Pro",
    title: "DC EV Charger Comprehensive Tester",
    category: "Portable Field Testing",
    description: "Portable DC charger tester for protocol compliance, interoperability, metering and safety verification.",
    image: "/assets/products/st-9980a-pro.png",
  },
  {
    model: "PV-Storage-Charging",
    title: "光储充 Integrated Test Solution",
    category: "New Energy Integration",
    description: "Integrated test architecture for photovoltaic generation, energy storage, DC charging and grid interaction.",
    image: "/assets/products/图片9.png",
  },
];

export const brochureCatalog: Array<{
  model: string;
  title: string;
  category: string;
  description: string;
  image: string;
}> = [];

export const solutions = [
  {
    slug: "ev-charger-manufacturing-testing",
    title: "EV Charger Laboratory Testing",
    overview:
      "An integrated laboratory solution for charging-pile CCC certification, functional verification, protocol analysis and interoperability testing.",
    benefits: ["CCC and standards preparation", "GB/T, IEC, CCS and NACS coverage", "Automated reports and traceable records"],
    equipment: ["AST-9000", "ST-9980A+ Pro", "DC charger interface simulators", "Programmable power and load systems"],
    value:
      "Configure a complete laboratory around the charger type, target market and test plan instead of combining disconnected instruments.",
  },
  {
    slug: "charger-operations-maintenance",
    title: "Charger Operations & Maintenance Testing",
    overview:
      "Mobile and field-ready test platforms for charging-station commissioning, fault diagnosis and periodic maintenance.",
    benefits: ["Vehicle-based mobile testing", "On-site fault isolation", "Portable records and remote support"],
    equipment: ["AST-9000C mobile platform", "ST-9980A+ Pro", "ST-9980 Pro-EA-AC", "ST-HCDC series"],
    value:
      "Service teams can validate installed chargers at the site, reproduce intermittent faults and confirm repair quality before handover.",
  },
  {
    slug: "production-line-testing-and-aging",
    title: "Production-Line Testing & Aging",
    overview:
      "Production test and aging systems for AC/DC charger end-of-line validation, automated reporting and factory traceability.",
    benefits: ["End-of-line functional tests", "High-volume aging workflows", "MES and report integration"],
    equipment: ["AST-900 / AST-9000", "AC and DC test stations", "Regenerative loads", "Automated control software"],
    value:
      "Standardize production acceptance across models while keeping test conditions, results and exceptions visible to quality teams.",
  },
  {
    slug: "pv-storage-charging-testing",
    title: "PV, Storage & Charging Testing",
    overview:
      "Integrated validation for photovoltaic generation, energy storage, DC charging and grid interaction in one energy system.",
    benefits: ["PV-storage-charger coordination", "Grid and load simulation", "Scalable project architectures"],
    equipment: ["AST-9000 test system", "Regenerative AC/DC loads", "Power quality and waveform instruments"],
    value:
      "Test the complete energy chain from generation and storage to charging output, with repeatable scenarios for commercial and industrial projects.",
  },
];

export const caseStudies = [
  {
    slug: "ast-9000-ccc-laboratory",
    title: "AST-9000 CCC Charging-Pile Laboratory",
    category: "Laboratory Validation",
    summary: "A complete charging-pile CCC functional and capability validation platform with programmable power, interface simulation and automated records.",
    image: "/assets/hero/test-lab-systems.jpg",
    tags: ["AST-9000", "CCC", "GB/T", "IEC"],
  },
  {
    slug: "ast-9000c-mobile-testing-platform",
    title: "AST-9000C Mobile Testing Platform",
    category: "Operations & Maintenance",
    summary: "A vehicle-based mobile test platform for charger commissioning and maintenance in locations where a fixed laboratory is not practical.",
    image: "/assets/products/ast-9000c-mobile-platform.png",
    tags: ["AST-9000C", "Field Testing", "Commissioning"],
  },
  {
    slug: "charger-production-aging-line",
    title: "AC/DC Charger Production and Aging Line",
    category: "Factory Testing",
    summary: "Modular AST-900 and AST-9000 line systems for end-of-line tests, high-volume aging, automated reports and production traceability.",
    image: "/assets/products/图片1.png",
    tags: ["AST-900", "Aging Test", "MES"],
  },
  {
    slug: "pv-storage-charging-integration",
    title: "PV-Storage-Charging Integrated Test",
    category: "New Energy Integration",
    summary: "A coordinated test architecture for photovoltaic generation, storage systems, DC charging and grid interaction across project scales.",
    image: "/assets/products/图片9.png",
    tags: ["PV", "Energy Storage", "DC Charging"],
  },
];

export const blogPosts = [
  {
    slug: "what-is-ev-charger-testing",
    title: "What Is EV Charger Testing?",
    excerpt:
      "A practical overview of safety, protocol, interoperability and metering tests used in EV charger validation.",
  },
  {
    slug: "gbt-27930-testing-guide",
    title: "GB/T 27930 Testing Guide",
    excerpt:
      "Key considerations for DC charger protocol compliance and GB/T 27930.2-2024 validation.",
  },
  {
    slug: "evse-compliance-testing-explained",
    title: "EVSE Compliance Testing Explained",
    excerpt:
      "How laboratories and manufacturers structure EV charger compliance and interoperability workflows.",
  },
  {
    slug: "how-to-choose-an-ev-charger-tester",
    title: "How To Choose An EV Charger Tester",
    excerpt:
      "Selection factors for AC/DC charger testers, interface analyzers and regenerative loads.",
  },
  {
    slug: "future-trends-in-ev-charging-infrastructure",
    title: "Future Trends In EV Charging Infrastructure",
    excerpt:
      "Why higher power, V2G, NACS adoption and smarter field diagnostics are shaping test equipment requirements.",
  },
];
