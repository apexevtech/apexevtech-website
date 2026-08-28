import { describe, expect, it } from "vitest";
import robots from "@/app/robots";

describe("robots policy", () => {
  it("allows supported AI crawlers", () => {
    const result = robots();
    expect(result.rules).toEqual(expect.arrayContaining([
      expect.objectContaining({ userAgent: "GPTBot", allow: "/" }),
      expect.objectContaining({ userAgent: "OAI-SearchBot", allow: "/" }),
    ]));
  });
});
