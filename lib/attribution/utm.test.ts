import { describe, expect, it } from "vitest";
import { parseUtm } from "@/lib/attribution/utm";

describe("parseUtm", () => {
  it("accepts known fields and ignores unknown fields", () => {
    expect(parseUtm(new URLSearchParams("utm_source=linkedin&utm_medium=referral&bad=x"))).toEqual({
      utmSource: "linkedin",
      utmMedium: "referral",
    });
  });
});
