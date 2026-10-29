import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hooks = vi.hoisted(() => ({ effects: [] as Array<() => void | (() => void)>, language: "en" as "en" | "zh", refresh: vi.fn() }));
vi.mock("react", async (importOriginal) => ({ ...await importOriginal<typeof import("react")>(), useEffect: (effect: () => void | (() => void)) => { hooks.effects.push(effect); } }));
vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: hooks.refresh }) }));
vi.mock("@/components/LanguageProvider", () => ({ useLanguage: () => ({ language: hooks.language, t: (text: string) => hooks.language === "zh" && text === "EV Charger Test Equipment & Testing Guides" ? "充电桩测试设备与技术指南" : text }) }));

import { CatalogMetadataSync } from "./CatalogMetadataSync";
import { siteUrl } from "@/lib/seo/site-urls";

describe("localized catalog head synchronization", () => {
  let documentState: { title: string; querySelector: ReturnType<typeof vi.fn> };
  beforeEach(() => {
    vi.useFakeTimers();
    hooks.effects.length = 0;
    hooks.language = "en";
    hooks.refresh.mockReset();
    documentState = { title: "EV Charger Test Equipment & Testing Guides | APEX", querySelector: vi.fn(() => ({ href: `${siteUrl}/project-cases?section=resources` })) };
    vi.stubGlobal("document", documentState);
    vi.stubGlobal("window", { setTimeout, clearTimeout });
  });
  afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

  it("does not refresh a matching English server-owned head", () => {
    CatalogMetadataSync({ title: "EV Charger Test Equipment & Testing Guides", path: "/project-cases?section=resources" });
    hooks.effects[0]();
    vi.runAllTimers();
    expect(hooks.refresh).not.toHaveBeenCalled();
  });

  it("does not refresh a matching Chinese paginated title or canonical", () => {
    hooks.language = "zh";
    documentState.title = "充电桩测试设备与技术指南 - 第 2 页 | APEX";
    documentState.querySelector.mockReturnValue({ href: `${siteUrl}/zh/project-cases?section=resources&page=2` });
    CatalogMetadataSync({ title: "EV Charger Test Equipment & Testing Guides - Page 2", path: "/project-cases?section=resources&page=2" });
    hooks.effects[0]();
    vi.runAllTimers();
    expect(hooks.refresh).not.toHaveBeenCalled();
  });

  it("refreshes a genuinely stale head and cancels a detached comparison", () => {
    hooks.language = "zh";
    CatalogMetadataSync({ title: "EV Charger Test Equipment & Testing Guides", path: "/project-cases?section=resources" });
    const cleanup = hooks.effects[0]();
    vi.runAllTimers();
    expect(hooks.refresh).toHaveBeenCalledOnce();
    hooks.refresh.mockClear();
    hooks.effects.length = 0;
    CatalogMetadataSync({ title: "EV Charger Test Equipment & Testing Guides", path: "/project-cases?section=resources" });
    const pendingCleanup = hooks.effects[0]();
    if (typeof pendingCleanup === "function") pendingCleanup();
    vi.runAllTimers();
    expect(hooks.refresh).not.toHaveBeenCalled();
    if (typeof cleanup === "function") cleanup();
  });
});
