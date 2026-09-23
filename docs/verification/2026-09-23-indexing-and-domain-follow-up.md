# Indexing and domain follow-up

Date: 2026-09-23

## Search Console exclusion URLs

The 13 URLs shown in the failed Search Console validation were checked against production.

- All 13 legacy URLs return HTTP 308 permanent redirects.
- The stray `/&` URL redirects to the homepage.
- The 12 legacy Word document URLs redirect to normalized `/downloads/` paths.
- Every normalized download returns HTTP 200.
- Every normalized download sends `X-Robots-Tag: noindex, nosnippet` and `Content-Disposition: attachment`.
- Download URLs are not included in the XML sitemap.

The production responses are therefore corrected. Search Console still needs a new validation request and Google recrawl before the report can clear.

## Sitemap dates

Static page and product sitemap dates were aligned to the latest content release on 2026-09-22. Individual resources, applications and interface pages continue to use their content-specific dates.

Production verification found 46 sitemap URLs with the updated dates. All 46 canonical URLs were resubmitted to IndexNow after deployment.

## Email authentication

- MX routes mail through Tencent (`mxbiz1.qq.com` and `mxbiz2.qq.com`).
- SPF authorizes Tencent mail.
- `resend._domainkey.link-jl.com` publishes a DKIM public key.
- `_dmarc.link-jl.com` does not currently publish a DMARC policy.

Adding DMARC remains a DNS administration task. The reporting mailbox and desired enforcement policy must be confirmed before publishing the record.
