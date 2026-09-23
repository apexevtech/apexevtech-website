# Traffic Foundation Runbook

This checklist separates repository readiness from live platform evidence. Use one state for each item: `not configured`, `configured`, `submitted`, or `verified`. Source code can prove only `configured`.

## Repository

- `configured`: robots allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended; `/api/` remains disallowed.
- `configured`: sitemap includes static, product, and resource URLs.
- `configured`: GA4 records the inquiry funnel (`inquiry_start`, `inquiry_submit`, `inquiry_error`, `generate_lead`), product discovery (`view_item`, `product_compare`, `comparison_inquiry_click`), and contact/download actions.
- `configured`: GA4 and Clarity load only after analytics consent and only with public IDs.
- `configured`: UTM first-touch/latest-touch attribution is included in internal inquiry notifications.
- `configured`: `npm run indexnow` builds canonical URL batches.
- `verified`: the site uses Next.js 16.3.5, the production build passes, and `npm audit` reports zero known vulnerabilities as of 2026-09-23.

## Provider Setup

- `verified`: production GA4 is receiving website events, `generate_lead` is a key event, and five event-scoped custom dimensions were created on 2026-09-23.
- `verified`: production Clarity project ID is deployed and the authenticated dashboard has recorded sessions.
- `verified`: Google Search Console is accessible, 30 pages are indexed, and a fresh validation for 12 redirected legacy document URLs started on 2026-09-23.
- `submitted`: Bing Webmaster import succeeded and IndexNow accepted the 27 canonical URLs; continue monitoring indexing.
- `verified`: a five-minute UptimeRobot monitor exists and has completed successful checks; alert delivery testing remains an operator task.

## Email Authentication

- `verified`: Tencent enterprise mail MX and SPF records are published.
- `verified`: Resend DKIM is published and the production inquiry API has returned a provider `ACCEPTED` result.
- `not configured`: `_dmarc.link-jl.com` is still absent; publish a monitoring policy after signing in to DNSPod.

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
