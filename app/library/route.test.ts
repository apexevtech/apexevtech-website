import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("legacy Library redirect", () => {
  it("returns an HTTP 308 to the unified catalog while preserving the old collection", () => {
    const response = GET(new Request("https://example.com/library?page=2"));
    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("https://example.com/project-cases?type=materials&page=2&section=resources");
  });

  it("maps scenario filters and preserves repeated marketing parameters", () => {
    const response = GET(new Request("https://example.com/library?view=scenarios&category=audience-charger-manufacturing&q=all&utm_source=mail&utm_source=partner"));
    const destination = new URL(response.headers.get("location")!);
    expect(destination.pathname).toBe("/project-cases");
    expect(destination.searchParams.get("section")).toBe("resources");
    expect(destination.searchParams.get("type")).toBe("scenarios");
    expect(destination.searchParams.get("category")).toBe("audience-charger-manufacturing");
    expect(destination.searchParams.get("q")).toBe("all");
    expect(destination.searchParams.getAll("utm_source")).toEqual(["mail", "partner"]);
    expect(destination.searchParams.has("view")).toBe(false);
    expect(response.headers.get("location")).not.toContain("#");
  });

  it("respects explicit new types and normalizes out-of-range old pages", () => {
    const request = new Request("https://example.com/library?view=solutions&type=guides&page=999");
    const destination = new URL(GET(request).headers.get("location")!);
    expect(destination.searchParams.get("type")).toBe("guides");
    expect(destination.searchParams.get("page")).toBe("4");
    const oldPage = new URL(GET(new Request("https://example.com/library?page=999")).headers.get("location")!);
    expect(oldPage.searchParams.get("page")).toBe("4");
    const unknownView = new URL(GET(new Request("https://example.com/library?view=unknown")).headers.get("location")!);
    expect(unknownView.searchParams.get("type")).toBe("materials");
  });
});
