# Product and Reference-Case Inquiry Improvements

## Scope

- Added a "Discuss a similar configuration" action to engineering-reference disclosures.
- Contact links carry only a published case slug. Local data supplies the scenario title, technical focus, English inquiry context and exact source path.
- The form identifies the reference scenario in English and Chinese without representing partner references as verified APEX deliveries.
- User-written or deliberately cleared messages survive language changes and repeated query synchronization.
- Server validation accepts only the exact source paths of published reference cases. Comparison, equipment-finder and guide inquiry flows retain their existing behavior.
- Added `case_inquiry_click` using the existing consent-controlled event pipeline, with only a public reference-case identifier.
- Moved complete specifications and product-specific selection boundaries immediately after the product configuration summary.
- Moved the single product inquiry form ahead of application references and related guides.
- Procurement checks and FAQs use native disclosures, with full content retained in server-rendered HTML.
- Added Lucide icons to the product section links, quotation action and original-document download.

## Automated Verification

- `npm test`: 76 files, 302 tests passed.
- `npm run lint`: passed.
- `npm run build`: passed, including static generation and TypeScript validation.
- `npm run typecheck`: passed after the production build.
- `git diff --check`: passed.
- All 12 product pages retain every specification, feature, highlight, application, selection boundary, FAQ answer, document link and alternative-model destination.
- Product section identifiers remain unique, with one inquiry form per product page.
- Case tests cover unknown, repeated and path-like identifiers, comparison precedence, translated scenario explanations, draft protection and source-path validation.

## Browser Verification

Production build served locally on port 3002 for Playwright checks.

- English and Chinese product layout checked at 320, 390, 768 and 1440 px widths.
- All four product section links position their targets below the sticky site header.
- No horizontal overflow; product image loads and uses `object-fit: contain`.
- Procurement and FAQ disclosures open using the keyboard; procurement also closes using the keyboard.
- Chinese case disclosure links to the expected contact URL and supplies the correct scenario and draft.
- Modified and deliberately emptied messages remain untouched after language switching and query synchronization.
- Two intercepted local API requests exercise delivery failure followed by retry success. Draft and exact case attribution are preserved. No real inquiry email was sent, and the mock success does not record a lead.
- The only browser console error during the retry test is the intentionally mocked HTTP 503 response.

Screenshots are retained under ignored `output/playwright/` paths, including desktop product views, the Chinese mobile configuration summary and the case inquiry action.

## Measurement Boundaries

This release improves information hierarchy and inquiry handoff. It does not establish a measured increase in rankings, click-through rate or genuine inquiries. Search snippets and metadata remain unchanged. Existing complete-period Search Console and consented analytics reviews should be used for subsequent evaluation.

No new test reports, customer outcomes, photographs, certifications, delivery commitments or independent Chinese search routes were invented or added.
