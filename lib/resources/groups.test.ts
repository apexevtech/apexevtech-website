import { describe, expect, it } from "vitest";
import { resources } from "@/lib/resources/catalog";
import { getUngroupedResources, resourceGroups } from "@/lib/resources/groups";

describe("resource groups", () => {
  it("places every guide in exactly one topic group", () => {
    const grouped = resourceGroups.flatMap((group) => group.resources.map((resource) => resource.slug));

    expect(getUngroupedResources()).toEqual([]);
    expect(grouped).toHaveLength(resources.length);
    expect(new Set(grouped).size).toBe(resources.length);
  });

  it("provides useful labels and stable anchors", () => {
    expect(resourceGroups).toHaveLength(4);
    for (const group of resourceGroups) {
      expect(group.id).toMatch(/^[a-z]+(?:-[a-z]+)*$/);
      expect(group.title.length).toBeGreaterThan(20);
      expect(group.description.length).toBeGreaterThan(60);
      expect(group.resources.length).toBeGreaterThanOrEqual(3);
    }
  });
});
