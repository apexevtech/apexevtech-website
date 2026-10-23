import { describe, expect, it } from "vitest";
import { applicationExamples } from "@/data/applications";
import { engineeringCases } from "@/data/engineering-cases";
import { resources } from "@/data/resources";
import { applicationScenarios } from "@/data/technical-library";
import { projectBriefMessages } from "@/lib/i18n/messages-project-briefs";
import { messages } from "@/lib/i18n/zh";
import { translateText } from "@/lib/i18n/translate";
import { projectBriefs, type ProjectBrief } from "./project-briefs";

function visibleText(brief: ProjectBrief) {
  return [brief.title, brief.description, brief.objective, ...brief.reviewSteps.flatMap((step) => [step.title, step.description]), ...brief.evidenceFields, brief.scopeNote];
}

describe("project reference briefs", () => {
  it("connects only the three intended local references, materials, architectures and guides", () => {
    expect(projectBriefs.map((brief) => brief.caseSlug)).toEqual(["ccs-charger-laboratory-testing", "vehicle-charger-field-diagnostics", "production-embedded-charger-testing"]);
    expect(projectBriefs.map((brief) => brief.materialId)).toEqual(["ccs2-laboratory-scope", "site-fault-diagnosis", "embedded-end-of-line-planning"]);
    expect(projectBriefs.map((brief) => brief.applicationSlug)).toEqual(["integrated-ev-charger-validation-laboratory", "mobile-ev-charger-commissioning-workflow", "evse-production-end-of-line-architecture"]);
    expect(new Set(projectBriefs.map((brief) => brief.title)).size).toBe(3);
    expect(new Set(projectBriefs.map((brief) => brief.description)).size).toBe(3);
    for (const brief of projectBriefs) {
      const reference = engineeringCases.find((entry) => entry.slug === brief.caseSlug);
      const material = applicationScenarios.find((entry) => entry.id === brief.materialId);
      const application = applicationExamples.find((entry) => entry.slug === brief.applicationSlug);
      expect(reference, brief.caseSlug).toBeDefined();
      expect(material, brief.materialId).toBeDefined();
      expect(application, brief.applicationSlug).toBeDefined();
      expect(resources.find((entry) => entry.slug === reference!.relatedResourceSlug)).toBeDefined();
      expect(brief.modifiedAt).toBe("2026-10-23");
      expect(brief.title.length).toBeGreaterThanOrEqual(45);
      expect(brief.title.length).toBeLessThanOrEqual(60);
      expect(brief.description.length).toBeGreaterThanOrEqual(135);
      expect(brief.description.length).toBeLessThanOrEqual(165);
      expect(brief.reviewSteps).toHaveLength(3);
      expect(brief.evidenceFields).toHaveLength(4);
    }
  });

  it("provides distinct substantive planning content without invented numeric performance", () => {
    for (const brief of projectBriefs) {
      const body = [brief.objective, ...brief.reviewSteps.flatMap((step) => [step.title, step.description]), ...brief.evidenceFields, brief.scopeNote].join(" ");
      const wordCount = body.trim().split(/\s+/).length;
      expect(wordCount, brief.caseSlug).toBeGreaterThanOrEqual(200);
      expect(wordCount, brief.caseSlug).toBeLessThanOrEqual(300);
      expect(body, brief.caseSlug).not.toMatch(/\b\d+(?:\.\d+)?\s*(?:%|percent|seconds?|minutes?|hours?|units?|chargers? per|V\b|A\b|kW\b)/i);
      expect(body, brief.caseSlug).not.toMatch(/\b(?:our customer|delivered by APEX|APEX installed|achieved|improved by|reduced by|certified|proven results)\b/i);
      expect(brief.objective).toMatch(/proposed review|proposed investigation/);
      expect(brief.reviewSteps.every((step) => step.description.startsWith("Ask "))).toBe(true);
    }
    expect(projectBriefs[0].scopeNote).toContain("not a verified APEX delivery or a documented CCS2 configuration");
    expect(projectBriefs[0].reviewSteps[0].description).toContain("If CCS2 is proposed");
    expect(projectBriefs[1].scopeNote).toContain("laboratory diagnostic arrangement, not field work");
    expect(projectBriefs[2].scopeNote).toContain("no verified APEX delivery, measured cycle time, yield improvement or demonstrated MES integration");
  });

  it("translates every new visible data string through the merged Chinese dictionary", () => {
    for (const brief of projectBriefs) {
      for (const text of visibleText(brief)) {
        expect(projectBriefMessages[text], text).toMatch(/[\u3400-\u9fff]/);
        expect(messages[text], text).toBe(projectBriefMessages[text]);
        expect(translateText(text, "zh", messages), text).toBe(projectBriefMessages[text]);
        expect(translateText(text, "en", messages), text).toBe(text);
      }
    }
    expect(projectBriefMessages[projectBriefs[0].scopeNote]).toContain("未记录明确的 CCS2 配置");
    expect(projectBriefMessages[projectBriefs[1].scopeNote]).toContain("实验室诊断配置");
    expect(projectBriefMessages[projectBriefs[2].scopeNote]).toContain("没有经核实的 APEX 交付");
  });
});
