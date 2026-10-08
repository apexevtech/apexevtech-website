# Project evidence and trust-content optimization

Date: 2026-10-08

## Change

The four published application architectures now include a workflow-specific project evidence plan. Each plan identifies the records that engineering, quality and acceptance teams should agree before configuration:

- configuration, site, variant or system-boundary baselines;
- reference sessions, scenario matrices or fixture checks;
- synchronized communication and electrical measurements;
- engineering review, escalation, retest or subsystem finding records.

The application index title and description now present these pages as EV charger testing project examples. The About page also links to the four reference project architectures as part of the site's published technical evidence.

## Claim boundary

Each application page states that the evidence plan is a recommended record set. It does not claim a named customer delivery, certification or measured customer outcome. Project-specific claims still require corresponding approved records.

## Verification

- `npm test`: 37 files and 81 tests passed.
- `npm run build`: passed; 53 static pages generated.
- `npm run typecheck`: passed.
- Desktop and 390-pixel mobile layouts were checked with Playwright.
- The local application page returned HTTP 200 and exposed the new evidence section and working internal links.

The local browser console only reported development-mode CSP and hot-reload WebSocket messages caused by the test host. These paths are not used by the production build.

## Production release

- Source commit: `8af14ea`.
- Both configured Vercel checks completed successfully for the pushed commit.
- Production alias: `https://www.link-jl.com`.
- `/applications`, `/applications/integrated-ev-charger-validation-laboratory` and `/about` returned HTTP 200.
- Live HTML exposed the updated application title, `Project evidence plan`, `Evidence boundary` and the About-page count of four reference project architectures.
- The verified Vercel response ID was `sfo1::z4xww-1791432297319-69ce869f66b8`.
- All 48 canonical URLs were submitted to IndexNow after the production update.

The direct Vercel CLI attempt reported an expired local authorization, while the repository's GitHub-to-Vercel production integration deployed both configured projects successfully.
