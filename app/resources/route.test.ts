import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("legacy Resources redirect", () => {
  it("permanently opens technical resources within Project Cases", () => {
    const response = GET(new Request("https://example.com/resources"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://example.com/project-cases?section=resources");
  });

  it("preserves filters, repeated attribution and the resource selection", () => {
    const response = GET(new Request("https://example.com/resources?type=guides&page=2&q=CCS2&utm_source=mail&utm_source=partner&section=cases"));
    const destination = new URL(response.headers.get("location")!);
    expect(destination.pathname).toBe("/project-cases");
    expect(destination.searchParams.get("section")).toBe("resources");
    expect(destination.searchParams.get("type")).toBe("guides");
    expect(destination.searchParams.get("page")).toBe("2");
    expect(destination.searchParams.get("q")).toBe("CCS2");
    expect(destination.searchParams.getAll("utm_source")).toEqual(["mail", "partner"]);
    expect(destination.searchParams.getAll("section")).toEqual(["resources"]);
    expect(response.headers.get("location")).not.toContain("#");
  });
});
