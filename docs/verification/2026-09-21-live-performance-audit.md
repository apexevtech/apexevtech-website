# Live Lighthouse audit — 2026-09-21

Lighthouse 13.5.0 was run against the canonical production domain using headless Google Chrome. Reports are stored under the ignored local directory `output/lighthouse/`.

## Baseline

| Page / profile | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home mobile | 98 | 96 | 100 | 100 | 2.2 s | 0 ms | 0 |
| Product mobile | 97 | 97 | 100 | 100 | 2.1 s | 10 ms | 0 |
| Resources mobile | 98 | 96 | 100 | 100 | 1.6 s | 0 ms | 0 |
| Interface mobile | 100 | 96 | 100 | 100 | 0.9 s | 10 ms | 0 |
| Home desktop | 99 | 96 | 100 | 100 | 0.8 s | 0 ms | 0 |
| Product desktop | 99 | 97 | 100 | 100 | 0.7 s | 0 ms | 0 |

The only repeated actionable findings were insufficient contrast for small blue text on light gray surfaces and a logo-link accessible name that did not contain its visible text. Reported unused JavaScript was about 20 KB with estimated savings of 0–50 ms; removing shared navigation, consent or analytics-loading behavior was not justified by that result. Server response time varied between runs and the audited pages are statically generated.

## Changes

- Replaced the small-text blue `#1479c9` with `#1268a8`, improving contrast on white, `#f3f6f8` and `#f8fafc` surfaces.
- Replaced text-only cyan `#00a6c7` with `#067187`; cyan borders and backgrounds remain as visual accents.
- Changed the home-logo accessible name so it contains the visible company name.
- Added `.vercelignore` entries for local Lighthouse and Playwright artifacts so audit files are not uploaded in future deployments.

## Post-change mobile verification

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 97 | 100 | 100 | 100 | 1.7 s | 30 ms | 0 |
| Product | 99 | 100 | 100 | 100 | 1.5 s | 0 ms | 0 |
| Interface | 98 | 100 | 100 | 100 | 2.0 s | 0 ms | 0 |

The two repeated accessibility audit failures were cleared on all three retested page types. Performance remained 97–99. Lighthouse is a controlled lab test and individual response and paint timings vary, so these figures do not replace Search Console Core Web Vitals or real-user monitoring.

The accessibility changes were deployed as `dpl_EGQT6Z45Mhp4qtX3SrAygmJGX67q`, which reached `READY` and was assigned to `https://www.link-jl.com`.
