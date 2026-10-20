# Guide funnel QA and evidence follow-up

Date: 2026-10-20

## Automated checks

- 127 tests across 44 files pass after adding six cross-module regression tests.
- ESLint and the production build pass.
- Live audit passes for 53 sitemap pages and 105 internal targets; all 12 linked specification downloads retain noindex.
- New tests cover all three priority guides from generated configuration links through prefill, validation and email rendering, including a fully replaced buyer message.
- Structured article identity, modification date, breadcrumb target and complete three-column matrix rows are covered for the same guides.

## Isolated browser test

At 390 x 844, tested CCS2, field commissioning and EOL guides against a local production build:

1. Downloaded the first original Word specification and checked the suggested filename.
2. Clicked the guide-specific configuration CTA.
3. Waited for the correct interface or workflow prefill.
4. Replaced the entire message, completed required fields and submitted to an intercepted local API route.
5. Asserted that the submitted source path, configuration and edited buyer message remained correct.
6. Captured calls to a local gtag stub and asserted catalog_download, guide_inquiry_click and inquiry_submit.
7. Returned leadRecorded=false and asserted no generate_lead event.

All three flows pass. These checks prove browser behavior and event invocation, not live GA4 ingestion or SMTP delivery. No test email, WhatsApp message or real lead was created.

## Evidence inventory

All 12 public DOCX archives were inspected read-only and contain no word/media entries. No new approved software screenshot or measured report has been supplied. Existing product photos and specification files remain the only usable published equipment assets identified in this check.

The three new matrices remain explicitly labelled planning or procurement templates. Publishing real test evidence still requires the original file, configuration/software revision, test conditions, confidentiality review and permission to publish. Website QA is not charger hardware testing or a compliance assessment.
