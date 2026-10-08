# Search growth, conversion and operations follow-up

Date: 2026-10-08

## 1. Search Console follow-up

The authenticated Search Console comparison showed the following for the latest complete 28-day period versus the preceding 28 days:

| Metric | Latest 28 days | Previous 28 days | Change |
| --- | ---: | ---: | ---: |
| Clicks | 4 | 0 | +4 |
| Impressions | 347 | 73 | +274 (+375.3%) |
| CTR | 1.2% | 0% | +1.2 percentage points |
| Average position | 22.3 | 33.4 | improved by 11.1 positions |

The leading zero-click queries included `evse testing after commissioning` (34 impressions), `evse end-of-line testing` (30), `charger testing system` (16), `mobile commissioning` (14), `evse testing` (14), `dc fast charger testing` (13) and `ccs protocol tester` (12).

The strongest landing pages were the EVSE end-of-line guide (39 impressions, 2 clicks), About page (47 impressions, 1 click) and CCS2 guide (12 impressions, 1 click). The system-selection, protocol, post-installation and product-index pages had meaningful impressions but no clicks.

## 2. Inquiry email delivery

The authenticated Resend dashboard showed two inquiry messages in the previous 30 days. The authorized production-delivery test displayed both sent and delivered events at 2026-09-23 10:28. No bounce or complaint was shown. `link-jl.com` is verified in Resend.

Public DNS still has no `_dmarc.link-jl.com` TXT record. SPF authorizes Tencent enterprise mail and `resend._domainkey.link-jl.com` publishes the Resend DKIM key. DNSPod requires Tencent Cloud account verification before the prepared monitoring policy can be added.

## 3. GA4 and Clarity conversion review

Authenticated GA4 data for the latest 28 days showed:

- 5 active users and 3 new users;
- 13 sessions, including one attributed to Google organic search;
- 2 minutes 53 seconds average engagement time;
- 67 events;
- no recent `form_start` or `generate_lead` sequence in the saved inquiry funnel.

Authenticated Clarity data for the previous 30 days showed:

- 17 sessions and 4 unique users;
- 2.88 pages per session;
- 58.31% average scroll depth;
- 7.8 minutes average active time;
- one form-submit session and one contact session;
- zero JavaScript-error sessions;
- three sessions with dead-click signals and four with quick-back signals.

Two long dead-click sessions matched prior quality-assurance activity. The one Google-referred session showed interest in DC testers and a click on the footer brand text. The footer brand is now a working homepage link.

## 4. Search-demand content

- Added `/resources/ev-charger-test-equipment-guide`, a distinct equipment-configuration and buying guide covering interfaces, power paths, communication, measurement, faults and acceptance.
- Reworked the CCS2 guide title and description around the observed `ccs protocol tester` query.
- Reworked the EVSE end-of-line and post-installation guide snippets around the highest-impression zero-click queries.
- Added the new guide to the resource topic navigation, related-resource graph, structured-data index and sitemap.

## 5. Product decision support

Every product detail page now includes a procurement checklist covering:

- interface and exact standard editions;
- connector, cable, measurement and load-path limits;
- evidence, accuracy and optional modules;
- accessories, acceptance, commissioning, training and support boundaries.

The checklist links to the new equipment buying guide. Product and resource sitemap dates were advanced only for the pages changed in this release.

## 6. Operations and external presence

- Production deployment through the GitHub-to-Vercel integration remains available.
- Next.js was upgraded from 16.3.5 to 16.4.0, Sharp to 0.35.5 and `source-map-js` to 1.2.2 through the non-breaking `npm audit fix` path.
- The production dependency audit now reports zero known vulnerabilities. Nine build-tool findings remain in the Tailwind 3 dependency tree; npm only offers a forced Tailwind 4 upgrade, so that breaking migration was not mixed into this release.
- Direct Vercel CLI authorization has expired and requires browser reauthorization.
- UptimeRobot requires Google OAuth reauthorization before the configured monitor and alert contacts can be tested.
- DNSPod requires Tencent Cloud account verification before DMARC can be published.
- Search results did not show a matching EV-charger LinkedIn company page or a definitive Google/Bing business listing.
- A Crunchbase profile using the same legal company name currently describes the transformer business and points to `apexpowerlink.com`; a separate EV-charger division identity should be confirmed before a public profile is created or edited.

## Verification

- `npm test`: 37 files and 81 tests passed.
- `npm run build`: passed; 54 static pages generated.
- `npm run typecheck`: passed.
- `npm audit --omit=dev --audit-level=high`: zero production vulnerabilities.
- The new resource page and a representative product page were checked in a real browser.
- The new guide exposed all four sections, FAQ content, related equipment, internal links and the inquiry CTA.
- The representative product page exposed the procurement checklist and equipment-guide link.

## Production release

Pending commit, deployment and live verification.
