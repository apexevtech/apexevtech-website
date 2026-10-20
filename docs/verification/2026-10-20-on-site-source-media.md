# On-site source content and images

Date: 2026-10-20

## Requested change

Remove every public link to SAITER while retaining source content and pictures inside the APEX website. The user subsequently confirmed image publication permission. The [internal image register](../operations/saiter-authorized-image-register-2026-10-20.md) records the nine selected assets and their original locations.

## Implementation

- Source titles are plain text with no external-link icon, anchor, new-tab behavior or click handler. Source attribution and the distinction from APEX delivery evidence remain visible.
- All 24 source URL fields were removed from the public data module. Original article URLs remain only in the internal research archive; no SAITER hostname or URL is serialized by the library data.
- Nine authorized images are hosted under `/assets/library/`: six solution illustrations and three accurately associated equipment/application references. No external image origin, hotlink, image anchor or redirect was added.
- Next Image uses the actual image dimensions, responsive sizes, descriptive alt text, a stable 16:9 display frame and `object-contain` to retain the full image. Mobile uses a single column; desktop library items place images beside their source summaries.
- Existing APEX guide links, filters, six-item pagination, metadata synchronization and inquiry actions are unchanged.

## Verification

- `npm test`: 161 tests in 50 files passed. Source-rendering tests cover all 24 records and reject outbound anchors, external-link hints and source hostnames. Data tests enforce local asset paths, all nine expected material associations and actual decoded image dimensions.
- `npm run build`, `npm run typecheck`, `npm run lint` and `git diff --check`: passed.
- An isolated Playwright browser scanned all four library pages and all five resource pages. No SAITER anchors, source URLs in the document or network requests to the source domain were found. All nine distinct pictures decoded from the local origin; clicking the first source title did not navigate. No page errors occurred.
- Both indexes were checked at 320x568, 390x844, 768x1024, 1280x900 and 1440x1000. Images rendered without horizontal overflow; the mobile portable-equipment reference was also visually inspected. Screenshots are ignored local artifacts under `output/playwright/onsite-*.png`.
- Local production-build audit passed for 54 sitemap pages, 113 internal targets and 12 noindex downloads. No broken links, orphan pages, duplicate root metadata, canonical, H1 or alt errors were found.

No live inquiry was submitted or optional analytics accepted during QA.

## Label follow-up

At the user's request, the visible publisher badge, image source caption and source-focused page introductions were removed. The Resources material-type label is now `Solutions`; its existing `type=sources` deep link is preserved. Accessibility labels and image alt text describe the material rather than its origin. Factual third-party attribution inside the summaries and the distinction from APEX delivery evidence were not rewritten as APEX project claims.

The same 161 tests, ESLint and production build passed. An isolated browser checked Resources solution filtering and Library pages one and four, confirming the removed labels, retained local images, no outbound source anchors and no horizontal overflow at 390 and 1440 pixels.
