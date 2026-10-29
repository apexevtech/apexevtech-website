import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Children, isValidElement, type ChangeEvent, type ReactNode } from "react";
import { inquiryMessages } from "@/lib/i18n/messages-inquiry";
import { InquiryRequirementsAssistant } from "@/components/InquiryRequirementsAssistant";
import { QueryStateSync } from "@/components/QueryStateSync";

const hooks = vi.hoisted(() => ({
  effects: [] as Array<() => void | (() => void)>,
  setters: [] as ReturnType<typeof vi.fn>[],
  feedback: null as { type: "success" | "error"; text: string } | null,
  language: "en" as "en" | "zh",
  pending: false,
}));

vi.mock("react", async (importOriginal) => ({
  ...await importOriginal<typeof import("react")>(),
  useEffect: (effect: () => void | (() => void)) => { hooks.effects.push(effect); },
  useRef: (current: unknown) => ({ current }),
  useState: (value: unknown) => {
    const initial = hooks.setters.length === 0 && hooks.pending ? true : hooks.setters.length === 1 && hooks.feedback ? hooks.feedback : value;
    const setter = vi.fn();
    hooks.setters.push(setter);
    return [initial, setter];
  },
  useCallback: (callback: unknown) => callback,
}));
vi.mock("@/components/LanguageProvider", () => ({
  T: ({ children }: { children: unknown }) => children,
  useLanguage: () => ({ t: (text: string) => text, language: hooks.language }),
}));

import { InquiryForm } from "@/components/InquiryForm";

function findPrivacyLink(node: ReactNode): Record<string, unknown> | undefined {
  if (!isValidElement<{ href?: string; children?: ReactNode }>(node)) return;
  if (node.type === "a" && node.props.href?.endsWith("/privacy-policy")) return node.props;
  for (const child of Children.toArray(node.props.children)) {
    const link = findPrivacyLink(child);
    if (link) return link;
  }
}

function findElement(node: ReactNode, type: unknown): Record<string, unknown> | undefined {
  if (!isValidElement<{ children?: ReactNode }>(node)) return;
  if (node.type === type) return node.props;
  for (const child of Children.toArray(node.props.children)) {
    const found = findElement(child, type);
    if (found) return found;
  }
}

function editField(tree: ReturnType<typeof InquiryForm>, name: string) {
  class Input { constructor(public name: string) {} }
  vi.stubGlobal("HTMLInputElement", Input);
  vi.stubGlobal("HTMLTextAreaElement", class {});
  vi.stubGlobal("HTMLSelectElement", class {});
  tree.props.onChange({ target: new Input(name) } as unknown as ChangeEvent<HTMLFormElement>);
}

describe("InquiryForm interaction protections", () => {
  beforeEach(() => {
    hooks.effects.length = 0;
    hooks.setters.length = 0;
    hooks.feedback = null;
    hooks.language = "en";
    hooks.pending = false;
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

  it("opens the Chinese privacy policy without changing new-tab protections", () => {
    hooks.language = "zh";
    expect(findPrivacyLink(InquiryForm({}))).toMatchObject({ href: "/zh/privacy-policy", target: "_blank", rel: "noopener noreferrer" });
  });

  it("exposes pristine, pending and uncertain-delivery markers for the language navigation guard", () => {
    const pristine = InquiryForm({});
    expect(pristine.props["data-inquiry-dirty"]).toBe(false);
    expect(pristine.props["data-inquiry-pending"]).toBe(false);
    expect(pristine.props["data-inquiry-uncertain"]).toBe(false);
    hooks.setters.length = 0;
    hooks.pending = true;
    expect(InquiryForm({}).props["data-inquiry-pending"]).toBe(true);
    hooks.setters.length = 0;
    hooks.pending = false;
    hooks.feedback = { type: "error", text: "We could not confirm delivery. Your inquiry may have reached us. Your entries are still here; please contact us by email to confirm before sending again." };
    expect(InquiryForm({}).props["data-inquiry-uncertain"]).toBe(true);
    hooks.setters.length = 0;
    hooks.feedback = { type: "error", text: "Please try again." };
    expect(InquiryForm({}).props["data-inquiry-uncertain"]).toBe(false);
  });

  it("marks changed input and deliberately cleared message drafts without recording honeypot edits", () => {
    const tree = InquiryForm({});
    const dirtySetter = hooks.setters.at(-2)!;
    editField(tree, "website");
    expect(dirtySetter).not.toHaveBeenCalled();
    editField(tree, "name");
    expect(dirtySetter).toHaveBeenLastCalledWith(true);
    dirtySetter.mockClear();
    class Textarea { name = "message"; value = ""; }
    vi.stubGlobal("HTMLTextAreaElement", Textarea);
    tree.props.onInput({ target: new Textarea() } as unknown as Parameters<typeof tree.props.onInput>[0]);
    expect(dirtySetter).toHaveBeenLastCalledWith(true);
  });

  it("does not mark automatic prefill as a manual edit but protects actively applied requirements", () => {
    const tree = InquiryForm({ prefillProductsFromQuery: true });
    const dirtySetter = hooks.setters.at(-2)!;
    const textareaProps = findElement(tree, "textarea")!;
    const textarea = { value: "", focus: vi.fn() };
    (textareaProps.ref as { current: unknown }).current = textarea;
    const sync = findElement(tree, QueryStateSync)!.onChange as (params: URLSearchParams) => void;
    sync(new URLSearchParams("products=ast-9000"));
    expect(textarea.value).toContain("AST-9000");
    expect(dirtySetter).not.toHaveBeenCalled();
    const apply = findElement(tree, InquiryRequirementsAssistant)!.onApply as (summary: string) => boolean;
    expect(apply("Test requirements:\nCCS2 DC")).toBe(true);
    expect(dirtySetter).toHaveBeenLastCalledWith(true);
    expect(textarea.focus).toHaveBeenCalledOnce();
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
