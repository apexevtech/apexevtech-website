import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({
  effects: [] as Array<() => void | (() => void)>,
  setters: [] as ReturnType<typeof vi.fn>[],
}));

vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effects.push(effect); },
  useRef: (current: unknown) => ({ current }),
  useState: (value: unknown) => {
    const setter = vi.fn();
    hooks.setters.push(setter);
    return [value, setter];
  },
  useCallback: (callback: unknown) => callback,
}));
vi.mock("@/components/LanguageProvider", () => ({
  T: ({ children }: { children: unknown }) => children,
  useLanguage: () => ({ t: (text: string) => text }),
}));

import { InquiryForm } from "@/components/InquiryForm";

describe("InquiryForm floating-control protection", () => {
  beforeEach(() => {
    hooks.effects.length = 0;
    hooks.setters.length = 0;
  });
  afterEach(() => vi.unstubAllGlobals());

  it("marks a visible form before focus and restores floating controls when it leaves", () => {
    let notify: IntersectionObserverCallback | undefined;
    const observe = vi.fn();
    const disconnect = vi.fn();
    vi.stubGlobal("IntersectionObserver", class {
      constructor(callback: IntersectionObserverCallback) { notify = callback; }
      observe = observe;
      disconnect = disconnect;
    });
    const tree = InquiryForm({});
    const form = {} as HTMLFormElement;
    tree.props.ref.current = form;
    expect(tree.props["data-inquiry-form-visible"]).toBe(false);

    const cleanup = hooks.effects[1]();
    expect(observe).toHaveBeenCalledWith(form);
    const setVisible = hooks.setters.at(-1)!;
    notify?.([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(setVisible).toHaveBeenLastCalledWith(true);
    notify?.([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    expect(setVisible).toHaveBeenLastCalledWith(false);
    if (typeof cleanup === "function") cleanup();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("does not observe a detached form", () => {
    const observer = vi.fn();
    vi.stubGlobal("IntersectionObserver", observer);
    InquiryForm({});
    expect(hooks.effects[1]()).toBeUndefined();
    expect(observer).not.toHaveBeenCalled();
  });
});
