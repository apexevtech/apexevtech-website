# SEO verification — 2026-09-16

## Changes

- Added the `/resources` index to the canonical sitemap. The index modification date follows its latest article; product pages use the current release date and unchanged static pages retain their previous date.
- Resource Article URLs, publisher and author URLs, and BreadcrumbList URLs use `NEXT_PUBLIC_SITE_URL` through the shared site URL module.
- Articles display the company attribution and publication/update dates matching their structured data. Their Open Graph metadata uses the article type and matching dates.
- Removed the duplicated APEX suffix from fallback product titles; the root title template supplies the brand once.
- Replaced the nested main element in the resources index with a section.

## Evidence

- `npm test`: 24 test files, 52 tests passed.
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Inspected generated HTML for all 9 resource articles and 12 product detail pages: article, social and breadcrumb URLs match; modification dates match; each product title contains APEX once.
- Verified one main element in each resource article and the resource index, and the resource index URL in generated sitemap XML.
- Custom-host unit coverage verifies article and breadcrumb URLs do not retain the fallback domain.

## Scope

Local repository, production build and canonical production website verified. Search Console URL inspection, recrawling and live rich-result eligibility were not verified in this pass.

## References

- [Google breadcrumb documentation](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb)
- [Google Article documentation](https://developers.google.com/search/docs/appearance/structured-data/article)
- [Google sitemap documentation](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

## Production deployment

- Production project: `ape-x1/apexevtech-website`.
- Deployment: `dpl_HZTNffyF8iuMPWUxrWtNbtR1KSAp`, Vercel status READY.
- [Deployment inspection](https://vercel.com/ape-x1/apexevtech-website/HZTNffyF8iuMPWUxrWtNbtR1KSAp).
- Canonical website: https://www.link-jl.com.
- Live sitemap contains 28 canonical URLs, including `/resources`.
- All 9 live resource articles and 12 live product pages passed canonical, article metadata, breadcrumb and title checks; the resource index passed and robots references the canonical sitemap.
- `link-jl.com/resources` redirects to `www.link-jl.com/resources` and returns HTTP 200.
- Corrected the ignored local `.vercel/project.json` association to the existing project serving the canonical domain. The previously linked `apex-ev-tech` project has no custom domains and received an initial deployment before the association mismatch was identified.
- Alternate apexpowersystems.com host checks were inconclusive (the resources request returned HTTP 404); these hosts are outside the canonical-host verification above.
- Deployment source was staged from repository files plus the new SEO files, excluding local build artifacts, Finder metadata and unrelated untracked files.

## Contact CTA follow-up

- Fixed desktop/mobile header and resource article “Talk to an engineer” links to target `/contact#inquiry-form`.
- Added a `scroll-mt-28` form wrapper so the sticky 77px header does not cover the form.
- Local Playwright checks passed for desktop, mobile (menu closes), home-to-contact navigation and repeated clicks. Form top after scrolling: 112px; header bottom: 77px.
- `npm test`: 52 tests passed. `npm run build`: passed locally and on Vercel.
- Published production deployment `dpl_Gu7zsBfvwA1pHt66rW86z45KUmnu` (READY) to https://www.link-jl.com.
- Live Playwright click on the Contact page reached the anchor with scrollY 357, form top 112px and header bottom 77px.

## About image follow-up

- Company overview equipment panel is vertically centered with the copy, uses a 16:10 frame, and adds 20px mobile / 32px desktop image padding while preserving the original equipment asset with object-contain.
- Local production build passed. Desktop screenshot inspected: `output/playwright/about-image-desktop.png`. Mobile viewport 390px: image loaded, no horizontal overflow.
- Deployment CLI lost its polling connection with `fetch failed`; inspection confirmed server-side deployment completed successfully, status READY, and all existing production aliases were applied.
- Production deployment: `dpl_GZhnabTzyoPvsx1sGaDE3M6qXEbF`.
- Live https://www.link-jl.com/about verified: image loaded, contain sizing, padding, center alignment and 16:10 frame; no horizontal overflow.
