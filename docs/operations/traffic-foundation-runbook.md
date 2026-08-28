# Traffic Foundation Runbook

This checklist separates repository readiness from live platform evidence. Use one state for each item: `not configured`, `configured`, `submitted`, or `verified`. Source code can prove only `configured`.

## Repository

- `configured`: robots allows GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, and Google-Extended; `/api/` remains disallowed.
- `configured`: sitemap includes static, product, and resource URLs.
- `configured`: GA4 events are `generate_lead`, `whatsapp_click`, `email_click`, `phone_click`, and `catalog_download`.
- `configured`: GA4 and Clarity load only after analytics consent and only with public IDs.
- `configured`: UTM first-touch/latest-touch attribution is included in internal inquiry notifications.
- `configured`: `npm run indexnow` builds canonical URL batches.

## Provider Setup

- `not configured`: add real `NEXT_PUBLIC_GA_MEASUREMENT_ID` and verify each event in GA4 DebugView.
- `not configured`: add real `NEXT_PUBLIC_CLARITY_PROJECT_ID`; verify the first recording.
- `not configured`: verify the domain in Google Search Console and submit `/sitemap.xml`.
- `not configured`: verify the site in Bing Webmaster Tools, submit `/sitemap.xml`, then run `INDEXNOW_KEY=... npm run indexnow`.
- `not configured`: add a five-minute UptimeRobot monitor and test alert delivery.

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
