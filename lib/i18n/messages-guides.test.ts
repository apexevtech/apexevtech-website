import { describe, expect, it } from "vitest";
import { resources } from "@/data/resources";
import { guideBodyStrings } from "./guide-body";
import { guideMessages } from "./messages-guides";

describe("guide body translations", () => {
  it("covers every paragraph, checklist item and decision-table field in the first eleven guides", () => {
    let count = 0;
    for (const resource of resources.slice(0, 11)) {
      const original = guideBodyStrings(resource);
      for (const text of original) {
        expect(guideMessages[text], `${resource.slug}: ${text}`).toMatch(/[\u3400-\u9fff]/);
        count += 1;
      }
    }
    expect(count).toBe(217);
  });

  it("keeps numeric ratings, model numbers and standards versions unchanged", () => {
    for (const [original, translation] of Object.entries(guideMessages)) {
      for (const number of original.match(/\b\d+(?:\.\d+)*\b/g) ?? []) expect(translation, original).toContain(number);
    }
    const example = resources[0].sections[3].paragraphs;
    expect(guideMessages[example[1]]).toContain("同时");
    expect(guideMessages[example[1]]).toContain("300 kW");
    expect(guideMessages[example[2]]).toContain("并非 APEX 实测结果");
  });
});
