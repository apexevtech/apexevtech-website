# APEX technical library

Date: 2026-10-20

## Public content boundary

The user requested a standalone category interface under the APEX brand rather than a separate supplier-reference section. The new `/library` contains six original solution-planning briefs and eighteen original application-planning scenarios. It does not republish the supplier's customer cases as APEX deliveries.

Public records contain a title, original summary, three requirements, an intended review output, a scope note and a link to an existing APEX guide or architecture. They do not contain customer names, supplier project dates, project results, certifications, original case descriptions or unlicensed media. Battery and vehicle topics explicitly require scope review rather than implying an unsupported equipment offering.

The historical supplier directory remains an internal source record under `docs/operations/`; that JSON is not imported by the page or offered as a public download. The previous unshipped `/references` design and its unused data were removed before release.

## Interface

- Library entry in the existing desktop/mobile navigation and footer.
- One canonical route instead of twenty-four thin detail pages.
- Material-type segmented controls, category selection, search, result count and reset.
- Shareable query state with browser history synchronization; text search does not generate a history entry for every keystroke.
- Expandable planning checklists and direct links to relevant existing resources.
- The floating WhatsApp action is hidden while library filters are in view and restored after they scroll away; the existing behavior on other routes is unchanged.
- Source-derived historical performance claims are not included in analytics or structured data as APEX project facts.

## Verification results

- `npm test`: 141 tests in 46 files passed. Includes data membership, unique IDs, existing destinations, query parsing, case-insensitive search and default-filter serialization. The literal search `all` is retained in the URL; unrelated URL parameters and trailing input spaces are preserved.
- `npm run lint`, `npm run typecheck` and `npm run build`: passed. `/library` is statically prerendered with all 24 records, not dependent on JavaScript to expose initial material content.
- Isolated Playwright browser against a production build: default 24 records, solution view 6, application view 18, category narrowing, category reset on view change, empty/reset states, multiword typing and deep-link reload passed.
- Browser back/forward restored the selected view and category. Invalid URL filters fell back to defaults; an overlong URL query was limited to 120 characters. Canonical stayed `https://www.link-jl.com/library` with query parameters.
- Related material navigation reached the existing laboratory architecture. A local `gtag` stub received `library_material_click` with material ID, type, category and the public page path. No live inquiry or analytics test event was sent.
- Screenshots reviewed at 320x568, 390x844, 768x1024, 1280x900 and 1440x1000. No horizontal overflow or header navigation overlap; logo loaded. Library navigation appeared in mobile and desktop menus. The compact 320-pixel layout exposes the material-type controls within the initial viewport.
- WhatsApp was hidden while filter controls were visible, then restored after they scrolled away at all five widths. Mobile checklist expansion had no horizontal overflow.

Screenshots are local verification artifacts under `output/playwright/library-*.png`, not public site assets. Production deployment and live site audit are recorded after release.
