# QA traffic and inquiry register

Prepared: 2026-10-26

## Release boundary

This release covers QA traffic classification and the analytics-consent withdrawal
fix only. This register does not authorize changes to SEO content, page titles,
partner pages or external business profiles. Tests, deployments and GA4 account
settings must be recorded separately rather than inferred from this document.

## QA link convention

- Enter QA mode by loading `https://www.link-jl.com/?apex_qa=1` as a complete page
  visit. For another page, retain its path and existing query parameters and add
  one `apex_qa=1` parameter.
- Leave QA mode by loading a complete page URL with `apex_qa=0`, for example
  `https://www.link-jl.com/?apex_qa=0`. Fully reload the page when entering or
  leaving QA mode; do not rely only on a client-side history update.
- QA mode continues during navigation in the same tab through the
  `sessionStorage` key `apex-qa-traffic`. Removing the parameter from a later URL
  does not by itself leave QA mode. Use the explicit exit link and reload.
- Do not assume a duplicated or restored tab is a clean public session. Use the
  explicit exit link or a fresh isolated browser context when testing public
  traffic. If storage is unavailable, do not assume the choice survives reloads.
- Analytics configuration and events carry `traffic_class` with the value `qa`
  or `public`. This identifies test traffic; it is not a claim that QA visits
  have already been removed from GA4 reports.
- A successful QA submission uses the analytics event `qa_generate_lead`, not
  `generate_lead`. Do not count `qa_generate_lead` as a genuine customer lead or
  configure it as a sales key event.
- The QA flag does not intercept `/api/inquiries`, prevent email delivery or
  create a backend test sandbox. Automated form regression must explicitly mock
  or intercept that API before submitting. Record any deliberately delivered
  test email with a unique QA marker and exclude it from operational lead totals.

## Consent and GA4 account status

The QA flag must not bypass analytics consent. Declining optional analytics must
not start GA4 or Clarity collection. After consent is withdrawn, new optional
tracking must stop until consent is granted again. Re-accepting must not duplicate
analytics initialization or queued events. These are regression acceptance
criteria; completed local checks and their SDK limitations are recorded in
`../verification/2026-10-26-analytics-consent-qa-release.md`. Previously collected
data is not retroactively deleted by a consent change. Already-authorized vendor
scripts can finish independent network work such as Clarity's `c.gif`; a stopped
event collector does not mean every vendor network request has been cancelled.

As of this release, the GA4 custom dimension for `traffic_class` has **not been
registered**, and no QA-exclusion data filter has been **enabled**. Code changes
do not perform either GA4 account operation. Do not describe test traffic as
filtered out, and do not assume a GA4 internal-traffic filter automatically uses
this custom event parameter. Account configuration, verification and any future
exclusion strategy require a separate recorded action by the analytics owner.

## Minimal QA ledger

Use one row per actual test run. Record the exact deployed commit when known,
whether the inquiry API was intercepted, and any real-mail marker. A planned run
is not a pass, a received test email is not a customer inquiry, and historical
tests do not prove the new QA classification or consent fix.

| Date | Version | Test category | Inquiry API intercepted? | Real email marker | Owner | Result |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-10-19 | `258a5e1`, identified in the recorded test marker; before this QA-flag release | Single inquiry-delivery check | Interception status not recorded; actual email receipt was confirmed | `APEX-QA-20261019-258a5e1` | Test executor not recorded; user confirmed inbox receipt | One test email received. No customer lead, sale or current-release analytics result is inferred. |
| 2026-10-26 | Release commit introducing this register; exact version is available in its Git history | QA entry/exit and same-tab persistence; public/QA event names; decline, withdrawal, delayed SDK and reacceptance regression | API blocked in automated browser checks; zero inquiry calls | None; zero real emails | Codex local automated regression | 366 unit/component tests and 36 UI checks passed. Real SDK collector requests were intercepted as 204; normal, delayed-load, cross-tab and storage cases passed. Not proof of provider report ingestion; see verification report for `c.gif` limitation. |
| 2026-10-27 | Release commit adding `2026-10-27-inquiry-layout-and-catalog-handoff.md`; see Git history | Form/floating-control layout and combined catalog/model inquiry handoff | All inquiry responses mocked locally; external requests blocked before navigation; successful mocks use `leadRecorded: false` | None; zero real emails | Codex local automated regression | 378 unit/component tests, 479 layout assertions and actual handoff/payload regression passed. No real customer inquiry or analytics ingestion is inferred. |
| 2026-10-28 | Release commit adding `2026-10-28-navigation-and-inquiry-polish.md`; see Git history | Privacy popup/draft retention, contact layout, success/error/timeout state and correct guide/case navigation | Seven expected local inquiry attempts intercepted; external requests blocked; successful mocks use `leadRecorded: false` | None; zero real emails | Codex local automated regression | 390 unit/component tests, 214 contact browser assertions and navigation/SSR/no-JS regressions passed. No real delivery or provider analytics ingestion is inferred. |
| 2026-10-28 | Release commit adding `2026-10-28-resource-search-and-mobile-comparison.md`; see Git history | Published-guide full-text search, responsive comparison and footer policy popup | All external/API routes intercepted before navigation; zero inquiry calls | None; zero real emails | Codex local automated regression | 418 unit/component tests, 24 comparison layouts, 48 model focus checks, 8 privacy popups and search/history checks passed. No analytics ingestion, real delivery or ranking gain is inferred. |
| 2026-10-29 | Release commit adding `2026-10-29-priority-guide-content.md`; see Git history | Two priority guides: bilingual scope, contextual references, matrix anchors and hash-to-guide Back/Forward regression | All external/API routes intercepted before navigation; zero inquiry calls in successful browser runs | None; zero real emails | Codex local automated regression | 429 tests, 32 browser page cases, 16 reference/Back/Forward sequences, 24 matrix mouse/keyboard checks and 4 no-JS reduced-motion cases passed. An initial native-hash history defect was fixed and rerun; no analytics ingestion or ranking gain is inferred. |

## Evidence and cooperation follow-up

This is an internal follow-up list, not permission to publish new material or to
contact a partner. No external message, profile creation or new citation is
recorded as completed here. Owners below are roles to assign, not named assignees.

| Item | Confirmed available | Missing or next action | Owner to confirm | Publication boundary / status |
| --- | --- | --- | --- | --- |
| Public product specifications | Twelve public specification documents and equipment images are documented. The 2026-10-20 archive inventory found no `word/media/` entries in the documents. | Keep model/configuration boundaries intact. Obtain original screenshots or measured exports separately. | Product engineering | Existing specifications are usable as specifications, not proof of an executed test or measured project outcome. |
| Partner reference images | The user explicitly confirmed image publication permission. The 2026-10-21 image review records the eighteen corresponding case photographs and separate banner, superseding earlier pending or partial-selection notes. | Archive written permission and the exact asset/use scope, translation or modification limits, attribution requirements and any relevant third-party rights. | Partner relationship owner | Permission is confirmed by the user, not an independently inspected license. The images remain reference illustrations, not APEX deliveries, customer endorsements or APEX-owned premises. |
| Original software and measured evidence | Planning guides, reference architectures and templates exist. They are not measured evidence. | Request one approved EOL record first, then a commissioning example or product-specific capture, with original file, exact configuration, software revision, executed conditions, explanation, redactions and explicit publication approval. | Engineering / service owner | Original approved screenshots and measured reports remain missing. Do not invent traces, values, pass results, cycle time, yield or repair outcomes. |
| External business-profile identity | APEX; Apex Power Systems (Nanjing) Co., Ltd.; `https://www.link-jl.com`; `gu@apexps-nj.com`; `+86 177 1441 2321`; Nanjing, China are the recorded identity baseline. | Confirm the customer-facing display name, full English postal address, verification document, approved logo/cover, operating hours, service area, establishment year and same-name Crunchbase ownership. Check for duplicate profiles before any submission. | Company / operations owner | External profile identity and verification remain pending confirmation. Do not invent missing identity facts or publish verification originals. |
| Partner citations and profile links | Cooperation has been confirmed by the user; an internal source and image provenance record exists. | Confirm who may approve a partner-side APEX reference, its factual cooperation scope and the permitted link. Record only a genuinely public, checked URL after approval. | Partner relationship / operations owner | No new external citation or profile is created by this work. General partner-reference pages are not APEX identity profiles and must not be added to `sameAs`; only verified public APEX identity profiles qualify. |

Customer names, personal contacts, serial numbers, IP addresses, access credentials,
private site details and confidential limits must not be exposed through a new
asset or follow-up record. Permission for product/reference pictures does not
automatically authorize customer logos, personal-image rights, reports, new
platform uses or delivery attribution. Retain the approved originals and rights
records internally.

Internal source records:

- `original-evidence-asset-brief.md`
- `external-business-profile-brief.md`
- `saiter-authorized-image-register-2026-10-20.md`
- `engineering-case-image-review-2026-10-21.md`
- `data/site.ts` for the company identity baseline

The external-profile brief is a draft: recheck its language and navigation labels
against the current site before reuse. Earlier media-review notes marked pending
are historical; the later explicit publication-permission confirmation takes
precedence, without turning the pictures into measured or delivery evidence.
