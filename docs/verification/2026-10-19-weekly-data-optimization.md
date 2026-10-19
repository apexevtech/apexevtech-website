# Weekly data and conversion follow-up

Reviewed: 2026-10-19

Release status: the changes below were deployed on 2026-10-19 from commit
`258a5e1e23b83228c515e3c35110e426adf42dcb`. Earlier references to local-only work
describe the pre-release checks. The release verification at the end is current.

## Measurement baseline

Search Console property: `https://www.link-jl.com/`. The selected period was
2026-10-12 through 2026-10-18, compared with 2026-10-05 through 2026-10-11.
Recent data can still be revised by Google.

| Metric | Selected week | Previous week |
| --- | ---: | ---: |
| Search clicks | 3 | 1 |
| Search impressions | 218 | 138 |
| CTR | 1.4% | 0.7% |
| Average position | 24.1 | 33.8 |

The CCS2 DC fast charger guide received two clicks and the SAE J3400 / NACS
guide received one. The system-selection guide received 65 impressions versus
26, but no clicks. This small sample does not establish a conversion trend.

## Implemented locally

- Added AC, DC and laboratory equipment paths near the beginning of the
  system-selection guide, using existing equipment images and catalog links.
- Added `guide_equipment_click` and `guide_inquiry_click` to guide equipment
  links and inquiry calls to action, including the resource slug and location.
  These are navigation events, not confirmed leads.
- Preserved the guide titles, descriptions and opening answers during the
  existing observation period. Updated the selection guide's modification date.
- Preserved the editorial order of related equipment so the intended first
  model is used in the configuration worksheet.

## Analytics diagnosis and limits

GA4 property `551309073` reports zero active users and events for the selected
week. Production currently loads the expected Google tag `G-EPSJV6EMLC` and
Clarity tag `yas565j4eq` in the inspected consented browser. No missing tag or
incorrect measurement ID was established. Script presence does not prove that
collection requests reached Google or were retained in reports.

Do not bypass the analytics consent choice or interpret GA4's zero as proof of
zero visits. A consented visit from a network able to reach the collection
endpoint must be matched with GA4 Realtime/DebugView before declaring collection
fixed. Historical visits cannot be recovered by adding new events.

No email with `inquiry` in its subject was found in the inspected Gmail account
for the selected week. Resend was signed out, so delivery counts remain
unverified; this does not establish zero inquiries.

## Validation and next review

The 102-test suite and production build passed. Browser QA covers the new
selection paths, responsive layout and guide-to-inquiry navigation.

After deployment, verify a consented guide equipment click and inquiry click
in GA4 DebugView/Realtime. Record the deployment date before evaluating the new
events. On or after 2026-10-24, compare complete equal periods and check the
selection guide's query-level positions before deciding whether to test a new
search snippet. Do not attribute search CTR changes to on-page navigation alone.

These changes have not been deployed by this follow-up.

## Inquiry continuity follow-up

The contact form now observes URL changes during client navigation, with a
single priority order: valid compared products, supported catalog scope, guide
context, then the default inquiry context. Switching links clears stale product
labels and updates automatically generated drafts. A manually edited message
is preserved. Guide drafts now name the requested guide directly.

Filtered catalogs with matching equipment now include a configuration-review
link carrying the selected filters, in addition to the existing no-results
inquiry route. The new location is `catalog-matching-results` under the existing
`catalog_inquiry_click` event.

Validation: all 107 tests and the production build passed. Browser checks
confirmed DC filter handoff, preservation of a typed message during client
navigation, removal of an untouched AST-9000 draft when returning to the generic
contact route, and no horizontal overflow at a 390px mobile viewport.

## CCS2 and NACS conversion follow-up

The two guides receiving the selected week's search clicks now show equipment
paths before the article contents. CCS2 paths distinguish high-power diagnosis,
portable testing and laboratory integration, with explicit protocol and external
load configuration boundaries. The NACS guide recommends only the published
NACS AC platform; the Type 1-only AC model and generic DC R&D system were removed
from its related-equipment list to avoid implying documented NACS coverage.

Separate CCS2 DC and NACS DC configuration-review links carry the relevant
filters into the contact draft and use `guide_inquiry_click` with the guide slug.
Titles, descriptions and opening answers are unchanged. Both guides' modified
dates reflect the visible additions.

All 110 tests passed. Browser checks confirmed the NACS DC draft includes both
DC and NACS / SAE J3400, and the CCS2 page has no horizontal overflow at 390px.
These changes remain local pending deployment.

## Production release verification

- Pushed the reviewed changes to `main` as `258a5e1`; the existing interface
  crawl-path commit `fd44e32` was included in the same push.
- Both Vercel production projects reported successful deployment. The primary
  deployment is `86YMVdX18FpNULPPHAAx1Ke4H8FC` in `ape-x1/apexevtech-website`.
- GitHub Quality checks run `39218652553` passed, including lint, tests,
  TypeScript and production build.
- Production audit passed for 53 sitemap pages and 103 internal link targets;
  all 12 linked downloads retain `noindex`.
- A production CCS2 guide visit showed the new equipment paths and current
  modification date. Google tag `G-EPSJV6EMLC` and Clarity `yas565j4eq` loaded.
- Submitted exactly one authorized inquiry marked
  `APEX-QA-20261019-258a5e1`, explicitly requesting no quote or sales follow-up.
  The production form displayed successful delivery confirmation.
- Resend message `01a15325-8932-72e8-bd27-d185d9c8b5d1` shows `sent` and
  `delivered` at 15:52 Asia/Shanghai, to the configured business mailbox. The
  preview contains the matching unique marker. The mailbox owner subsequently
  confirmed receipt on 2026-10-19, completing the inquiry delivery check. This
  internal QA message is excluded from customer lead counts.

### Remaining analytics limitation

The consented production visit, a guide equipment click and the inquiry form
test did not appear in GA4 Realtime during this check. The only displayed data
filter, Internal Traffic, is in Testing state; no filter settings were changed.
Both `www.google-analytics.com/g/collect` and
`region1.google-analytics.com/g/collect` failed TLS connection checks from the
execution host. This confirms a network limitation for this verification but
does not prove why last week's visitors were unrecorded.

Repeat the consented debug visit from a network that reaches Google's collection
endpoints before declaring analytics fixed. The test submission is an internal
QA event and must not be counted as a customer lead in the next review.
