# Analytics consent and QA release verification

Date: 2026-10-26 (Asia/Shanghai).

## Scope

This release corrects analytics consent withdrawal and adds explicit QA traffic
classification. It does not change search metadata, content, advertising or GA4
account filters. It does not establish an improvement in rankings or conversion.

The local production build uses the existing public GA and Clarity identifiers.
Real SDK tests use isolated headless browser contexts against localhost, allow
the vendor SDK files, and intercept every external collector request with HTTP
204. This proves the SDK's attempted requests, not ingestion in a GA4 or Clarity
account. No inquiry API call or real email is allowed in these checks. No
restricted user browser page is opened or controlled for this release.

## Changes

- Unknown or declined consent drops application tracking events instead of
  retaining them for later replay. Withdrawal clears the application queue and
  its still-owned pre-SDK buffer, without changing an SDK-owned array or cursor.
- GA's measurement-specific disable flag is set synchronously; consent state is
  synchronized across tabs. Storage failures keep the current document opted out.
- A complete-page `apex_qa=1` or `apex_qa=0` visit changes test mode. Same-document
  URL changes cannot change the classification. Session storage continues the
  choice across complete-page navigation in the same tab, with in-memory fallback.
- Initial GA configuration and application events carry `traffic_class`.
  Successful QA leads use `qa_generate_lead`, never the customer `generate_lead`.
- Cookie settings do not reload the document or destroy edited or cleared inquiry
  text. Reacceptance reuses initialized SDKs instead of repeating GA configuration.
- While the Clarity bootstrap is still using our queue, withdrawal removes its
  pending grants/starts and gates a late start. Its exact project configuration
  is retained for reacceptance; SDK-owned queues are not changed.

## Verification

| Check | Result |
| --- | --- |
| Unit/component tests | 366 tests in 84 files passed after the final race fix. |
| Production build | Passed with public analytics IDs. TypeScript also passed. |
| Normal real-SDK flow | Passed: first page view is QA, two specific GA probes resume, one config and one initial page view, zero new collectors after withdrawal settles. |
| Cross-tab withdrawal/reacceptance | Passed: two specific resumed probes, no withdrawn probe replay or duplicate page view/config/script. |
| Storage failure | Passed: local-storage read failure causes zero SDKs/collectors; failed withdrawal write stops the current document; blocked session storage retains QA in memory. |
| UI and draft regression | 36 checks passed. Filled and deliberately cleared text survive EN/ZH and consent changes. No inquiry requests or page errors. |
| Responsive UI | 320/390/768/1440 pixels checked; zero horizontal overflow. Screenshots inspected. |
| Delayed Clarity tag and engine after withdrawal | Both passed after the fix: real engine loaded, zero Clarity `/collect` requests in the four-second observation window, real collection resumed after acceptance, no duplicate initialization. |
| Production dependency audit | Zero vulnerabilities with `npm audit --omit=dev`. Development-only advisories were not changed in this release. |
| Hosting verification | Performed after this report is committed; use this commit's CI and hosting statuses to identify the deployed version. Local checks do not establish production success. |

Local browser scripts and screenshots are ignored artifacts under
`output/playwright/analytics-consent-*`.

## Known Boundaries

`traffic_class` is an event parameter, not an enabled GA4 report exclusion. The
custom dimension has not been registered and no exclusion data filter has been
activated. Previously collected data is not retroactively deleted. QA links do
not prevent real inquiry emails; automated form tests must intercept the API.

The delayed-tag test observed the hosted bootstrap's independent
`https://c.clarity.ms/c.gif` request about 2.3 seconds after withdrawal; this
request was intercepted too. The queue gate stops late SDK event collection,
not every network effect of an already-authorized third-party script. Normal
withdrawal can also finish work already queued before the change. Do not claim
that all Clarity requests are cancelled or that data already sent is erased.
The pending-bootstrap guard depends on the current hosted queue contract; rerun
both real-SDK delay tests if that vendor integration changes.

Original screenshots and measured test reports remain unavailable. No new
external profile, partner citation, customer delivery claim or inquiry was
created. The existing WhatsApp placement partly overlaps the contact textarea
at some tablet/desktop sizes; this release does not change that UI.

## Primary API References

- [Google measurement-specific collection disable flag](https://developers.google.com/tag-platform/security/guides/privacy)
- [Microsoft Clarity API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-api)
- [Microsoft Clarity consent API](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-consent-api-v1)
- [Clarity source](https://github.com/microsoft/clarity/blob/master/packages/clarity-js/src/clarity.ts)
