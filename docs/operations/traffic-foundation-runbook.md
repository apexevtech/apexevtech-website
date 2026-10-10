# Traffic Foundation Runbook

This checklist separates repository readiness from live platform evidence. Use one state for each item: `not configured`, `configured`, `submitted`, or `verified`. Source code can prove only `configured`.

## Repository

- `configured`: robots allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended; `/api/` remains disallowed.
- `configured`: sitemap includes static, product, and resource URLs.
- `configured`: GA4 records the inquiry funnel (`inquiry_start`, `inquiry_submit`, `inquiry_error`, `generate_lead`), product discovery (`view_item`, `product_compare`, `comparison_inquiry_click`), and contact/download actions.
- `configured`: GA4 and Clarity load only after analytics consent and only with public IDs.
- `configured`: UTM first-touch/latest-touch attribution is included in internal inquiry notifications.
- `configured`: `npm run indexnow` builds canonical URL batches.
- `verified`: the site uses Next.js 16.4.0, the production build passes, and the production dependency audit reports zero known vulnerabilities.
- `verified`: `npm run audit:site` checks every sitemap page and internal link target for broken responses, orphan pages, metadata duplicates, canonical/H1/image-alt errors and download-file `noindex` headers.

## Provider Setup

- `verified`: production GA4 is receiving website events; `generate_lead` and `whatsapp_click` are key events, and five event-scoped custom dimensions were created on 2026-09-23. Analytics initialization after consent was made immediate on 2026-10-10 to preserve short and throttled visits.
- `verified`: production Clarity project ID is deployed and the authenticated dashboard has recorded sessions.
- `verified`: Google Search Console is accessible. On 2026-10-09, the ISO 15118 / DIN 70121 and GB/T 27930.2 guides were indexed; priority crawl requests were accepted for the IEC 61851 and SAE J3400 / NACS guides.
- `submitted`: Bing Webmaster import succeeded. IndexNow accepted all 53 current canonical sitemap URLs on 2026-10-09; continue monitoring Bing discovery and indexing.
- `verified`: a five-minute UptimeRobot monitor exists, reports the production site as up, and delivered both simulated DOWN and UP test emails on 2026-10-09.

## Email Authentication

- `verified`: Tencent enterprise mail MX and SPF records are published.
- `verified`: Resend DKIM is published and the production inquiry API has returned a provider `ACCEPTED` result.
- `verified`: `_dmarc.link-jl.com` publishes `v=DMARC1; p=none; rua=mailto:gu@apexps-nj.com; adkim=r; aspf=r; pct=100`; DNSPod accepted the record and a public `1.1.1.1` lookup returned it on 2026-10-09.

## Entity Consistency

- `not configured`: prepare one evidence-backed company name, address, phone, founded year, and description.
- `not configured`: align Google Business Profile, Bing Places, LinkedIn, Crunchbase, and directories with identical NAP data.
- `configured`: add only real HTTPS profile URLs to `NEXT_PUBLIC_ENTITY_PROFILES`.

## UTM Vocabulary

Use fixed sources: `whatsapp`, `email-sig`, `cold-email`, `catalog-pdf`, `alibaba`, `tradeshow`, `parcel-insert`, `linkedin`, `youtube`, `reddit`. Use `utm_medium=referral` except paid `cpc`; use dated campaigns such as `2026q3-sample-drive`.

## 30/60/90-Day Operations

- Day 1-30: complete provider verification, capture a baseline, open email/WhatsApp/catalog links with UTM, and use the inquiry response SOP.
- Day 31-60: publish technical resources, standardize LinkedIn, submit accurate directory profiles, and run the first 20-question AI mention baseline.
- Day 61-90: review Search Console position 8-20 opportunities, refresh declining pages, review Clarity recordings, and decide paid validation from attributed inquiry quality.

Do not buy bulk links, publish undisclosed endorsements, mass-produce thin AI pages, block AI crawlers, invent certifications/testimonials, or claim live provider verification without observed evidence.
