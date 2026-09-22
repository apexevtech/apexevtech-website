# Search content expansion — 2026-09-21

## Search demand used

The latest Search Console export showed early impressions for queries around DC fast charger testing, Type 2 EV charging station testers, EVSE end-of-line testing, post-commissioning testing, charger performance testing and conformance testing. The new content cluster maps those needs to the site's supported interfaces and products.

## New resource pages

| Search intent | Resource route |
| --- | --- |
| CCS2 DC fast charger testing | `/resources/ccs2-dc-fast-charger-testing` |
| GB/T DC charger conformance | `/resources/gbt-dc-charger-conformance-testing` |
| NACS AC EVSE testing | `/resources/nacs-ac-evse-testing` |
| Type 2 AC charging station testing | `/resources/type-2-ac-evse-testing` |
| EVSE end-of-line testing | `/resources/evse-end-of-line-testing` |
| Testing after installation or commissioning | `/resources/post-installation-evse-testing` |

Each page provides an answer summary, three substantive sections, implementation checklists, FAQs, relevant products and related technical guides. Existing indexed guides now link back into the new cluster, while product pages receive reciprocal resource links through the shared catalog data.

## Technical SEO coverage

- Every resource has a unique title, description, canonical URL and article structured data through the existing resource template.
- FAQ content is rendered on the page and included in structured data.
- All 15 resource slugs are statically generated and included in the sitemap.
- The resources index metadata now describes interface, conformance, production and field-testing coverage.
- Catalog tests verify unique slugs and ensure every related product and resource link resolves.

## Editorial references

Standards terminology was checked against the official ISO 15118-20, IEC 61851-1, IEC 61851-24 and SAE J3400 scopes. The pages describe test planning and equipment selection without claiming third-party certification or blanket standards coverage.

## Production deployment

Deployed to production as `dpl_47TouSi598jFo1ATWjcKEwLnA6F8`; Vercel reported `READY` and aliased the deployment to `https://www.link-jl.com`.

Post-deployment checks on the canonical domain confirmed:

- the homepage and resources index return HTTP 200;
- all six new resources return HTTP 200 with self-referencing canonicals, Article data and FAQ data;
- `sitemap.xml` contains 34 unique page entries and all six new resources;
- product documents retain `X-Robots-Tag: noindex`;
- the historical `/&` and `/$` malformed URLs redirect to the homepage.
