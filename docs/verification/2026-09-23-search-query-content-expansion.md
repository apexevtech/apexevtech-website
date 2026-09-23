# Search-query content expansion

Date: 2026-09-23

## Search demand addressed

Search Console showed impressions for broad EV charger testing and DC fast charger testing queries. Existing content already covered charger-test-system selection, post-commissioning EVSE checks, and connector-specific CCS2 and GB/T workflows. Two missing broad-intent entry pages were added without duplicating the connector-specific guides:

- `/resources/ev-charger-testing-guide`
- `/resources/dc-fast-charger-testing-guide`

The first guide covers scope, equipment, power-path selection, normal charging sequences, controlled fault testing and evidence. The second covers interface and protocol definition, external-load planning, DC charging states, fault and limit testing, and portable versus laboratory architectures.

Both pages include:

- distinct titles, descriptions and canonical URLs;
- Article, BreadcrumbList and FAQPage structured data through the existing resource template;
- related equipment and crawlable internal links;
- placement in the resource-topic navigation;
- sitemap inclusion with a 2026-09-23 modification date.

The resources index metadata and hero copy were updated to cover AC, DC fast charging and EVSE testing. The existing system-selection and CCS2 fast-charger guides link back to the new broad guides.

## Verification

- `npm test`: 37 files and 81 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed; 53 static pages generated.

Search rankings and click-through changes require recrawling and should be compared in Search Console over equivalent future periods.

## Production release

- Commit: `bfea672`
- Vercel deployment: `dpl_DkrYu9tdn4CyUQ1H9Wt9QHUGC921`
- Production alias: `https://www.link-jl.com`
- Both new guides and the resources index returned HTTP 200.
- The production sitemap returned HTTP 200 and contained 48 canonical URLs.
- The generated guide HTML contained the expected title, canonical URL and FAQ structured data.
- All 48 canonical URLs were submitted to IndexNow after deployment.
