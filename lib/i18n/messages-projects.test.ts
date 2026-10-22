import { describe, expect, it } from "vitest";
import { engineeringCases } from "@/data/engineering-cases";
import { applicationScenarios, solutionBriefs } from "@/data/technical-library";
import { projectMessages } from "./messages-projects";
import { engineeringCaseSearchText, resourceSearchText } from "./search";
import { resourceBrowserEntries } from "@/lib/resources/browser";

describe("project translations", () => {
  it("translates every engineering title, summary, technical focus and image description", () => {
    for (const entry of engineeringCases) {
      for (const text of [entry.title, entry.summary, ...entry.technicalFocus, entry.image?.alt].filter((value): value is string => Boolean(value))) {
        expect(projectMessages[text], text).toMatch(/[\u3400-\u9fff]/);
      }
      expect(engineeringCaseSearchText[entry.id], entry.id).toMatch(/[\u3400-\u9fff]/);
    }
  });

  it("translates the complete technical content while retaining scope limitations", () => {
    for (const entry of [...solutionBriefs, ...applicationScenarios]) {
      for (const text of [entry.title, entry.summary, ...entry.requirements, entry.reviewOutput, entry.planningNote, entry.relatedLabel, entry.source.title, entry.source.summary, entry.source.scopeNote, entry.source.image?.alt].filter((value): value is string => Boolean(value))) {
        expect(projectMessages[text], text).toMatch(/[\u3400-\u9fff]/);
      }
      expect(projectMessages[entry.source.scopeNote]).toContain("APEX");
    }
    for (const entry of resourceBrowserEntries) expect(resourceSearchText[entry.id], entry.id).toMatch(/[\u3400-\u9fff]/);
  });
});
