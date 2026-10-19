import type { ProductFilters } from "@/lib/products/filter";

type EquipmentPath = { title: string; slug: string; scope: string; href: string; label: string };
type EquipmentPaths = { paths: EquipmentPath[]; note?: string; inquiryFilters?: ProductFilters };

export const resourceEquipmentPaths: Record<string, EquipmentPaths> = {
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
