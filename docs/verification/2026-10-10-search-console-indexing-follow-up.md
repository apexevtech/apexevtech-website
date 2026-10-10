# Search Console indexing follow-up

Date: 2026-10-10

## Current Search Console status

The Page indexing report was last updated on 2026-10-04. The unfiltered report contains 41 indexed URLs and 34 non-indexed URLs. That total includes historical download and malformed URLs, so it is not a count of 34 broken HTML pages.

Filtering the report to `/sitemap.xml` isolates the URLs intentionally submitted for indexing:

- 39 indexed URLs
- 9 discovered but not yet indexed URLs
- 0 crawled but not indexed URLs

The current sitemap contains 53 canonical URLs, which is newer than the report snapshot. Search Console therefore needs to recrawl before its totals reflect the current site.

## Validation requested

Validation started successfully on 2026-10-10 for these nine sitemap HTML URLs:

- `/applications`
- `/interfaces/ccs2-ev-charger-testing`
- `/interfaces/chademo-dc-charger-testing`
- `/interfaces/gbt-ev-charger-testing`
- `/interfaces/nacs-evse-testing`
- `/interfaces/type-1-j1772-evse-testing`
- `/interfaces/type-2-evse-testing`
- `/resources/dc-fast-charger-testing-guide`
- `/resources/ev-charger-testing-guide`

Search Console lists the last crawl date as unavailable for all nine. The validation request asks Google to revisit the group; completion depends on Google's crawl schedule.

## Expected exclusions

The 23 URLs in the unfiltered “Crawled - currently not indexed” group are DOCX downloads or legacy `/product-documents/*.docx` addresses. Current download responses intentionally include `X-Robots-Tag: noindex, nosnippet`, and legacy document addresses redirect to the canonical `/downloads/` files. These files should remain excluded from the web index, so no new validation request was started for this group.

The single 404 example is the historical malformed URL `/$`. Returning 404 is the correct response. Its existing validation started on 2026-09-07.

## Other reports checked

- Breadcrumbs, updated 2026-10-08: 0 invalid items and 4 valid items.
- HTTPS, updated 2026-10-04: 0 non-HTTPS URLs and 11 HTTPS URLs.
- Core Web Vitals, updated 2026-10-08: insufficient field data for both mobile and desktop. Current Lighthouse lab checks pass, including a 1.1-second home-page LCP and zero CLS.

No additional code defect was identified in these reports. The next review should compare indexing totals after Google completes the validation and refreshes the report snapshot.
