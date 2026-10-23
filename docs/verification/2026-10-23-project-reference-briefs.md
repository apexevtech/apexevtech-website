# Second Batch: Project Reference Briefs

## Delivered Scope

Three existing engineering references now have independent English-source pages with Chinese display translations:

- `/project-cases/ccs-charger-laboratory-testing`
- `/project-cases/vehicle-charger-field-diagnostics`
- `/project-cases/production-embedded-charger-testing`

Each page retains its authorized local reference image and introduces scenario-specific review questions, requirements to confirm, and proposed record fields. No customer identity, executed measurements, certification, delivery, production throughput, yield improvement or MES integration is claimed. The diagnostic illustration is explicitly identified as a laboratory arrangement, not a field-service visit.

The references remain distinct from existing application architectures and technical guides: they define a proposed review of a particular published scenario rather than duplicate a general how-to article. Each has a unique title, description, canonical URL and breadcrumb. Exactly three pages and their images are added to the sitemap.

Only those three engineering cards and matching application-planning materials receive a scenario-brief link. Their primary technical guides link back to the corresponding brief. Original gallery filters, native disclosures, guide destinations and the other fifteen case records are retained.

The production reference returns to page 3 of the six-item case gallery, with the correct anchor. The existing inquiry protocol now accepts `caseOrigin=detail` only once, only with its exact value, and only for a published brief. The resulting source path is locally derived and retained by server validation. Existing case-gallery inquiry sources remain unchanged.

## Dependency Security

The initial Next.js 16.4.0 production build reported known security advisories and stopped on a subsequent build. Official references were checked:

- [Next.js 16.4.1 security release](https://github.com/vercel/next.js/releases/tag/v16.4.1)
- [Next.js 16.4.2 patch release](https://github.com/vercel/next.js/releases/tag/v16.4.2)
- [Image optimization advisory](https://github.com/advisories/GHSA-2464-fhr4-w9xw)
- [Server Actions advisory](https://github.com/advisories/GHSA-p3m5-59mp-jv5r)
- [Cache function advisory](https://github.com/advisories/GHSA-673q-mjm6-r5xr)

The dependency floor is now Next.js / eslint-config-next `^16.4.1` and sharp `^0.35.5`; the lockfile resolves Next.js and its lint configuration to 16.4.2 and sharp to 0.35.5. The changes are limited to the Next.js patch family and matching packages. No major-version migration or forced audit fix was applied.

`npm audit --omit=dev --json` reports zero known production dependency vulnerabilities after the update. This is not a finding that the website was compromised, nor a guarantee that the application has no security risk.

The full development dependency audit still reports 12 affected packages (8 high, 4 moderate), involving the lint/glob, Tailwind/PostCSS and test/Vite toolchains. These tools are not part of the production runtime audit. Compatible test-tool patches and any required Tailwind migration should be evaluated separately; this release does not silently downgrade Next.js lint tooling or migrate the CSS framework to clear those development alerts.

## Verification

- 80 Vitest files, 322 tests passed after the dependency update.
- ESLint, production build, standalone TypeScript check and `git diff --check` passed.
- SSR tests cover the complete brief content, local images, Chinese visible strings and image alternatives, metadata uniqueness, all cross-links, exactly three static parameters, and 404 behavior for other references.
- Real HTTP requests returned 404 for an unexpanded reference slug and an unknown slug.
- Playwright checked all three pages in English and Chinese at 320, 390, 768 and 1440 px: one H1, no horizontal overflow, loaded uncropped images, translated alternatives and correct inquiry links.
- Desktop and mobile screenshots were visually inspected; artifacts are retained under ignored `output/playwright/brief-*` paths.
- The mobile production brief was opened from the third gallery page and returned to that page correctly. Its configuration-review anchor clears the sticky header.
- Application-planning material -> scenario brief -> technical guide -> scenario brief was exercised in Chinese.
- A local intercepted inquiry submission retained the detail-page source and the original case context. Edited and deliberately cleared messages survived language switching and repeated query synchronization. No real email or genuine lead event was sent by the mock.
- A stubbed local `case_inquiry_click` retained the actual detail `page_path` and the public case identifier.

## Measurement Boundary

No new Search Console or GA4 performance data was read for this batch. Additional crawlable pages and clearer inquiry handoff do not establish a ranking, click-through-rate or lead-volume improvement. Existing search snippets were not repeatedly rewritten. Subsequent review should compare complete periods and separate real customer inquiries from QA.
