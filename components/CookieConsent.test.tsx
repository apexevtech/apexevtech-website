import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  effects: [] as Array<() => void | (() => void)>,
  setConsent: vi.fn(),
}));

vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effects.push(effect); },
  useState: () => ["unknown", hooks.setConsent],
}));
vi.mock("@/components/LanguageProvider", () => ({
  T: ({ children }: { children: unknown }) => children,
  useLanguage: () => ({ t: (text: string) => text }),
}));

import { CookieConsent } from "@/components/CookieConsent";

function createBrowser(saved?: string) {
  const values = new Map(saved ? [["apex-analytics-consent", saved]] : []);
  const listeners = new Map<string, (event: Partial<StorageEvent>) => void>();
  const frames: Array<() => void> = [];
  const browserWindow = {
    location: { search: "", reload: vi.fn() },
    performance: { getEntriesByType: () => [{ name: "https://www.link-jl.com/?apex_qa=1" }] },
    localStorage: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: vi.fn((key: string, value: string) => { values.set(key, value); }),
    },
    requestAnimationFrame: vi.fn((callback: () => void) => { frames.push(callback); return 1; }),
    cancelAnimationFrame: vi.fn(),
    addEventListener: vi.fn((name: string, callback: (event: Partial<StorageEvent>) => void) => { listeners.set(name, callback); }),
    removeEventListener: vi.fn((name: string) => { listeners.delete(name); }),
    apexAnalyticsConsent: undefined as string | undefined,
    apexAnalyticsTrafficClass: undefined as string | undefined,
    apexAnalyticsQueue: [{ name: "email_click", parameters: {} }],
  };
  vi.stubGlobal("window", browserWindow);
  return { browserWindow, listeners, frames };
}

describe("CookieConsent controls", () => {
  beforeEach(() => {
    hooks.effects.length = 0;
    hooks.setConsent.mockClear();
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-CONSENTTEST");
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("snapshots document traffic before consent and starts unknown without loading scripts", () => {
    const { browserWindow, frames } = createBrowser();
    const tree = CookieConsent();
    hooks.effects[0]();
    expect(tree?.props.children[0]).toBeNull();
    expect(tree?.props.children[1].props["data-cookie-preferences"]).toBe("true");
    expect(browserWindow.apexAnalyticsTrafficClass).toBe("qa");
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);
    frames[0]();
    expect(hooks.setConsent).toHaveBeenLastCalledWith("unknown");
  });

  it("pauses accepted SDKs synchronously when preferences are reopened, preserving the page", () => {
    const { browserWindow, listeners, frames } = createBrowser("accepted");
    CookieConsent();
    const cleanup = hooks.effects[0]();
    frames[0]();
    expect(hooks.setConsent).toHaveBeenLastCalledWith("accepted");
    listeners.get("apex-cookie-settings")?.({});
    expect(browserWindow.apexAnalyticsConsent).toBe("unknown");
    expect((browserWindow as unknown as Record<string, unknown>)["ga-disable-G-CONSENTTEST"]).toBe(true);
    expect(browserWindow.apexAnalyticsQueue).toEqual([]);
    expect(hooks.setConsent).toHaveBeenLastCalledWith("unknown");
    expect(browserWindow.location.reload).not.toHaveBeenCalled();
    if (typeof cleanup === "function") cleanup();
    expect(listeners.size).toBe(0);
    expect(browserWindow.cancelAnimationFrame).toHaveBeenCalledWith(1);
  });

  it("binds accept and reject to persisted, synchronous SDK control without reload", () => {
    const { browserWindow } = createBrowser();
    const tree = CookieConsent();
    hooks.effects[0]();
    const buttons = tree?.props.children[1].props.children[1].props.children;
    buttons[0].props.onClick();
    expect(browserWindow.apexAnalyticsConsent).toBe("accepted");
    expect(hooks.setConsent).toHaveBeenLastCalledWith("accepted");
    buttons[1].props.onClick();
    expect(browserWindow.apexAnalyticsConsent).toBe("declined");
    expect(hooks.setConsent).toHaveBeenLastCalledWith("declined");
    expect(browserWindow.location.reload).not.toHaveBeenCalled();
  });

  it("fails closed if a choice cannot be stored", () => {
    const { browserWindow } = createBrowser("accepted");
    browserWindow.localStorage.setItem.mockImplementation(() => { throw new Error("blocked"); });
    const tree = CookieConsent();
    hooks.effects[0]();
    tree?.props.children[1].props.children[1].props.children[0].props.onClick();
    expect(browserWindow.apexAnalyticsConsent).toBe("declined");
    expect(hooks.setConsent).toHaveBeenLastCalledWith("declined");
    expect(browserWindow.location.reload).not.toHaveBeenCalled();
  });

  it("applies cross-tab withdrawal while ignoring other storage areas and settings", () => {
    const { browserWindow, listeners } = createBrowser("accepted");
    CookieConsent();
    hooks.effects[0]();
    listeners.get("storage")?.({ key: "another-setting", newValue: "declined" });
    expect(browserWindow.apexAnalyticsConsent).toBe("accepted");
    listeners.get("storage")?.({ key: "apex-analytics-consent", newValue: "declined", storageArea: {} as Storage });
    expect(browserWindow.apexAnalyticsConsent).toBe("accepted");
    listeners.get("storage")?.({ key: "apex-analytics-consent", newValue: "declined" });
    expect(browserWindow.apexAnalyticsConsent).toBe("declined");
    expect(hooks.setConsent).toHaveBeenLastCalledWith("declined");
    listeners.get("storage")?.({ key: null, newValue: null });
    expect(browserWindow.apexAnalyticsConsent).toBe("unknown");
    expect(hooks.setConsent).toHaveBeenLastCalledWith("unknown");
    expect(browserWindow.location.reload).not.toHaveBeenCalled();
  });
});
