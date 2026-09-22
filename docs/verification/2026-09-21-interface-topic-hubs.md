# Interface topic hubs — 2026-09-21

Added an interface index and dedicated CCS2, GB/T, NACS and Type 2 EV charger testing pages. Each hub defines the test boundary, planning sequence, relevant published products, technical resources, FAQs and a project inquiry path.

The pages avoid treating a connector name as proof of complete protocol, electrical or certification coverage. NACS content states AC or DC scope explicitly; CCS2 separates the interface from ISO 15118/DIN support; GB/T requires exact editions; Type 2 separates field checks from formal assessment.

Internal discovery paths include the Products menu, Resources index and relevant product pages. Every detail page emits CollectionPage, ItemList, BreadcrumbList and FAQPage data. The index emits an ItemList.

Verification: 34 test files and 73 tests passed; TypeScript and the production build passed; 50 pages were generated, including all five interface routes. The sitemap contains the index and all four detail pages.

Production deployment `dpl_B4RwDssnDSHfhc1adKajzmNWT3nf` reached `READY` and was assigned to `https://www.link-jl.com`. All five routes returned HTTP 200. Each detail page exposed its canonical, CollectionPage, BreadcrumbList and FAQPage data. The production sitemap contained 44 URLs and the Resources index linked all four hubs.
