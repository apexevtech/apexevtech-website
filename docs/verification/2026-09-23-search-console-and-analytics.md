# Search Console and Analytics verification

Date: 2026-09-23

## Google Search Console

- Indexed pages: 30
- Not indexed pages: 14
- Crawled, currently not indexed: 12 legacy Word-document URLs
- Not found (404): 1 malformed legacy URL (`/$`)
- Page with redirect: 1 malformed legacy URL (`/&`)
- Discovered, currently not indexed: 0; validation passed
- A fresh validation was started for the 12 crawled legacy document URLs.
- Validation status after submission: started on 2026-09-23, 12 pending, 0 failed.

The affected document URLs now return permanent redirects to normalized `/downloads/` paths. The `/$` URL also redirects to `/`. The `&` URL is intentionally excluded because it is a redirect, so it does not require indexing.

Search performance at the time of verification:

- Total clicks: 1
- Total impressions: 183
- Average CTR: 0.5%
- Average position: 28.2

Queries with the highest impressions included `apex ev lab`, `dc fast charger testing`, `ev charger testing`, `evse testing after commissioning`, and `charger testing system`.

## Google Analytics 4

GA4 is receiving live data from the `APEX Website` web stream. The following site events appeared in the recent-events list:

- `catalog_download`
- `email_click`
- `file_download`
- `form_start`
- `generate_lead`
- `phone_click`
- `whatsapp_click`
- standard page, session, engagement, click, and scroll events

`generate_lead` is correctly marked as a key event.

For 2026-08-26 through 2026-09-22, GA4 reported:

- Active users: 8
- New users: 6
- Sessions: 32
- Event count: 199
- Average engagement time per active user: 6 minutes 36 seconds
- Session sources: 31 direct and 1 Google organic

The highest-viewed pages were the English homepage (35 views), solutions page (17), and contact page (15).

## Follow-up

Search Console validation runs asynchronously and should be checked again after Google has recrawled the redirected URLs. GA4 needs more organic traffic before conversion-rate comparisons are statistically useful.
