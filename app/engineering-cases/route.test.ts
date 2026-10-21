import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("legacy Engineering Cases redirect", () => {
  it("permanently opens the Project Cases index", () => {
    const response = GET(new Request("https://example.com/engineering-cases"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://example.com/project-cases");
  });

  it("preserves filters and repeated attribution without clearing inherited fragments", () => {
    const response = GET(new Request("https://example.com/engineering-cases?category=vehicle-manufacturers&page=2&q=CCS2&utm_source=mail&utm_source=partner"));
    const destination = new URL(response.headers.get("location")!);
    expect(destination.pathname).toBe("/project-cases");
    expect(destination.searchParams.get("category")).toBe("vehicle-manufacturers");
    expect(destination.searchParams.get("page")).toBe("2");
    expect(destination.searchParams.get("q")).toBe("CCS2");
    expect(destination.searchParams.getAll("utm_source")).toEqual(["mail", "partner"]);
    expect(response.headers.get("location")).not.toContain("#");
  });
});
