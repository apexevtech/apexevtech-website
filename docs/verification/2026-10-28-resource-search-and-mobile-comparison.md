# Resource search and mobile comparison

Date: 2026-10-28 (Asia/Shanghai).

## Changes

- Guide search now includes the existing published summary, section headings,
  paragraphs, checklists, FAQ questions/answers and decision-table fields. The
  existing Chinese keyword aliases remain; the lazy full translation dictionary
  is not added to the search bundle. Internal IDs, dates and URL metadata are not
  new search content. Empty queries skip full-text assembly and retain ordering.
- Comparison remains a single semantic table, with fixed parameter/model
  headers, an opaque corner, explicit cell/header relationships and a focusable
  bounded two-axis scroll region. Product values, three-model limit, filters,
  inquiry links and tracking are unchanged.
- At 320/390px, a model's data column fits the pane beside the fixed parameter
  column. A single model fits without horizontal scrolling; multiple models can
  be aligned and read as complete columns. Long model names wrap instead of
  being hidden under the parameter column during keyboard focus.
- The whole comparison uses the existing floating-control visibility contract,
  so WhatsApp does not cover selectors, specifications or inquiry actions.
- The footer privacy-policy link opens a separate tab with `noopener noreferrer`,
  an EN/ZH accessible name, a new-window icon and no unnecessary prefetch. Other
  footer navigation, the single Project Cases entry and contact tracking remain.

## Verification

| Check | Result |
| --- | --- |
| Unit/component tests | 418 tests across 88 files passed. |
| Production build, TypeScript and ESLint | Passed. |
| Search | Actual body-only queries `emergency shutdown` and `interlocks`, FAQ/matrix fields, existing Chinese aliases, topics, zero results, URL normalization, page clamping and history passed. |
| Comparison layout | EN/ZH at 320/390/768/1440px with 1/2/3 models: 24 layouts passed, no document-width overflow or WhatsApp collision. |
| Whole-column reading | At 320/390px each model header and all seven data cells fit beside the fixed label column when aligned. A single model has no horizontal overflow. |
| Keyboard and semantics | 48 model-link focus checks passed; native horizontal/vertical keyboard scrolling, sticky reference geometry, opaque stacking and `headers` relationships passed. |
| Inquiry handoff | Existing candidate models and charger/interface/workflow scope retained. No new compatibility claim is made. |
| Footer policy | Eight EN/ZH, 390/1440px filled/cleared-draft cases passed. Original URL, language, inputs and checkbox retained; popup has null opener and empty referrer. |
| Safety | Zero inquiry API calls, real emails, external requests and browser page errors in final isolated checks. All external/API routes were intercepted before navigation. |

The final optimized localhost build was checked without diagnostic exemptions.
Earlier floating-control and long-name/body clipping failures were fixed before
the final strict run. Representative screenshots were inspected.

Ignored local artifacts:

- `output/playwright/search-comparison-footer-check.js`
- `output/playwright/comparison-sticky-{320-en,390-zh,1440-en}.png`

## Remaining Boundaries

This release does not register GA4 account dimensions, activate report filters,
verify Google index status or add original measured reports/software screenshots.
No search title, product specification or partner delivery claim was changed.
Post-publication mobile performance samples are a separate baseline, not evidence
of real-user Core Web Vitals, analytics ingestion or ranking/CTR improvement.

CI and hosting statuses on this commit identify its published version. Local
verification alone is not proof that a production deployment has completed.
