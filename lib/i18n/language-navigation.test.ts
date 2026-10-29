import { describe, expect, it, vi } from "vitest";
import { requestLanguageNavigation } from "./language-navigation";

function options() {
  return { currentLanguage: "en" as const, nextLanguage: "zh" as "en" | "zh", href: "/products?type=dc&compare=ast-9000%2Cst-hcdc-hpc&apex_qa=1#compare", dirty: false, pending: false, uncertain: false, confirmNavigation: vi.fn(() => true), navigate: vi.fn() };
}

describe("document language navigation", () => {
  it("navigates to the equivalent URL without dropping query, encoding or hash", () => {
    const args = options();
    expect(requestLanguageNavigation(args)).toBe("navigating");
    expect(args.navigate).toHaveBeenCalledWith("/zh/products?type=dc&compare=ast-9000%2Cst-hcdc-hpc&apex_qa=1#compare");
    expect(args.confirmNavigation).not.toHaveBeenCalled();
  });

  it("does nothing when the current document already has the requested language", () => {
    const args = { ...options(), nextLanguage: "en" as const, dirty: true };
    expect(requestLanguageNavigation(args)).toBe("unchanged");
    expect(args.confirmNavigation).not.toHaveBeenCalled();
    expect(args.navigate).not.toHaveBeenCalled();
  });

  it("blocks navigation during delivery without asking to discard the pending inquiry", () => {
    const args = { ...options(), pending: true, dirty: true };
    expect(requestLanguageNavigation(args)).toBe("blocked");
    expect(args.confirmNavigation).not.toHaveBeenCalled();
    expect(args.navigate).not.toHaveBeenCalled();
  });

  it.each(["dirty", "uncertain"] as const)("requires explicit confirmation for %s state", (flag) => {
    const args = { ...options(), [flag]: true, confirmNavigation: vi.fn(() => false) };
    expect(requestLanguageNavigation(args)).toBe("cancelled");
    expect(args.navigate).not.toHaveBeenCalled();
    expect(args.confirmNavigation).toHaveBeenCalledTimes(1);
    args.confirmNavigation.mockReturnValue(true);
    expect(requestLanguageNavigation(args)).toBe("navigating");
    expect(args.navigate).toHaveBeenCalledTimes(1);
  });
});
