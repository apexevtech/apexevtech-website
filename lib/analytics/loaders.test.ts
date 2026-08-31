import { describe, expect, it } from "vitest";
import { initializeAnalytics } from "@/lib/analytics/loaders";

function createDocument() {
  const scripts: Array<{ async: boolean; src: string }> = [];

  return {
    scripts,
    document: {
      createElement: () => ({ async: false, src: "" }),
      head: {
        appendChild: (script: { async: boolean; src: string }) => scripts.push(script),
      },
    },
  };
}

describe("initializeAnalytics", () => {
  it("initializes GA4 and Clarity after analytics consent", () => {
    const browserWindow: Record<string, unknown> = {};
    const { document, scripts } = createDocument();

    initializeAnalytics(browserWindow, document as unknown as Document, {
      measurementId: "G-TEST123",
      clarityProjectId: "clarity123",
    });

    expect(typeof browserWindow.gtag).toBe("function");
    expect(Array.isArray(browserWindow.dataLayer)).toBe(true);
    expect(typeof browserWindow.clarity).toBe("function");
    expect(scripts.map((script) => script.src)).toEqual([
      "https://www.googletagmanager.com/gtag/js?id=G-TEST123",
      "https://www.clarity.ms/tag/clarity123",
    ]);
  });
});
