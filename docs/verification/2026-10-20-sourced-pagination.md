# Sourced library and resource pagination

Date: 2026-10-20

## Content

The user requested direct references to SAITER solution and engineering materials inside the existing APEX Library and Resources, with page switching rather than one continuous list.

- All 24 library entries now cite their corresponding source page: six solutions and eighteen project-directory records. Source fields contain the publisher, a short English title, an original 25-45-word summary, the original URL and the evidence boundary.
- These summaries are not full article copies or bulk translations. No source photographs, logos, screenshots or reports have been republished. Previously unconfirmed media permissions remain unconfirmed.
- Source identities and reports are explicitly third-party references, not APEX delivery claims. The two topic-mismatched solution pages and the title-only project record are identified as limited evidence.
- Resources combines 22 existing APEX guides with six cited solution references. The first page interleaves three of each, under the existing APEX navigation and branding.

## Pagination and SEO

- Six records per page: Library has four pages; Resources has five. Filters and search reset pagination to the first page. All page links are real anchors, with normal Next navigation.
- Both routes read asynchronous `searchParams` on the server. Initial HTML matches the requested filters and page without requiring JavaScript to reveal that page's records. There is no runtime scraping or third-party image dependency.
- Unfiltered pages after page one have self-referencing page canonicals and page-specific titles. Filter variants consolidate to the root indexes. The original Resources root title and description are unchanged.
- History-based filters remain immediate. A guarded route refresh updates the server-owned title/canonical only when filter history has made them stale; no imperative head mutation is used.
- Resources JSON-LD describes only the visible APEX guides, not supplier sources as APEX-authored guides. The complete compact guide directory preserves all four historical topic anchors and every existing guide URL.
- Shared control visibility guards prevent WhatsApp from covering either the filters or the pagination. Mobile interface navigation is collapsible so material-type controls remain in the first viewport.

## Local verification

- `npm test`: 157 tests in 49 files passed. Includes source coverage, pagination coverage without duplicates, parameter validation, literal `all` searches, category membership and metadata variants.
- `npm run typecheck`, `npm run lint`, `npm run build` and `git diff --check`: passed.
- `npm audit --omit=dev`: zero production vulnerabilities. Lucide supplies the external-link and pagination icons; no unrelated dependency versions were upgraded.
- HTTP checks without a browser verified every page's initial HTML: 24 Library records across four pages and 28 Resource records across five pages, six per page except the four-record final resource page. Canonicals matched each unfiltered page.
- Isolated Playwright traversed both complete lists through Next-page links, confirming all unique records. Back/reload, type/category reset, keyboard radio changes, multiword typing, literal `all`, no-results/reset and secure source link targets passed.
- The reported metadata edge case was exercised on both routes: enter page two, choose a category, verify the root canonical and root title, then go back and verify page-two metadata. Search after page two also restored the correct canonical.
- Screenshots reviewed at 320x568, 390x844, 768x1024, 1280x900 and 1440x1000 on both routes. No horizontal overflow; pagination remained unobstructed. Resources material-type controls begin at y=391 on the 320-pixel viewport. Mobile interface expansion exposes all six links.
- Resource JSON-LD contained three visible guides on the first page and zero APEX guide records in source-only mode. No browser page errors were observed.
- Local production-build audit, with production-origin requests mapped to localhost: 54 sitemap pages, 113 internal targets and 12 noindex downloads passed; no broken links, orphan pages, duplicate root metadata, canonical, H1 or alt errors.

Browser artifacts are ignored files under `output/playwright/source-*.png`. No live inquiry was submitted and optional analytics was not accepted during QA.
