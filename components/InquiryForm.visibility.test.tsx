import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Children, isValidElement, type ChangeEvent, type ReactNode } from "react";
import { inquiryMessages } from "@/lib/i18n/messages-inquiry";

const hooks = vi.hoisted(() => ({
  effects: [] as Array<() => void | (() => void)>,
  setters: [] as ReturnType<typeof vi.fn>[],
  feedback: null as { type: "success" | "error"; text: string } | null,
}));

vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effects.push(effect); },
  useRef: (current: unknown) => ({ current }),
  useState: (value: unknown) => {
    const initial = hooks.setters.length === 1 && hooks.feedback ? hooks.feedback : value;
    const setter = vi.fn();
    hooks.setters.push(setter);
    return [initial, setter];
  },
  useCallback: (callback: unknown) => callback,
}));
vi.mock("@/components/LanguageProvider", () => ({
  T: ({ children }: { children: unknown }) => children,
  useLanguage: () => ({ t: (text: string) => text }),
}));

import { InquiryForm } from "@/components/InquiryForm";

function findPrivacyLink(node: ReactNode): Record<string, unknown> | undefined {
  if (!isValidElement<{ href?: string; children?: ReactNode }>(node)) return;
  if (node.type === "a" && node.props.href === "/privacy-policy") return node.props;
  for (const child of Children.toArray(node.props.children)) {
    const link = findPrivacyLink(child);
    if (link) return link;
  }
}

function editField(tree: ReturnType<typeof InquiryForm>, name: string) {
  class Input { constructor(public name: string) {} }
  vi.stubGlobal("HTMLInputElement", Input);
  vi.stubGlobal("HTMLTextAreaElement", class {});
  tree.props.onChange({ target: new Input(name) } as unknown as ChangeEvent<HTMLFormElement>);
}

describe("InquiryForm interaction protections", () => {
  beforeEach(() => {
    hooks.effects.length = 0;
    hooks.setters.length = 0;
    hooks.feedback = null;
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

  it("opens the privacy policy safely without navigating away from the draft", () => {
    const link = findPrivacyLink(InquiryForm({}));
    expect(link).toMatchObject({
      href: "/privacy-policy",
      target: "_blank",
      rel: "noopener noreferrer",
      "aria-label": "Privacy Policy (opens in a new tab)",
      title: "Privacy Policy (opens in a new tab)",
    });
    expect(inquiryMessages["Privacy Policy (opens in a new tab)"]).toBe("隐私政策（在新标签页打开）");
  });

  it("clears the previous success confirmation when a new inquiry is started", () => {
    hooks.feedback = { type: "success", text: "Sent" };
    const tree = InquiryForm({});
    editField(tree, "name");
    expect(hooks.setters[1]).toHaveBeenCalledWith(null);
  });

  it("does not hide delivery uncertainty when the user edits a field", () => {
    hooks.feedback = { type: "error", text: "Your inquiry may have reached us." };
    const tree = InquiryForm({});
    editField(tree, "email");
    expect(hooks.setters[1]).not.toHaveBeenCalled();
  });

  it("does not treat the honeypot field as a new inquiry", () => {
    hooks.feedback = { type: "success", text: "Sent" };
    const tree = InquiryForm({});
    editField(tree, "website");
    expect(hooks.setters[1]).not.toHaveBeenCalled();
  });
});
