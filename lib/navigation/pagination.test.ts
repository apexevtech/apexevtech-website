import { describe, expect, it } from "vitest";
import { buildPageHref, paginate, parsePageNumber, searchParamsFromRecord } from "./pagination";

describe("catalog pagination", () => {
  it("accepts only positive safe integer page numbers", () => {
    for (const value of [null, "", "0", "-2", "1.5", "Infinity", "1e2", "99999999999999999999"]) {
      expect(parsePageNumber(value)).toBe(1);
    }
    expect(parsePageNumber("2")).toBe(2);
  });

  it("slices all entries once and clamps empty and out-of-range pages", () => {
    const entries = Array.from({ length: 25 }, (_, index) => index);
    expect([1, 2, 3, 4, 5].flatMap((page) => paginate(entries, page).items)).toEqual(entries);
    expect(paginate(entries, 99)).toMatchObject({ page: 5, start: 25, end: 25, totalPages: 5 });
    expect(paginate([], 7)).toEqual({ items: [], page: 1, totalPages: 1, totalItems: 0, start: 0, end: 0 });
    expect(paginate(entries, NaN).page).toBe(1);
    expect(paginate(entries, 1, 0).items).toHaveLength(6);
  });

  it("keeps filters in crawlable page links without mutating input", () => {
    const params = new URLSearchParams("view=scenarios&q=all&page=2");
    expect(buildPageHref("/library", params, 3, "library-results")).toBe("/library?view=scenarios&q=all&page=3#library-results");
    expect(buildPageHref("/library", params, 1, "library-results")).toBe("/library?view=scenarios&q=all#library-results");
    expect(params.get("page")).toBe("2");
    expect(searchParamsFromRecord({ q: ["first", "second"], page: "2", empty: undefined }).toString()).toBe("q=first&page=2");
  });
});
