# Product snippet structured-data resolution

Date: 2026-10-10

## Search Console finding

The Product snippets report was last updated on 2026-10-08 and showed two invalid items:

- `/products/st-hcdc-hpc`
- `/products/ast-9000`

Both reported the required-property error: specify `offers`, `review` or `aggregateRating`.

## Resolution

APEX equipment is configured and quoted for a project. The public pages do not publish a stable price, purchasable offer or customer review data. Adding any of those fields only to satisfy the rich-result validator would make the structured data inaccurate.

The unsupported `Product` JSON-LD was therefore removed from the shared product-page template. Product pages retain their visible specifications, canonical metadata, BreadcrumbList structured data and factual FAQPage structured data. This removes eligibility for Google product snippets while preserving ordinary web indexing and the supported page enhancements.

## Validation

- The focused regression test passed.
- TypeScript and ESLint passed.
- The full production build generated 58 routes successfully.
- Generated HTML for both reported URLs contains BreadcrumbList and FAQPage JSON-LD and no Product JSON-LD.

After deployment, request Search Console validation. The report will remain visible until Google recrawls the affected pages and completes validation.
