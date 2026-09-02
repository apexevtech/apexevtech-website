# Traffic Foundation Verification

Date: 2026-08-28
Branch: `feature/traffic-foundation`

## Automated Checks

- `npm test`: PASS, 13 files and 24 tests.
- `node --test scripts/indexnow-check.mjs`: PASS, 1 test.
- `npm run typecheck`: PASS.
- `npm run build`: PASS, 34 routes generated.
- `git diff --check`: PASS for committed source changes.

The isolated worktree install produced a second `package-lock.json`, so Next.js reports a workspace-root warning during build. This does not change the generated output. `npm install` also reported three high-severity audit advisories; no automatic dependency upgrade was applied.

## HTTP Route Checks

Against `http://127.0.0.1:3100` with test-only public analytics IDs:

- 200: `/robots.txt`, `/sitemap.xml`, `/`, `/products`, `/resources`, `/resources/choose-ev-charger-test-system`, `/contact`, `/privacy-policy`.
- 404: `/resources/missing`.
- Sitemap contains 27 unique `<loc>` entries.
- Robots output explicitly allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended, allows the general user agent, disallows `/api/`, and advertises the sitemap.

## Browser Checks

Playwright CLI screenshots were captured under `output/playwright/` for the resource detail and home page at desktop and mobile sizes. The tested resource detail had no horizontal overflow: document width 375px at a 390px viewport. The tested home page had no horizontal overflow: document width 1425px at a 1440px viewport.

Consent behavior was inspected on the home page:

- Before consent: GA4 and Clarity script nodes absent.
- After accepting analytics: both configured test script nodes present.

The browser console showed external provider/network errors after intentionally using fake test IDs; these are expected for test-only IDs and did not block rendering or navigation.

## External Operator Work Remaining

Live GA4 DebugView, Clarity recording, Search Console domain verification/indexing, Bing Webmaster verification/IndexNow acceptance, UptimeRobot alerts, Google Business Profile, Bing Places, LinkedIn, Crunchbase, directory profiles, and third-party content publication remain `not configured` or require authenticated evidence. The repository is not claiming those external states as complete.

## Production Recheck (2026-09-02, Asia/Shanghai)

Public production evidence was rechecked against `https://www.link-jl.com`:

- `200`: `/`, `/resources`, `/robots.txt`, `/sitemap.xml`, and `/google9c84864cc66064f8.html`.
- The sitemap contains 27 `<loc>` entries.
- The Google verification file returns exactly `google-site-verification: google9c84864cc66064f8.html`.
- `robots.txt` explicitly names GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended, and keeps `/api/` disallowed.

Authenticated Google Search Console checks on 2026-09-02 confirmed that `/sitemap.xml` was read successfully and 27 pages were discovered. URL Inspection also reported `https://www.link-jl.com/contact` as indexed.

### External Platform Evidence Matrix

| Platform | Configuration evidence | Authenticated platform evidence | Current status |
| --- | --- | --- | --- |
| GA4 | Production ID `G-EPSJV6EMLC` is configured; a prior browser run observed a consent-gated `page_view` request to Google Analytics. | A production contact submission completed successfully on 2026-09-02, but the realtime UI did not yet expose named event evidence during the check. | `configured`, event evidence pending |
| Microsoft Clarity | Production project ID `yas565j4eq` is configured and the consent-gated loader is deployed. | Clarity dashboard shows 2 recordings in the last 3 days, including a 30:41 session. | `verified` |
| Google Search Console | The verification file is publicly reachable and the sitemap is publicly valid. | Property ownership, sitemap submission status, and URL indexing status have not yet been observed in Search Console. | `site-ready`, not platform-verified |
| Bing Webmaster / IndexNow | The sitemap and IndexNow submission tooling are deployed. | Bing Webmaster's Google Search Console import reported `Website added successfully` for `https://www.link-jl.com/`; one sitemap was found/imported. Key file `https://www.link-jl.com/fb9c27dea786490f940bb8bc323c5406.txt` returned HTTP 200 with the expected key, and IndexNow accepted 27 sitemap URLs with HTTP 202. | `site-verified`, IndexNow submitted |
| UptimeRobot | The production HTTPS endpoint currently returns `200`. | Authenticated dashboard shows monitor `www.link-jl.com/` (HTTP), 5-minute interval, up for 1 day 16 hours, 100% uptime, and 0 incidents. Alert delivery test remains outstanding. | `verified`, alert test pending |

Platform completion remains open for UptimeRobot monitor creation, Clarity recording evidence, and any remaining event-level checks. Bing site import is recorded above from the authenticated dashboard result.
