# Navigation and inquiry polish

Date: 2026-10-28 (Asia/Shanghai).

## Scope

This release improves existing inquiry and reading workflows. It does not change
search titles/descriptions, product specifications, evidence claims, analytics
consent rules or backend email delivery. No ranking or conversion gain is inferred.

## Changes

- The form's privacy-policy link opens a separate tab with `noopener noreferrer`,
  an external-window icon and an EN/ZH accessible label. Reading it no longer
  navigates the original form away. No personal-information storage was added.
- Starting another inquiry clears the previous success confirmation. Editing
  still does not silently dismiss errors or uncertain-delivery warnings, and the
  hidden honeypot field does not count as a new inquiry.
- Contact details use their content height instead of stretching with the form.
  The panel heading is more compact and email/telephone targets are at least 44px.
- Gallery inquiry source URLs use the existing engineering-case pagination
  helper, so cases on pages 2 and 3 retain working source links. Validation accepts
  only derived valid targets and existing legacy/detail sources, not arbitrary
  page/query combinations.
- Guide breadcrumbs return to technical materials on the page containing that
  guide, with its material anchor. JSON-LD uses the same collection page without
  the fragment. Existing article URLs, canonical URLs, titles and descriptions
  remain unchanged.

## Local Verification

The optimized build ran at `http://127.0.0.1:3002`. Isolated browser contexts
blocked external requests before navigation and intercepted every inquiry API
attempt; success mocks used `leadRecorded: false`. No real email or provider
analytics event was sent. The user's development server was left untouched.

| Check | Result |
| --- | --- |
| Unit/component tests | 390 tests across 87 files passed. |
| Production build, TypeScript and ESLint | Passed. |
| Contact browser checks | 214 assertions passed, including EN/ZH at 320/390/768/1024/1440/1920px, nonstretching details, assistant expansion, feedback, floating-action avoidance and zero horizontal overflow. |
| Privacy-policy popups | Four EN/ZH filled/cleared-draft checks passed; original URL, language, fields and checkbox retained, popup pathname correct, `opener === null`, empty referrer, no extra inquiry. |
| Success/error state | Success disappears on new field edits; validation, network and uncertain-delivery warnings remain. No edit automatically submits. |
| Actual client timeout | Local request held for 21 seconds; the client's real timeout occurred at about 20.5 seconds. Editing did not dismiss the warning or retry. No backend request was made. |
| Guide return navigation | Last-page guide returns to page 8 and its correct card in EN/ZH at 390/1440px. UI and JSON-LD collection URLs agree; sticky header does not cover the target. |
| Case source navigation | Page 2/page 3 gallery inquiry payloads retain precise source/context; all three detail-origin cases retain their existing protocol. |
| No-JavaScript navigation | Explicit guide page 8 and case pages 2/3 contain the targets at 390/1440px and avoid the sticky header. |
| Static coverage | All 18 case source targets and 22 guide/card page relationships covered by focused tests, including invalid and legacy sources. |
| Inquiry safety | Seven expected local API interceptions in total: five contact checks and two source-payload checks. Zero real emails, external requests or browser page errors. |

Representative screenshots were inspected. Ignored local artifacts:

- `output/playwright/contact-ergonomics-20261028.js`
- `output/playwright/contact-timeout-20261028.js`
- `output/playwright/contact-ergonomics-20261028-*.png`
- `output/playwright/navigation-context-check.js`
- `output/playwright/navigation-guide-return-*.png`

Publication checks follow the commit containing this report. Its CI and hosting
statuses identify the published version; these local results are not themselves
proof of production deployment, analytics ingestion or real inquiry delivery.
