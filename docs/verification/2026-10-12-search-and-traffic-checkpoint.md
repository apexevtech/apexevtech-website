# Search and traffic checkpoint

Date: 2026-10-12

## Search Console

The latest 28-day performance report was updated about 54.5 hours before review and covers 2026-09-12 through 2026-10-09:

| Metric | Current report | Previous checkpoint |
| --- | ---: | ---: |
| Clicks | 5 | 4 |
| Impressions | 379 | 366 |
| CTR | 1.3% | 1.1% |
| Average position | 22.0 | 23.0 |

The nine sitemap URLs previously reported as discovered but not indexed now show validation **Passed**. The page-indexing totals still use the 2026-10-04 snapshot (41 indexed and 34 excluded), so those totals have not yet caught up with the validation result or current 53-URL sitemap.

The Product snippets issue for missing `offers`, `review` or `aggregateRating` now shows **Validation found no issues**. Google recrawled the remaining example, `/products/st-hcac-gb-ua-ea`, on 2026-10-10. The report still displays one historical invalid item while its summary catches up.

## Search opportunities

| Query | Clicks | Impressions | Query position | Main landing page | Page impressions | Page position |
| --- | ---: | ---: | ---: | --- | ---: | ---: |
| `evse end-of-line testing` | 0 | 31 | 7.8 | `/resources/evse-end-of-line-testing` | 30 | 5.7 |
| `evse testing after commissioning` | 0 | 33 | 12.3 | `/resources/post-installation-evse-testing` | 28 | 6.8 |
| `charger testing system` | 0 | 18 | 11.6 | system-selection content cluster | — | — |
| `emobility protocol testing` | 0 | 12 | 12.3 | protocol-testing content cluster | — | — |
| `ccs protocol tester` | 0 | 12 | 18.8 | CCS equipment and interface cluster | — | — |

The first two are the strongest snippet-test candidates. Their reporting window ends before the 2026-10-10 content and internal-link deployment, so keep the current titles and descriptions unchanged until the planned review on or after 2026-10-24.

## Google Analytics

The latest complete 28-day report covers 2026-09-14 through 2026-10-11:

- 12 sessions, including 10 Direct, 1 Organic Search and 1 Unassigned.
- 6 engaged sessions and a 50% engagement rate.
- 1 minute 11 seconds average engagement time per session.
- 58 total events.
- Organic Search produced 1 engaged session, 23 seconds average engagement and 9 events; it recorded no key event.
- The inquiry exploration shows 5 active users, 1 form start and 1 recorded lead.
- The event overview contains 2 `whatsapp_click` events.

The sample is too small to infer a conversion trend, and some activity may include verification traffic. Keep the analytics configuration unchanged and compare equivalent complete periods after more organic sessions accumulate.

The GA4 event configuration was also checked directly. Both `generate_lead` and `whatsapp_click` remain marked as key events, and GA4 identifies the APEX Website data stream as active for both. The zero key-event count in the traffic-acquisition report therefore does not indicate that these events are disabled; the report should be rechecked after new qualifying sessions occur.

## Bing Webmaster Tools

- The 2026-07-12 through 2026-10-11 search-performance window contains 54 impressions, 1 click and a 1.85% CTR.
- The first click came from `bms to gb/t 2015 charger sequence`; the matching GBT conformance guide recorded 3 impressions, 1 click and an average position of 1.33.
- `/resources/ccs2-dc-fast-charger-testing` has 17 impressions at average position 4.47, and `/resources/type-2-ac-evse-testing` has 12 impressions at average position 4.58. These are early CTR candidates, but their samples are still too small for a title change.
- The sitemap is successful with 0 errors, 0 warnings and 53 discovered URLs; Bing last crawled it on 2026-10-10.
- IndexNow contains the latest submission for all 53 current URLs on 2026-10-10. No duplicate resubmission is needed while the site remains unchanged.
- Bing's SEO recommendations contain no high-severity errors. Its only page-level warning says the `/about` title is too short, but the live title is now `About Apex Power Systems | EV Charger Test Equipment | APEX` (59 characters), within Bing's stated 50–60-character guidance. Treat the warning as stale until Bing recrawls the page.
- A fresh Bing site scan could not be scheduled because the account currently shows a remaining scan quota of 0 pages. The production audit remains the current technical crawl evidence.

## Availability monitoring

UptimeRobot reports `www.link-jl.com` as Up on a five-minute check interval. The monitor shows 100% uptime, zero incidents in the latest 24 hours and 11 days of monitoring history.

## Production health

- Manual production audit passed on 2026-10-12.
- 53 sitemap pages and 101 internal link targets were checked.
- 12 linked downloads retain `noindex` headers.
- No broken links, orphan sitemap pages, duplicate metadata, canonical errors, H1 errors or image-alt errors were found.
- The scheduled production audit run on 2026-10-11 completed successfully.

## Next checkpoint

1. Recheck page-index totals after Search Console refreshes its 2026-10-04 snapshot.
2. Recheck the Product snippets summary after the successful validation propagates.
3. On or after 2026-10-24, compare complete post-change periods and test one snippet direction on the highest-opportunity eligible page.
4. Keep collecting source-approved company identity evidence and original technical assets before publishing external profiles or customer-facing evidence.
5. Recheck the two leading Bing pages after each reaches at least 30 impressions; use the same single-variable snippet-test rule as Google.
