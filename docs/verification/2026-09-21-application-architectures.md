# Application architectures — 2026-09-21

## Source boundary

The repository contained four engineering scenario summaries and corresponding assets, but no verifiable customer names, delivery dates, authorization records or measured customer results. The new pages therefore present reference application architectures and explicitly state that they are not named customer case studies, certification claims or delivery claims.

## Published application content

- Integrated EV charger validation laboratory
- Mobile EV charger commissioning and maintenance
- EVSE production end-of-line and aging test architecture
- PV, energy storage and EV charging test architecture

Each application defines intended users, engineering objectives, four configuration blocks, a five-step execution workflow, expected project outputs, items to confirm before configuration, relevant products and planning guides.

## Site integration

- Added an `/applications` index and four statically generated detail routes.
- Added Applications to desktop, mobile and footer navigation.
- Linked the application pages from the Solutions page.
- Added reciprocal application links to all 12 product pages.
- Added ItemList data to the index and TechArticle plus BreadcrumbList data to each detail page.
- Added the index and four detail pages to the sitemap.
- Changed the full desktop navigation breakpoint to 1280 px so the additional item does not crowd medium-width layouts.

## Verification

- 32 test files and 69 tests passed before the final priority-image adjustment.
- TypeScript validation passed.
- Production build generated 45 pages, including all five application routes.
- Desktop, 1180 px and 390 px browser checks found no horizontal overflow.
- At 1180 px the compact navigation is used; at 1440 px the complete navigation is visible.
- The application index displays four cards and ItemList data.
- The checked detail page contains one H1, four related product links, three planning-guide links and working contact CTAs.
- Above-the-fold application images are marked for priority loading.

## Production deployment

Deployed as `dpl_5rszSMFw3THJWscURnEZmxCTjPYr`. Vercel reported `READY` and assigned the release to `https://www.link-jl.com`.

Production verification confirmed HTTP 200, self-referencing canonicals, TechArticle and BreadcrumbList data, and the reference-architecture disclosure on all four detail pages. The index contains all four cards and ItemList data. The sitemap contains 39 URLs including all five new application routes. Reciprocal application links were also confirmed on the AST-9000 product page and the Solutions page.
