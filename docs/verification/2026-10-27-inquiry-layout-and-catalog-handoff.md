# Inquiry layout and catalog handoff

Date: 2026-10-27 (Asia/Shanghai).

## Scope

Two observed workflow problems are addressed. No search titles, descriptions,
technical specifications, analytics consent rules or backend delivery behavior
are changed. No ranking, click-through or genuine lead improvement is inferred.

## Changes

- Inquiry forms expose their viewport visibility with the existing
  `IntersectionObserver` pattern. The floating WhatsApp action yields while a
  form is visible, while a form retains focus, or while cookie preferences are
  open, at every breakpoint. Existing inline WhatsApp links remain available.
  The floating action returns after the user leaves those regions.
- Catalog and comparison inquiry links preserve both the current validated
  charger/interface/workflow filters and up to three valid selected models.
  Product-only comparisons retain their existing link behavior.
- A single query-state subscription synchronizes filters and comparison in the
  explorer. Hidden selected models remain selected, including zero-result
  filters; they are explicitly candidates for engineering review, not guaranteed
  matches for every requirement.
- The inquiry template separates candidate models from requested test scope.
  Existing structured configuration validation and protection for manually
  edited or deliberately cleared messages remain in use.

## Local Verification

The production build used the existing public analytics IDs. Browser contexts
were isolated against `http://127.0.0.1:3002`; external requests were blocked
before navigation and inquiry responses were mocked locally. A successful mock
used `leadRecorded: false`. No real email or provider analytics event was sent.
The user's existing development server on port 3001 was not stopped or changed.

| Check | Result |
| --- | --- |
| Unit/component tests | 378 tests across 85 files passed. |
| ESLint | Passed. |
| Production build and TypeScript | Passed. |
| Floating-control layout | 479 assertions passed across EN/ZH and 320/390/640/768/1024/1440/1920px widths. |
| Form states | Unfocused, focused, blurred, requirements expanded, privacy and submit controls, and mocked error/success checked. No floating-button obstruction or horizontal overflow. |
| Cookie preferences | EN/ZH at 768x390 fit the viewport and hide the floating action; closing restores it when otherwise unobstructed. |
| Product pages | Floating action appears before/after the form region; existing product-specific WhatsApp href/context remains intact. |
| Joint inquiry handoff | Five browser scenarios passed, including both actual inquiry links, zero-result/hidden selections, browser back/forward, three-model limit, invalid/duplicate parameters, reset and clear, and EN/ZH edited/cleared drafts. |
| Intercepted inquiry payload | Edited message, model context, `/products` source page and structured configuration retained. No actual delivery. |
| Browser errors | Zero in the completed layout and handoff checks. |

Representative screenshots were inspected. Ignored local artifacts:

- `output/playwright/inquiry-floating-layout-20261027.js`
- `output/playwright/inquiry-floating-20261027-*.png`
- `output/playwright/catalog-joint-inquiry-check.js`

Deployment checks follow the commit containing this report. Its CI and hosting
statuses identify the published version; local verification alone is not proof
of production deployment or provider analytics ingestion.
