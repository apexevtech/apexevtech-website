# APEX Website Traffic Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the repository-controlled SEO, AEO, attribution, analytics, conversion, and resource-content foundation defined by the approved traffic design.

**Architecture:** Keep the Next.js App Router site file-backed. Add pure typed modules for analytics, attribution, SEO graphs, resources, and URL inventory so behavior is unit-testable; client components only coordinate browser state and events. Use environment variables for real provider IDs and entity profiles, and emit nothing when values are absent.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript 5.7, Tailwind CSS 3, Vitest 4, Resend 6, Playwright CLI for browser acceptance.

**Spec:** `docs/superpowers/specs/2026-08-28-traffic-foundation-design.md`

## Global Constraints

- Do not invent certification numbers, customers, testimonials, statistics, prices, MOQ, delivery times, or response guarantees.
- Load GA4 and Clarity only after analytics consent and only when their public environment IDs exist.
- Keep at most five buyer-facing inquiry input groups: name, work email, company, country, and project requirements.
- Render FAQ schema only when the identical FAQ content is visible on the page.
- Populate `sameAs` only from validated real profile URLs.
- Preserve existing anti-spam, rate limiting, Resend delivery, privacy, and WhatsApp behavior.
- Leave `.DS_Store`, `public/.DS_Store`, `tsconfig.tsbuildinfo`, and the untracked RTF untouched.
- Use ASCII in source files unless existing product data requires otherwise.

---

### Task 1: Consent-Gated Analytics Contract

**Files:**
- Create: `lib/analytics/events.ts`
- Create: `lib/analytics/events.test.ts`
- Create: `components/AnalyticsScripts.tsx`
- Modify: `components/CookieConsent.tsx`
- Modify: `components/GoogleAnalytics.tsx`
- Modify: `components/WhatsAppButton.tsx`
- Modify: `components/Footer.tsx`
- Test: `components/WhatsAppButton.test.tsx`

**Interfaces:**
- Produces: `AnalyticsEventName`, `trackEvent(name, parameters?)`, and `AnalyticsScripts({ measurementId, clarityProjectId })`.
- Consumes: `NEXT_PUBLIC_GA_MEASUREMENT_ID` with backward-compatible fallback to `NEXT_PUBLIC_GA_ID`, and `NEXT_PUBLIC_CLARITY_PROJECT_ID`.

- [ ] **Step 1: Write the failing analytics contract tests**

```ts
import { describe, expect, it, vi } from "vitest";
import { trackEvent } from "@/lib/analytics/events";

describe("trackEvent", () => {
  it("pushes a supported event through gtag", () => {
    const gtag = vi.fn();
    Object.assign(globalThis, { window: { gtag } });
    trackEvent("whatsapp_click", { location: "floating" });
    expect(gtag).toHaveBeenCalledWith("event", "whatsapp_click", { location: "floating" });
  });

  it("does nothing when analytics is unavailable", () => {
    Object.assign(globalThis, { window: {} });
    expect(() => trackEvent("email_click")).not.toThrow();
  });
});
```

Extend `WhatsAppButton.test.tsx` to assert the anchor has a stable tracking location contract.

- [ ] **Step 2: Run the tests and verify failure**

Run: `npm test -- lib/analytics/events.test.ts components/WhatsAppButton.test.tsx`

Expected: FAIL because `lib/analytics/events.ts` and the tracking contract do not exist.

- [ ] **Step 3: Implement the analytics module and consent-gated scripts**

```ts
export type AnalyticsEventName =
  | "generate_lead"
  | "whatsapp_click"
  | "email_click"
  | "phone_click"
  | "catalog_download";

export function trackEvent(name: AnalyticsEventName, parameters: Record<string, string> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, parameters);
}
```

Declare `window.gtag` and `window.clarity` in the same module. `AnalyticsScripts` must render the existing GA loader plus a `next/script` Clarity bootstrap only for non-empty IDs. Update `CookieConsent` so accepted consent renders both providers, reopening settings can change the choice, and declined consent renders neither. Add `onClick` tracking to the floating WhatsApp action and footer email/phone/WhatsApp links with stable `location` values.

- [ ] **Step 4: Run focused verification**

Run: `npm test -- lib/analytics/events.test.ts components/WhatsAppButton.test.tsx && npm run typecheck`

Expected: all focused tests and type checking PASS.

- [ ] **Step 5: Commit Task 1**

```bash
git add lib/analytics components/AnalyticsScripts.tsx components/CookieConsent.tsx components/GoogleAnalytics.tsx components/WhatsAppButton.tsx components/Footer.tsx components/WhatsAppButton.test.tsx
git commit -m "feat: add consent gated conversion analytics"
```

### Task 2: UTM Attribution And Five-Field Inquiry Flow

**Files:**
- Create: `lib/attribution/utm.ts`
- Create: `lib/attribution/utm.test.ts`
- Create: `components/AttributionCapture.tsx`
- Create: `components/TrackedLink.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/InquiryForm.tsx`
- Modify: `lib/inquiries/types.ts`
- Modify: `lib/inquiries/validation.ts`
- Modify: `lib/inquiries/validation.test.ts`
- Modify: `lib/inquiries/email.ts`
- Modify: `lib/inquiries/email.test.ts`

**Interfaces:**
- Produces: `UtmAttribution`, `parseUtm(searchParams)`, `readAttribution()`, `captureAttribution()`, `clearAttribution()`, and `<TrackedLink eventName location />`.
- Consumes: `trackEvent` from Task 1 and inquiry validation/delivery contracts already in the repository.

- [ ] **Step 1: Write failing attribution and inquiry tests**

```ts
it("accepts only known, length-limited UTM fields", () => {
  const value = parseUtm(new URLSearchParams("utm_source=linkedin&utm_medium=referral&bad=x"));
  expect(value).toEqual({ utmSource: "linkedin", utmMedium: "referral" });
});

it("includes sanitized first and latest touch attribution", () => {
  const result = parseInquiry(validInput({
    phone: undefined,
    attribution: { firstTouch: { utmSource: "email-sig" }, latestTouch: { utmSource: "linkedin" } },
  }), NOW);
  expect(result).toMatchObject({ ok: true, isBot: false, value: { attribution: {
    firstTouch: { utmSource: "email-sig" }, latestTouch: { utmSource: "linkedin" },
  } } });
});
```

Update email tests to require attribution in the internal notification text/HTML and ensure it is escaped.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- lib/attribution/utm.test.ts lib/inquiries/validation.test.ts lib/inquiries/email.test.ts`

Expected: FAIL because attribution types and parsing do not exist and phone is still part of the form contract.

- [ ] **Step 3: Implement attribution capture and server validation**

```ts
export type UtmValues = Partial<Record<
  "utmSource" | "utmMedium" | "utmCampaign" | "utmContent" | "utmTerm",
  string
>>;
export type UtmAttribution = { firstTouch: UtmValues; latestTouch: UtmValues };
```

Map URL keys to camel-case properties, trim values, cap each at 120 characters, persist under `apex-utm-attribution-v1`, and preserve the first non-empty touch while replacing latest touch. Mount `<AttributionCapture />` once in `app/layout.tsx`. Sanitize the same shape in `parseInquiry`; never trust stored browser JSON.

- [ ] **Step 4: Convert the form and success state**

Remove the phone field from UI, payload types, validation, and email output. Keep name, email, company, country, and message/project requirements. On success, replace the editable form body with an accessible confirmation containing three actions: tracked WhatsApp, `/products`, and `/solutions`. Fire `generate_lead` once after a successful API response and clear site-owned attribution after it is attached to the submission.

- [ ] **Step 5: Run focused verification**

Run: `npm test -- lib/attribution/utm.test.ts lib/inquiries/validation.test.ts lib/inquiries/email.test.ts && npm run typecheck`

Expected: PASS, including malicious/oversized attribution cases and five-field form types.

- [ ] **Step 6: Commit Task 2**

```bash
git add lib/attribution components/AttributionCapture.tsx components/TrackedLink.tsx app/layout.tsx components/InquiryForm.tsx lib/inquiries
git commit -m "feat: attribute and improve website inquiries"
```

### Task 3: Typed SEO Graph, Stable URL Inventory, Robots, And Sitemap

**Files:**
- Create: `lib/seo/site-urls.ts`
- Create: `lib/seo/site-urls.test.ts`
- Modify: `lib/seo/structured-data.ts`
- Modify: `lib/seo/structured-data.test.ts`
- Modify: `app/layout.tsx`
- Modify: `app/robots.ts`
- Create: `app/robots.test.ts`
- Modify: `app/sitemap.ts`
- Create: `app/sitemap.test.ts`
- Modify: `app/about/page.tsx`
- Modify: `app/solutions/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/products/page.tsx`
- Modify: `app/products/[slug]/page.tsx`

**Interfaces:**
- Produces: `siteUrl`, `staticRoutes`, `buildBreadcrumbData`, `buildProductData`, `buildArticleData`, `buildFaqData`, and `getVerifiedSameAs`.
- Consumes: products from `data/site.ts`; resource routes from Task 4 may be added to URL inventory in Task 4.

- [ ] **Step 1: Write failing SEO behavior tests**

```ts
it("explicitly allows supported AI crawlers and blocks only APIs", () => {
  const value = robots();
  expect(value.rules).toEqual(expect.arrayContaining([
    expect.objectContaining({ userAgent: "OAI-SearchBot", allow: "/" }),
    expect.objectContaining({ userAgent: "GPTBot", allow: "/" }),
  ]));
});

it("omits invalid entity profiles", () => {
  expect(getVerifiedSameAs("https://linkedin.com/company/apex,not-a-url"))
    .toEqual(["https://linkedin.com/company/apex"]);
});
```

Add sitemap assertions for unique canonical URLs and stable ISO modification dates.

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- app/robots.test.ts app/sitemap.test.ts lib/seo/structured-data.test.ts lib/seo/site-urls.test.ts`

Expected: FAIL because helpers and explicit crawler rules do not exist.

- [ ] **Step 3: Implement URL inventory and structured-data builders**

Build typed JSON-LD objects from repository data and validate `NEXT_PUBLIC_ENTITY_PROFILES` as a comma-separated list of `https:` URLs. Keep one root `@graph` for Organization/WebSite, and render page-level JSON-LD next to visible page content. Product structured data may include model, description, image, brand, category, and URL; omit offers, ratings, GTIN, and availability because the repository does not prove them.

- [ ] **Step 4: Implement metadata, robots, and sitemap**

Give each static page explicit Open Graph title/description/url. Emit robots rules for `*`, `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended`, each allowing `/`; keep `/api/` disallowed for the general rule. Use checked-in content dates for static/product/resource routes so builds are deterministic.

- [ ] **Step 5: Run focused verification**

Run: `npm test -- app/robots.test.ts app/sitemap.test.ts lib/seo/structured-data.test.ts lib/seo/site-urls.test.ts && npm run typecheck`

Expected: PASS with no offer/review schema and no invalid `sameAs` URLs.

- [ ] **Step 6: Commit Task 3**

```bash
git add lib/seo app/layout.tsx app/robots.ts app/robots.test.ts app/sitemap.ts app/sitemap.test.ts app/about/page.tsx app/solutions/page.tsx app/contact/page.tsx app/products/page.tsx 'app/products/[slug]/page.tsx'
git commit -m "feat: strengthen search and AI discoverability"
```

### Task 4: File-Backed High-Intent Resource Cluster

**Files:**
- Create: `data/resources.ts`
- Create: `lib/resources/catalog.ts`
- Create: `lib/resources/catalog.test.ts`
- Create: `components/ResourceCard.tsx`
- Create: `components/StructuredData.tsx`
- Create: `app/resources/page.tsx`
- Create: `app/resources/[slug]/page.tsx`
- Modify: `app/sitemap.ts`
- Modify: `app/sitemap.test.ts`

**Interfaces:**
- Produces: `Resource`, `ResourceSection`, `resources`, `getResource(slug)`, `getRelatedResources(resource)`, and static params for `/resources/[slug]`.
- Consumes: SEO builders and URL inventory from Task 3, products from `data/site.ts`.

- [ ] **Step 1: Write failing resource catalog tests**

```ts
it("provides a unique, internally connected initial cluster", () => {
  expect(resources).toHaveLength(9);
  expect(new Set(resources.map((item) => item.slug)).size).toBe(9);
  for (const resource of resources) {
    expect(resource.summaryAnswer.length).toBeGreaterThan(80);
    expect(resource.relatedResourceSlugs.length).toBeGreaterThanOrEqual(2);
    expect(resource.relatedProductSlugs.length).toBeGreaterThanOrEqual(1);
  }
});

it("returns undefined for an unknown slug", () => {
  expect(getResource("missing")).toBeUndefined();
});
```

- [ ] **Step 2: Run tests and verify failure**

Run: `npm test -- lib/resources/catalog.test.ts app/sitemap.test.ts`

Expected: FAIL because the catalog and resource routes do not exist.

- [ ] **Step 3: Implement the typed content model and nine records**

```ts
export type Resource = {
  slug: string;
  title: string;
  description: string;
  topic: string;
  intent: "selection" | "comparison" | "technical" | "process";
  publishedAt: string;
  modifiedAt: string;
  summaryAnswer: string;
  sections: ResourceSection[];
  faqs: Array<{ question: string; answer: string }>;
  relatedProductSlugs: string[];
  relatedResourceSlugs: string[];
};
```

Write one pillar guide plus the eight approved focused resources. Use only facts supported by product records and existing site copy. Each article must answer its query in the first third, include at least one actionable checklist/table data structure, and avoid claims of certification, guaranteed compliance, proprietary measured performance, or market leadership.

- [ ] **Step 4: Implement hub and detail rendering**

The hub groups resources by buyer intent without card nesting. Detail pages render breadcrumbs, summary answer, section navigation, visible FAQs, related products/resources, Article/FAQ JSON-LD, and a trust-adjacent consultation CTA. Unknown slugs call `notFound()`. Add every resource to sitemap with its checked-in `modifiedAt`.

- [ ] **Step 5: Run focused verification**

Run: `npm test -- lib/resources/catalog.test.ts app/sitemap.test.ts && npm run typecheck`

Expected: PASS with nine unique resource routes and no orphaned content records.

- [ ] **Step 6: Commit Task 4**

```bash
git add data/resources.ts lib/resources components/ResourceCard.tsx components/StructuredData.tsx app/resources app/sitemap.ts app/sitemap.test.ts
git commit -m "feat: publish EVSE testing resource cluster"
```

### Task 5: Trust Placement And Internal Navigation

**Files:**
- Modify: `data/site.ts`
- Modify: `components/Header.tsx`
- Modify: `components/Footer.tsx`
- Modify: `app/page.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/products/[slug]/page.tsx`
- Create: `lib/navigation/internal-links.test.ts`

**Interfaces:**
- Produces: navigation access to `/resources`, trust strips adjacent to primary CTAs, and resource backlinks from products.
- Consumes: resource catalog from Task 4 and tracked links from Task 2.

- [ ] **Step 1: Write the failing navigation integrity test**

```ts
it("keeps every important route reachable and every resource linked", () => {
  expect(navItems).toContainEqual({ label: "Resources", href: "/resources" });
  for (const resource of resources) {
    expect(resource.relatedProductSlugs.length).toBeGreaterThan(0);
    expect(resource.relatedResourceSlugs.length).toBeGreaterThanOrEqual(2);
  }
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- lib/navigation/internal-links.test.ts`

Expected: FAIL because Resources is absent from navigation.

- [ ] **Step 3: Implement navigation and supported trust placement**

Add Resources to desktop/mobile navigation and footer. Immediately above primary inquiry actions, use only existing defensible signals: AC/DC coverage, named supported interface families, downloadable product documents, and requirement-led system configuration. Do not add certification badges, customer logos, testimonials, fabricated counts, MOQ, or prices. Add a Resources band on home and relevant resource links on product detail pages.

- [ ] **Step 4: Run focused verification**

Run: `npm test -- lib/navigation/internal-links.test.ts && npm run typecheck`

Expected: PASS and all important content remains within three clicks from `/`.

- [ ] **Step 5: Commit Task 5**

```bash
git add data/site.ts components/Header.tsx components/Footer.tsx app/page.tsx app/contact/page.tsx 'app/products/[slug]/page.tsx' lib/navigation/internal-links.test.ts
git commit -m "feat: connect trust and resource journeys"
```

### Task 6: IndexNow Tooling And Operator Runbook

**Files:**
- Create: `scripts/indexnow.mjs`
- Create: `scripts/indexnow.test.mjs`
- Modify: `package.json`
- Create: `.env.example`
- Create: `docs/operations/traffic-foundation-runbook.md`

**Interfaces:**
- Produces: `npm run indexnow`, deterministic URL batches, and an evidence-labeled 30/60/90-day checklist.
- Consumes: `NEXT_PUBLIC_SITE_URL`, `INDEXNOW_KEY`, generated sitemap endpoint, and real provider/entity IDs supplied by the operator.

- [ ] **Step 1: Write a failing Node test for IndexNow payload construction**

```js
import assert from "node:assert/strict";
import test from "node:test";
import { buildPayload } from "./indexnow.mjs";

test("buildPayload uses one host and canonical https URLs", () => {
  const payload = buildPayload("https://www.link-jl.com", "key", ["/", "/products"]);
  assert.equal(payload.host, "www.link-jl.com");
  assert.deepEqual(payload.urlList, ["https://www.link-jl.com/", "https://www.link-jl.com/products"]);
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `node --test scripts/indexnow.test.mjs`

Expected: FAIL because the script does not exist.

- [ ] **Step 3: Implement IndexNow submission and environment documentation**

Export pure `buildPayload`, then execute network submission only when the file is the main module. Reject missing keys, non-HTTPS site URLs, cross-host URLs, and non-2xx responses. Add `"indexnow": "node scripts/indexnow.mjs"`. `.env.example` lists variable names with empty values, including GA, Clarity, verified entity profiles, Resend, inquiry email, and IndexNow key; it must contain no secret.

- [ ] **Step 4: Write the runbook**

Document fixed `utm_source` values, campaign examples, provider setup/verification, DebugView checks for all five events, Clarity first-recording verification, IndexNow execution, GSC/Bing URL checks, UptimeRobot, entity profile consistency, response SOP, and 30/60/90-day content/off-site actions. Every item uses one state: `not configured`, `configured`, `submitted`, or `verified`; repository code alone may prove only `configured`.

- [ ] **Step 5: Run focused verification**

Run: `node --test scripts/indexnow.test.mjs && npm run typecheck && git diff --check`

Expected: PASS and `.env.example` contains names only.

- [ ] **Step 6: Commit Task 6**

```bash
git add scripts/indexnow.mjs scripts/indexnow.test.mjs package.json .env.example docs/operations/traffic-foundation-runbook.md
git commit -m "feat: add IndexNow and traffic operations runbook"
```

### Task 7: Full Build And Browser Acceptance

**Files:**
- Modify only files necessary to fix defects discovered by this acceptance task.
- Create: `docs/verification/2026-08-28-traffic-foundation-verification.md`

**Interfaces:**
- Consumes: all prior task deliverables.
- Produces: current runtime evidence for the design success criteria.

- [ ] **Step 1: Run complete automated checks**

Run: `npm test && node --test scripts/indexnow.test.mjs && npm run typecheck && npm run build && git diff --check`

Expected: all commands exit 0. Do not advance while any failure remains.

- [ ] **Step 2: Start the production server with test-only public IDs**

Run:

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST123 \
NEXT_PUBLIC_CLARITY_PROJECT_ID=clarity-test \
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3100 \
npm run dev -- --hostname 127.0.0.1 --port 3100
```

Expected: server reports ready at `http://127.0.0.1:3100`. If 3100 is occupied, choose the next free port and record it.

- [ ] **Step 3: Verify generated routes and internal links**

Inspect `/robots.txt`, `/sitemap.xml`, `/`, `/products`, one product detail, `/resources`, all nine resource details, `/contact`, and `/privacy-policy`. Confirm HTTP 200 for listed routes, one deliberate unknown resource returns 404, sitemap URLs are unique, and no internal anchor returns 4xx/5xx.

- [ ] **Step 4: Verify consent and conversion behavior in a real browser**

At 1440x900 and 390x844:

- before consent, GA and Clarity requests/scripts are absent;
- after consent, configured test scripts appear;
- reopening settings and declining prevents future loading after refresh;
- WhatsApp, email, phone, and catalog actions are reachable and labeled;
- a mocked successful inquiry contains five buyer fields plus safeguards/attribution, then shows WhatsApp, Products, and Solutions actions;
- no external email is sent during the mocked test.

- [ ] **Step 5: Capture visual and structural evidence**

Take screenshots of home, resource hub, a long resource detail, product detail, contact before submission, and contact success state at desktop and mobile widths. Check for nonblank images, readable text, no overlapping sticky/floating controls, no horizontal scroll, and no nested decorative cards.

- [ ] **Step 6: Write verification report and commit acceptance fixes**

Record exact commands, exit codes, route counts, tested viewports, screenshots, configured test IDs, known external operator tasks, and any unverified live provider state. Do not claim live GA4, Clarity, IndexNow, GSC, Bing, entity profiles, or UptimeRobot are verified unless directly observed.

```bash
git add docs/verification/2026-08-28-traffic-foundation-verification.md <acceptance-fix-files>
git commit -m "test: verify traffic foundation release"
```
