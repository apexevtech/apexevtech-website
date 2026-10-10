# Performance, search and conversion follow-up

Date: 2026-10-10

## Mobile Lighthouse baseline

Production pages were tested with Lighthouse 12.8.2 using mobile defaults.

| Page | Performance | Accessibility | Best practices | SEO | LCP | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 100 | 99 | 100 | 100 | 1.3 s | 0 |
| ST-HCDC-HPC product | 98 | 99 | 100 | 100 | 2.4 s | 0 |
| IEC 61851 guide | 98 | 99 | 100 | 100 | 2.2 s | 0 |

The only repeated accessibility failure was `role="dialog"` on an `aside` element in the cookie notice. The container was changed to a `div` while retaining its dialog name and behavior.

## Search Console evidence

The three-month report was last updated about 32.5 hours before review and covered 2026-08-24 through 2026-10-06. It reported 4 clicks, 443 impressions, 0.9% CTR and average position 24.7.

Leading zero-click queries included:

- `evse testing after commissioning`: 37 impressions
- `evse end-of-line testing`: 34 impressions
- `charger testing system`: 16 impressions
- `mobile commissioning`: 16 impressions
- `evse testing`: 15 impressions
- `emobility protocol testing`: 13 impressions
- `ev charger testing`: 13 impressions
- `dc fast charger testing`: 13 impressions
- `ccs protocol tester`: 12 impressions

The highest-impression zero-click pages included the equipment selection guide (80), protocol testing guide (51), post-installation testing guide (45), products index (44), homepage (23), contact page (18) and mobile commissioning application (18).

The title and description changes deployed on 2026-10-08 and 2026-10-09 were outside this Search Console reporting window. They were intentionally not rewritten again before a comparable post-change sample exists.

## Conversion improvements

- Every resource guide now presents a configuration-review CTA immediately after its summary answer as well as at the end of the guide.
- Both guide CTAs preserve the guide title in the contact URL.
- The contact form validates that context, records it as the inquiry and analytics context, and prefills a short requirements template covering connector, electrical range, standards and workflow.
- A local browser click-through confirmed the contact URL, message template, contextual WhatsApp message and contextual email subject.

## Validation

- Targeted analytics tests: passed.
- TypeScript: passed.
- ESLint: passed.
- Production build: passed with 58 generated routes.
