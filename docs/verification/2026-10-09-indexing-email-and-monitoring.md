# Indexing, email authentication and monitoring follow-up

Date: 2026-10-09

## Google Search Console

- `/resources/iso-15118-din-70121-testing`: indexed.
- `/resources/gbt-27930-2-charger-testing`: indexed.
- `/resources/iec-61851-evse-testing`: discovered but not indexed; Search Console accepted a priority crawl request.
- `/resources/sae-j3400-nacs-testing`: discovered but not indexed; Search Console accepted a priority crawl request.

The accepted requests place the two URLs in Google's priority crawl queue. They do not guarantee indexing; recheck after Google has had time to crawl them.

## IndexNow

- The production sitemap contained 53 canonical URLs.
- `npm run indexnow` submitted all 53 URLs successfully using the deployed public IndexNow key.
- The IndexNow endpoint returned a successful response and the operator script reported `Submitted 53 URLs to IndexNow.`

## DMARC

- DNSPod accepted a TXT record at `_dmarc.link-jl.com` with the value `v=DMARC1; p=none; rua=mailto:gu@apexps-nj.com; adkim=r; aspf=r; pct=100`.
- A public lookup through Cloudflare DNS (`1.1.1.1`) returned the new record immediately.
- The monitoring policy should remain at `p=none` while aggregate reports are reviewed. Enforcement can be phased in only after legitimate Tencent enterprise mail and Resend traffic is confirmed aligned.

## UptimeRobot

- Monitor: `https://www.link-jl.com/`.
- Interval: five minutes.
- Dashboard status during verification: Up, with 100% uptime over the previous 24 hours.
- The authorized test notification generated and delivered both simulated DOWN and simulated UP emails to the configured Gmail contact.

## Follow-up

- Recheck the two pending Google URLs after 3–7 days.
- Confirm the four new standards guides appear in Bing Webmaster discovery/indexing reports.
- Review DMARC aggregate reports for 2–4 weeks before changing the policy.
