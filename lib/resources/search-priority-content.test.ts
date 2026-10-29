import { describe, expect, it } from "vitest";
import { getResource } from "@/lib/resources/catalog";
import { guideBodyStrings } from "@/lib/i18n/guide-body";
import { messages } from "@/lib/i18n/zh";
import { translateText } from "@/lib/i18n/translate";

describe("search-priority guide scope", () => {
  it("routes selection readers by project stage without replacing existing configuration evidence", () => {
    const guide = getResource("choose-ev-charger-test-system")!;
    const route = guide.sections.at(-1)!;
    expect(route.heading).toBe("Match the guide to your project stage");
    expect(route.relatedResourceSlugs).toEqual([
      "prepare-ev-charger-standards-validation", "evse-end-of-line-testing",
      "field-commissioning-test-equipment", "ev-charger-test-equipment-guide",
    ]);
    expect(route.paragraphs.join(" ")).toContain("not proof that one configuration covers every application");
    expect(guide.sections[3].heading).toBe("Worked example: specifying a CCS2 DC charger test system");
    expect(guide.sections[3].paragraphs[2]).toContain("not a measured APEX test result");
    expect(guide.decisionTable?.rows).toHaveLength(4);
  });

  it("distinguishes vehicle-side functional evidence from installation or certification results", () => {
    const guide = getResource("ev-charger-testing-guide")!;
    expect(guide.summaryAnswer).toContain("not a complete electrical-installation inspection or certification result");
    expect(guide.sections[0].paragraphs.join(" ")).toContain("Treat site safety and installation checks as separate prerequisites");
    expect(guide.sections[0].relatedResourceSlugs).toEqual([
      "post-installation-evse-testing", "field-commissioning-test-equipment",
    ]);
    expect(guide.decisionTable?.rows).toHaveLength(5);
    expect(guide.sections.map(({ heading }) => heading)).toEqual([
      "Define the EV charger testing scope", "Select equipment and the power path",
      "Run a controlled charging sequence", "Add fault and boundary tests safely", "Create evidence that can be reviewed",
    ]);
  });

  it("keeps search titles and descriptions stable during this content revision", () => {
    const selection = getResource("choose-ev-charger-test-system")!;
    expect(selection.title).toBe("EV Charger Test System Selection: AC/DC Equipment Guide");
    expect(selection.description).toBe("Compare AC and DC EV charger test systems by connector, protocol, voltage and current range, load path, test environment and required evidence.");
    const workflow = getResource("ev-charger-testing-guide")!;
    expect(workflow.title).toBe("EV Charger Testing: Workflow, Equipment and Evidence");
    expect(workflow.description).toBe("Plan EV charger testing from scope and equipment selection through connection, communication, electrical response, faults and reviewable evidence.");
  });

  it("provides Chinese for both revised guides and their contextual link titles", () => {
    for (const slug of ["choose-ev-charger-test-system", "ev-charger-testing-guide"]) {
      const guide = getResource(slug)!;
      const originals = [guide.summaryAnswer, ...guide.sections.map(({ heading }) => heading), ...guideBodyStrings(guide)];
      for (const section of guide.sections) {
        for (const linkedSlug of section.relatedResourceSlugs ?? []) originals.push(getResource(linkedSlug)!.title);
      }
      for (const text of originals) {
        expect(translateText(text, "zh", messages), text).toMatch(/[\u3400-\u9fff]/);
      }
    }
  });
});
