# Search Console follow-up — 2026-09-16

Authenticated checks through the existing Chrome session confirmed:

| Product URL | Google index | Google canonical | Live test | Refresh request |
| --- | --- | --- | --- | --- |
| `/products/st-6680ca-dc` | Indexed; last indexed crawl 2026-09-07 01:51:34 | Inspected URL | Passed at 16:39; one valid breadcrumb, no Product enhancement error listed | Submitted; priority crawl queue confirmed |
| `/products/st-hcdc-hpc` | Indexed; last indexed crawl 2026-09-06 23:50:37 | Inspected URL | Passed at 16:40; one valid breadcrumb, no Product enhancement error listed | Submitted; priority crawl queue confirmed |

- The historical indexed snapshots still list one invalid Product enhancement for each product. The current live tests do not list that enhancement. Updated crawl requests were accepted; the indexed snapshots have not yet been verified as refreshed.
- The crawled/not-indexed validation detail still shows 15 pending, zero failed, validation started 2026-09-07. This historical validation list includes products that URL Inspection already confirms as indexed.
- Overall overview still shows 26 indexed and 18 not indexed.
- Sitemap report showed `/sitemap.xml` successfully read on 2026-09-16, with 27 discovered pages. Current live sitemap has 28 canonical URLs.
- Resubmitted `sitemap.xml`; Search Console explicitly confirmed successful submission. Discovery of the additional URL remains pending verification.
- Word downloads were retained. No removal, robots block or noindex directive was added for them.
- Repository/live audit passed for the 9 articles, 12 products, resource index and canonical robots/sitemap configuration.

These results confirm the two inspected products are indexed and refresh requests were accepted. They do not confirm completion of all 15 validation entries or indexing of every sitemap URL.
