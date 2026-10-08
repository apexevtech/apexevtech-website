# Catalog, standards and conversion release

Date: 2026-10-08

## Completed work

### 1. Product selection and comparison

- Replaced the AC/DC-only catalog control with combinable charger-type, interface/standard and workflow filters.
- Added URL persistence for type, interface and workflow so filtered results can be shared and restored.
- Added GB/T, CCS2 / ISO 15118, CHAdeMO, Type 1 / SAE J1772, Type 2 / IEC 61851 and NACS / SAE J3400 interface choices.
- Added portable, laboratory/R&D, production/end-of-line and field-commissioning workflow choices.
- Added a standards/protocol row to the three-product comparison table.
- Added a no-result recovery path and filter analytics event.

### 2. Product inquiry conversion

- Changed every product-page quote button to retain the current model and scroll to its local inquiry form.
- Added configuration-review calls to action beside the technical specifications and below the procurement checklist.
- Added a one-click route from each product page into the comparison table with that model preselected.

### 3. Standards content

Added four distinct technical guides:

- /resources/iso-15118-din-70121-testing
- /resources/iec-61851-evse-testing
- /resources/gbt-27930-2-charger-testing
- /resources/sae-j3400-nacs-testing

The guides are linked from the relevant interface pages, product pages, resource groups and sitemap. Their scope separates standard-edition and evidence planning from connector-oriented interface pages.

### 4. Measurement baseline

- Added docs/operations/monthly-growth-scorecard.md with the current Search Console, GA4, inquiry and Clarity baseline.
- Added docs/operations/monthly-growth-scorecard.csv for ongoing 28-day comparisons.
- Defined rules for page-level decisions, query review, lead counting and change cadence.

### 5. Performance

- Reduced homepage hero image quality to 60 while retaining WebP delivery.
- Corrected the responsive size hint for the mobile viewport.
- Increased optimized-image cache lifetime from 7 to 30 days.
- Retained 75-quality support for other Next.js images.

### 6. Data cleanup

- Removed unused archived product definitions.
- Removed the empty brochure catalog and its unused archive.
- Removed unused case-study and blog-post placeholder data.
- Updated image tests so they cover active content only.

### 7. Social sharing

Added 1200 × 630 branded images for:

- homepage: /assets/social/home.png
- product catalog and product pages: /assets/social/products.png
- resource index and technical guides: /assets/social/resources.png

Open Graph and Twitter metadata now select the appropriate share image.

## Verification

- Unit tests: 37 files, 82 tests passed.
- TypeScript: passed.
- ESLint: passed.
- Production build: passed; 58 static pages generated.
- Sitemap: 53 canonical URLs.
- The four new guide files contain the article body, inquiry link and resource share image metadata.
- A real-browser check confirmed that the product catalog renders all filter controls and that selecting DC updates the URL and result set.
- Generated social images were visually inspected at 1200 × 630.
