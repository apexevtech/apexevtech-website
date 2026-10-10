# Site audit and printable guide verification

Date: 2026-10-10

## Production crawl

The repeatable `npm run audit:site` command audited the production sitemap and internal link graph:

- 53 sitemap pages returned successfully;
- 101 unique internal link targets were checked;
- 12 linked specification downloads returned successfully and included `X-Robots-Tag: noindex`;
- no broken internal links or orphan sitemap pages were found;
- no duplicate titles or meta descriptions were found;
- no canonical, H1 or missing image-alt errors were found.

URL comparison removes fragments, query strings and insignificant trailing slashes so valid filtered, contextual-contact and home links are not reported as false orphan or sitemap errors.

## Printable engineering guides

The three search-priority guides with decision tools now expose a `Print or save as PDF` action. The print layout:

- removes navigation, conversion controls, floating contact controls and related-content sections;
- retains the guide title, attribution, dates, practical sections, representative equipment, decision table, scope note and questions;
- uses the full three-column decision table for print while retaining cards on small screens;
- emits a consent-aware `guide_print` analytics event before opening the browser print dialog.

Playwright confirmed the action is exposed to assistive technology and generated a print-media PDF from the system-selection guide. The production build, TypeScript, ESLint and existing test suite passed.
