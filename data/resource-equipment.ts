import type { ProductFilters } from "@/lib/products/filter";

type EquipmentPath = { title: string; slug: string; scope: string; href: string; label: string };
type EquipmentPaths = { paths: EquipmentPath[]; note?: string; inquiryFilters?: ProductFilters; inquiryLabel?: string };

export const resourceEquipmentPaths: Record<string, EquipmentPaths> = {
  "field-commissioning-test-equipment": {
    paths: [
      { title: "AC field acceptance", slug: "st-hcac-gb-ua-ea", scope: "Compare the AC platform for the installed connector and site checks. Confirm regional interfaces, measurement options and load arrangement.", href: "/products/st-hcac-gb-ua-ea", label: "Review AC field equipment" },
      { title: "CCS2 DC site testing", slug: "st-9980ea-hpc", scope: "Review the CCS2 platform for charging-sequence and output diagnosis. Specify the external load, continuous duty and site supply separately.", href: "/products/st-9980ea-hpc", label: "Review CCS2 field equipment" },
      { title: "GB/T DC site testing", slug: "st-9980a-pro", scope: "Review the GB/T portable platform. It has no built-in load; confirm the external-load connection and required communication configuration.", href: "/products/st-9980a-pro", label: "Review GB/T field equipment" },
    ],
    note: "These are starting configurations, not a complete list of connector options. Confirm installed interfaces and the permitted site test scope before dispatch.",
    inquiryFilters: { type: "all", interface: "all", workflow: "field" },
    inquiryLabel: "Review my site acceptance setup",
  },
  "evse-end-of-line-testing": {
    paths: [
      { title: "AC production checks", slug: "st-hcac-gb-ua-ea", scope: "Review the AC test platform for the required regional interface and production checks. Confirm fixtures, automation and separate safety instruments.", href: "/products/st-hcac-gb-ua-ea", label: "Review AC production equipment" },
      { title: "GB/T DC production checks", slug: "st-hcdc-hpc", scope: "Review the GB/T DC platform for communication, output and metering functions. Confirm external loading and the exact test sequence.", href: "/products/st-hcdc-hpc", label: "Review GB/T DC equipment" },
      { title: "CCS2 DC production checks", slug: "st-6680ea-dc", scope: "Review the CCS2 DC platform against the proposed production recipe. Confirm communication scope, load path and result-export requirements.", href: "/products/st-6680ea-dc", label: "Review CCS2 DC equipment" },
    ],
    note: "A tester is only one part of the station. Fixtures, interlocks, safety instruments, load, cycle-time validation and MES integration require a separate configuration review.",
    inquiryFilters: { type: "all", interface: "all", workflow: "production" },
    inquiryLabel: "Review my EOL station requirements",
  },
  "choose-ev-charger-test-system": {
    paths: [
      { title: "AC charger testing", slug: "st-hcac-gb-ua-ea", scope: "Pilot states, charging sequences and metering checks. Confirm the connector and regional configuration.", href: "/products?type=ac#equipment", label: "Compare AC testers" },
      { title: "DC charger testing", slug: "st-hcdc-hpc", scope: "Vehicle communication, output measurements and charging-state diagnosis. Confirm the external load and power path.", href: "/products?type=dc#equipment", label: "Compare DC testers" },
      { title: "Laboratory / R&D", slug: "ast-9000", scope: "Repeatable DC charger validation with battery simulation, communication capture and reports. Confirm each interface and module.", href: "/products/ast-9000", label: "Review AST-9000" },
    ],
  },
  "ccs2-dc-fast-charger-testing": {
    paths: [
      { title: "High-power CCS2 diagnosis", slug: "st-9980ea-hpc", scope: "Published CCS2 connection ratings up to 1000 V / 500 A. Confirm the protocol edition, continuous-duty limits and separate load configuration.", href: "/products/st-9980ea-hpc", label: "Review ST-9980EA-HPC" },
      { title: "Portable CCS2 testing", slug: "st-6680ea-dc", scope: "Compare the portable European DC test platform with your PLC, pilot and electrical-measurement requirements. Confirm included and optional functions.", href: "/products/st-6680ea-dc", label: "Review ST-6680EA-DC" },
      { title: "Laboratory integration", slug: "ast-9000", scope: "Review the integrated DC R&D platform for repeatable sequences and evidence capture. Confirm the CCS2 interface, protocol modules and power equipment in the quotation.", href: "/products/ast-9000", label: "Review AST-9000" },
    ],
    note: "A tester's connector rating is not the continuous-power rating of the complete test setup. Specify the external load, cooling and facility supply separately.",
    inquiryFilters: { type: "dc", interface: "ccs2", workflow: "all" },
  },
  "sae-j3400-nacs-testing": {
    paths: [
      { title: "Documented NACS AC interface", slug: "st-hcac-ea-ua-na", scope: "The published AC platform lists Type 1, Type 2 and NACS interfaces. Confirm the NACS configuration, electrical ratings, pilot functions and required SAE J3400 edition.", href: "/products/st-hcac-ea-ua-na", label: "Review NACS AC equipment" },
    ],
    note: "NACS DC coverage is a separate configuration review. The AC model shown here does not establish DC support; send your DC connector, communication, electrical range and load requirements to an engineer.",
    inquiryFilters: { type: "dc", interface: "nacs", workflow: "all" },
  },
};
