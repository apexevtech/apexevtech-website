# APEX Website Traffic Foundation Design

## Purpose

Apply the website-controlled recommendations from the "Independent Website Post-Launch Traffic Playbook" to the APEX B2B inquiry site. The result must improve discoverability, AI answer extractability, attribution, buyer trust, and inquiry completion without inventing business claims or broadening into unverified off-site marketing activity.

## Scope Boundary

This project delivers everything that can be implemented and verified in the repository:

- search and AI crawler accessibility;
- page metadata, canonical URLs, structured data, and internal linking;
- GA4 conversion events, Microsoft Clarity loading, and UTM attribution;
- conversion-oriented trust placement and inquiry completion flow;
- a maintainable Resources hub with an initial high-intent content cluster;
- IndexNow submission tooling and operational documentation;
- automated tests, production build verification, and responsive browser QA.

External account work is separate because it depends on authenticated ownership and real company data. Google Business Profile, Bing Places, LinkedIn, Crunchbase, industry directories, UptimeRobot, Search Console inspection, Bing inspection, paid ads, outreach, and third-party publication will be documented as an operator checklist but will not be represented as completed without direct evidence.

## Current Baseline

The site is a Next.js 15 application with App Router pages for home, products, solutions, about, contact, privacy, and product details. It already provides a generated sitemap, a permissive robots route, Google Search Console verification support, a Bing verification file, an IndexNow key file, basic organization structured data, an inquiry API backed by Resend, consent UI, and a WhatsApp contact control.

The main gaps are:

- analytics code exists but conversion measurement is not a complete site-wide contract;
- Clarity is absent;
- campaign parameters are not persisted through the inquiry journey;
- the inquiry form has more than five buyer-facing fields and its success state is a dead end;
- structured data does not consistently cover breadcrumbs, products, FAQs, and resource articles;
- there is no high-intent resource cluster for SEO/AEO growth;
- trust evidence is not consistently adjacent to inquiry calls to action;
- AI crawler intent and IndexNow submission are not explicit and repeatable;
- real external entity URLs are unavailable, so `sameAs` cannot yet be completed safely.

## Architecture

### 1. Measurement And Attribution

A small analytics module will define the supported conversion events and provide one client-safe event function. The five required events are:

- `generate_lead` for a successful inquiry;
- `whatsapp_click`;
- `email_click`;
- `phone_click` when a callable number is present;
- `catalog_download` for product document downloads.

GA4 will load only when `NEXT_PUBLIC_GA_MEASUREMENT_ID` exists and the visitor has granted analytics consent. Microsoft Clarity will follow the same consent decision and load only when `NEXT_PUBLIC_CLARITY_PROJECT_ID` exists. Missing IDs must cause no runtime error and no fake tracking call.

An attribution helper will accept only the fixed UTM fields (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, and `utm_term`), persist first-touch and latest-touch values in browser storage, and attach them to inquiry submissions. The server will validate and include attribution in the internal notification email. The public confirmation email must not expose internal attribution data.

### 2. Search And AI Discoverability

Every indexable page will have a unique title, description, canonical URL, and social preview metadata. Robots policy will explicitly allow `GPTBot`, `OAI-SearchBot`, `ClaudeBot`, `PerplexityBot`, and `Google-Extended` while continuing to disallow `/api/`. The sitemap will include every indexable resource and product page and use stable content modification dates instead of changing all dates on every request.

Structured data will be assembled through typed helpers:

- one `Organization` and `WebSite` graph at the site level;
- `BreadcrumbList` on nested pages;
- `Product` on product detail pages using only repository-backed product facts;
- `FAQPage` only where the same questions and answers are visibly rendered;
- `Article` on resource pages with explicit publish and modified dates.

`sameAs` will be populated only from an optional, validated environment configuration of real APEX profile URLs. No placeholder social URLs will enter production output.

IndexNow will use the existing key and a repository script that derives canonical URLs from the same site data used by the sitemap, submits them in supported batches, and reports non-success responses. Running the script is an operator action and requires network access; adding the script is not evidence that Bing indexed the pages.

### 3. Conversion And Trust

The inquiry form will contain at most five buyer-facing input groups: name, work email, company, country, and project requirements. Phone/WhatsApp can be supplied inside project requirements or used through the persistent WhatsApp action. The honeypot and privacy acceptance are safeguards and do not count as buyer qualification fields.

After a successful submission, the form region will show a proper next-step state with:

- a clear response-time expectation consistent with the actual notification workflow;
- a WhatsApp action;
- a product or documentation browsing action;
- a route back to relevant solutions.

The success state remains on the page to avoid losing submission context and must fire `generate_lead` exactly once per successful request.

Trust information will be moved immediately above primary inquiry actions, but only claims already present and supportable in the repository may be used. Existing facts such as product standards coverage, AC/DC capability, engineering workflow, downloadable product documents, and direct engineering support are acceptable. Certification numbers, customer counts, customer logos, testimonials, factory size, prices, MOQ, delivery times, and response guarantees must not be invented. Where the playbook recommends public price/MOQ information but verified values are unavailable, the interface will ask buyers for the operating range and explain that configuration determines the quotation.

### 4. Resource Content System

Create a `/resources` hub and file-backed resource records rather than introducing a CMS. Each record will include slug, title, description, topic, intent, publication date, modification date, summary answer, body sections, related products, FAQs, and cited internal evidence. The renderer will produce visible article content, a table of contents for longer articles, contextual product links, a consultation action, Article schema, FAQ schema when applicable, and breadcrumbs.

The first cluster will target EV charging test and validation purchase intent. It will include a pillar guide and focused pages covering:

- how to choose an EV charger test system;
- AC versus DC EVSE testing requirements;
- EV charging protocol testing and signal diagnosis;
- production-line versus laboratory validation;
- field commissioning test equipment;
- preparing for IEC, SAE, NACS, and GB/T validation;
- regenerative load considerations;
- a comparison framework for integrated and portable test systems.

Content must be technically conservative, answer the query in the first third, include comparison tables or checklists where helpful, and link to relevant existing products. It must not claim formal certification services, guaranteed compliance, test results, market leadership, or proprietary statistics without repository evidence. This initial cluster establishes the maintainable system; the playbook's 24-page and ongoing weekly publishing targets remain operational milestones rather than fabricated bulk content in one release.

### 5. Internal Navigation

Resources will be linked from the primary navigation and footer. Every resource will link to at least one product or solution and at least two related resources. Product detail pages will link back to relevant educational resources. Important pages must remain within three clicks of the home page, and no resource may be orphaned.

### 6. Operational Assets

Repository documentation will include:

- the fixed UTM source vocabulary from the playbook;
- examples for email signatures, WhatsApp, catalogs, LinkedIn, YouTube, and trade shows;
- environment variables for GA4, Clarity, site URL, and verified entity profiles;
- IndexNow execution and response checks;
- the 30/60/90-day external operator checklist;
- explicit evidence states: configured, submitted, verified, or unavailable.

Documentation must distinguish repository readiness from live service verification.

## Error Handling And Privacy

- Analytics and Clarity failures must never block navigation or inquiry submission.
- Event functions must no-op until the relevant provider is available.
- UTM values must be length-limited and treated as untrusted input on both client and server.
- Inquiry validation and anti-spam behavior must remain server-authoritative.
- Consent withdrawal must prevent future analytics loading and clear site-owned attribution storage where applicable.
- Structured data must be JSON serialized from typed data, not manually concatenated.
- Resource lookup failures must return the framework's 404 response.

## Testing Strategy

Unit tests will cover analytics event names, attribution parsing/persistence, inquiry payload validation, structured-data output, resource lookup, sitemap membership, and robots rules. Component tests will cover the five-field form, conversion events, consent-gated scripts, success actions, and tracked contact/download controls.

The full acceptance gate is:

- focused tests pass after each implementation unit;
- full `npm test` passes;
- `npm run typecheck` passes;
- `npm run build` passes;
- generated robots, sitemap, metadata, and JSON-LD are inspected from a production build;
- browser QA at desktop and mobile widths confirms the home, resource hub, resource detail, product detail, and contact flows render without overlap;
- a test inquiry uses a controlled local/mocked path and does not send an unintended external email;
- tracking scripts are absent before consent and present after consent when test IDs are configured;
- there are no broken internal links among generated site routes.

## Success Criteria

The website-controlled portion of the playbook is complete when:

1. all five conversion events have code paths and tests;
2. GA4 and Clarity are consent-gated and environment-configured;
3. first-touch and latest-touch UTM attribution reaches the inquiry notification;
4. the inquiry flow has no more than five buyer-facing fields and has three useful post-submit actions;
5. crawler policy, sitemap, canonical metadata, and IndexNow tooling cover all indexable routes;
6. Organization/WebSite, breadcrumb, product, article, and visible-FAQ structured data validate structurally without invented facts;
7. the Resources hub and initial high-intent cluster are indexable, internally linked, and connected to conversion paths;
8. supported trust signals sit adjacent to the main inquiry actions;
9. tests, type checking, production build, route/link checks, and responsive browser QA pass;
10. external tasks and unavailable credentials/data are clearly reported as remaining operator actions rather than claimed as complete.
