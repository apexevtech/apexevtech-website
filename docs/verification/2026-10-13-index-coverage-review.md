# Index coverage review

Date: 2026-10-13

The Search Console page-indexing report was last updated on 2026-10-09 and lists 48 indexed URLs and 32 excluded URLs. The exclusions are not 32 missing HTML pages:

| Report reason | Count | Current interpretation |
| --- | ---: | --- |
| Crawled, currently not indexed | 24 | 23 intentionally non-indexable Word downloads and one resource page that is now indexed |
| Page with redirect | 1 | Historical malformed `https://www.link-jl.com/&`; redirect exclusion is expected |
| Not found (404) | 1 | Historical malformed `https://www.link-jl.com/$`; validation is already in progress |
| Discovered, currently not indexed | 6 | Interface guide URLs; the group validation passed, but the report snapshot has not fully refreshed |

Live URL Inspection confirms that `/resources/ev-charger-testing-guide` and `/interfaces/ccs2-ev-charger-testing` are indexed. The remaining interface guides are valid index candidates and are present in `sitemap.xml` and internal navigation:

- `/interfaces/chademo-dc-charger-testing`
- `/interfaces/gbt-ev-charger-testing`
- `/interfaces/nacs-evse-testing`
- `/interfaces/type-1-j1772-evse-testing`
- `/interfaces/type-2-evse-testing`

Production checks confirm that all six interface URLs return HTTP 200, expose a self-referencing canonical URL and do not contain `noindex`. Word downloads return `X-Robots-Tag: noindex, nosnippet` as intended. A manual indexing request for the Type 2 interface guide was accepted and added to Google's priority crawl queue during this review.

No site-code defect was found. Recheck the report after Google refreshes the 2026-10-09 snapshot; do not request indexing for downloads, the redirect URL or the historical 404.

## 2026-10-14 follow-up

After receiving approval to submit the remaining interface URLs, URL Inspection showed `再次提交请求` for the CHAdeMO, GB/T, NACS and Type 1 pages. This confirms that each URL has already been submitted to Google's priority crawl queue. Google states that submitting the same URL again does not change its queue position or priority, so no duplicate requests were sent.
