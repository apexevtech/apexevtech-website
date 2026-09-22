# Inquiry delivery reliability — 2026-09-22

## Configuration audit

The Vercel production project contains all required inquiry variable names: `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL` and `INQUIRY_TO_EMAIL`. Secret values were not printed or stored locally.

Public DNS currently publishes Tencent enterprise-mail MX records and an SPF record authorizing `spf.mail.qq.com`. No DMARC record was returned for `_dmarc.link-jl.com`, and no public Resend DKIM record was found under the common checked selector. The actual Resend sender domain and its dashboard verification cannot be confirmed until browser access is restored or the account owner checks the Resend domain page.

## Code changes

- A successful delivery now requires a Resend message ID; an empty provider response no longer records a lead.
- Successful server logs include the provider name and message ID for operational tracing.
- Failure logs include the provider failure category and detail but do not include submitted inquiry fields.
- The public API response still omits provider diagnostics and customer data.
- Added tests for accepted delivery, missing message ID, provider rejection and missing configuration.

## Validation and deployment

All 36 test files and 78 tests passed, as did TypeScript and the production build. Deployment `dpl_F28wxziC57msm7QE4MaEqb82UDPV` reached `READY` on `https://www.link-jl.com`.

A production honeypot request returned HTTP 200 with `leadRecorded:false`, confirming the endpoint was live without sending an email or creating a test lead. No real inquiry or external test email was sent.

## External follow-up

Add and verify a DMARC policy after confirming all legitimate senders. Confirm the exact `INQUIRY_FROM_EMAIL` domain is verified in Resend and that its SPF/DKIM records are present. These DNS changes require access to the mail/DNS provider and should not be guessed from the website configuration.
