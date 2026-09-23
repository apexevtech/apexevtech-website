# GA4 custom dimensions and final checks

Date: 2026-09-23

## GA4 configuration

The authenticated `APEX Website` GA4 property initially had no custom dimensions. The following event-scoped dimensions were created:

| Display name | Event parameter |
| --- | --- |
| Form context | `form_context` |
| Product models | `product_models` |
| CTA location | `location` |
| Interaction reason | `reason` |
| Compared models | `models` |

These definitions support the inquiry and product-comparison funnel without collecting names, email addresses, phone numbers, or message content. GA4 does not backfill custom dimensions, so reporting starts with events collected after creation.

## Repository checks

- `npm test`: 37 files and 80 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 51 static pages generated.
- `npm audit`: zero known vulnerabilities.

## Production checks

- `/`, `/products`, `/solutions`, `/resources`, `/contact`, `/sitemap.xml`, and `/robots.txt` returned HTTP 200.
- The malformed legacy paths `/$` and `/&` returned HTTP 308 to the homepage.
- Tencent enterprise-mail SPF remains published.
- `_dmarc.link-jl.com` is still absent.

## Remaining external action

DNSPod requires an interactive Tencent Cloud login before the DMARC record can be created. The login page has been opened in Chrome. A conservative initial record is `v=DMARC1; p=none; adkim=r; aspf=r; pct=100`; enforcement can be tightened after legitimate sender alignment is observed.
