# Third Batch: Catalog Comparison Workflow

## Delivered Scope

Product cards on `/products` now have a comparison checkbox outside the existing product-detail link. A single `ProductExplorer` owner supplies the card controls, selected-model summary and existing specification table. The shared reducer accepts only documented local products, removes duplicates and limits selection to three models. Selected models remain removable at the limit.

The selection summary is part of the normal page flow, not a new floating toolbar. It remains visible in the catalog when filters hide selected products or produce zero matches. Card actions, summary removal, comparison dropdowns and the inquiry destination use the same selection. Filter updates preserve comparison and unrelated query parameters; comparison updates preserve filters and attribution parameters. Existing history replacement behavior is retained, with query observation restoring state after browser navigation.

New actions have English and Chinese labels, visible-label-compatible accessible names and 44px label/button targets. Controls are disabled until query synchronization, while all product-detail links remain readable in static HTML and with JavaScript disabled. The homepage's shared product-card presentation is unchanged. Existing floating-control visibility handling now covers the catalog filters, selection summary and each card's comparison controls so WhatsApp does not obscure these actions.

The floating WhatsApp action on the three published project-reference detail pages now includes the canonical public page URL and the existing requirements template. Queries and fragments are excluded. Unknown and unexpanded reference slugs do not receive detail-page context. The phone number, consent handling and analytics event contract are unchanged.

## Compatible Dependency Patches

- Vitest and matching internal packages: 4.1.11 -> 4.1.12.
- Vite: 8.2.2 -> 8.2.4.
- postcss-selector-parser: 6.1.4 -> 6.1.5, the maintained 6.x security backport.

Primary references:

- [Vitest 4.1.12 release](https://github.com/vitest-dev/vitest/releases/tag/v4.1.12)
- [Vite 8.2.4 release](https://github.com/vitejs/vite/releases/tag/v8.2.4)
- [Vite development-server advisory](https://github.com/vitejs/vite/security/advisories/GHSA-rq7h-c2jc-7f22)
- [PostCSS selector parser advisory and backports](https://github.com/postcss/postcss-selector-parser/security/advisories/GHSA-rj75-hqrm-r3gf)
- [Unpatched braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)

Production dependency audit remains at zero known vulnerabilities. The full audit decreased from 12 to 9 affected packages: 7 high and 2 moderate, confined to development tooling. The braces dependency chain still has no patched release in the checked advisory; clearing its suggested audit fixes would require a Tailwind major migration or an inappropriate Next lint downgrade. The parser advisory still flags the 6.x line in npm's range despite the maintained backport. These residual audit entries are not suppressed. No forced audit fix, CSS-framework migration, runtime dependency change or additional direct dependency was introduced.

## Local Verification

- 81 Vitest files and 332 tests passed; ESLint, TypeScript, production build and `git diff --check` passed.
- Unit and SSR tests cover reducer bounds, duplicates, invalid models, immutable query serialization, label/link separation, max-three disabled states, inquiry destinations, bilingual actions and pre-hydration fallback.
- Playwright exercised three card selections, disabled fourth selections, dropdown/card synchronization, summary removal, re-adding, clear, filter reset, hidden selections and zero matching results.
- Invalid/duplicate/over-limit shared query values, pushState synchronization, browser back/forward and three same-turn checkbox clicks were checked.
- English and Chinese retained the selection at 320, 390, 768 and 1440px. Document width matched viewport width in all eight combinations. The comparison table retains its own intentional horizontal scroll region.
- WhatsApp was hidden while catalog controls were visible and restored at the top of the page. Mobile footer controls and desktop/mobile screenshots were visually inspected. Headed Chromium screenshot capture stalled; the same checks and captures completed in a fresh headless session. Screenshot artifacts remain under ignored `output/playwright/batch-three-*` paths.
- A JavaScript-disabled browser rendered all 12 product-detail links, with all 12 comparison checkboxes disabled.
- The comparison inquiry link prefilled all three model names. Manual message edits and deliberate clearing survived language and query synchronization. An intercepted local submission retained the model context and edited message, returned `leadRecorded: false`, and sent no real email.
- All three project detail pages produced WhatsApp messages with the expected canonical URL, original number, and no private query or fragment. Browser console inspection reported zero errors or warnings before the intercepted inquiry check.

## Measurement Boundary

No new Search Console or GA4 performance report was read in this batch. These changes improve product selection and inquiry handoff; they do not establish a measured ranking, click-through-rate or lead-volume increase. Existing SEO titles, canonical routes and analytics consent behavior were not changed.
