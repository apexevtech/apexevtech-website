# Product image URL cleanup

Date: 2026-09-23

Seven product image filenames contained reserved, non-ASCII or inconsistent punctuation (`+`, ASCII colons, full-width colons or generic Chinese filenames). They were renamed to descriptive lowercase, hyphenated asset paths and all catalog references were updated.

This prevents product pages and image crawlers from generating ambiguous encoded asset URLs similar to the legacy document URLs previously reported by Search Console.

Permanent redirects preserve the seven previously published image URLs. Twenty-one unreferenced legacy images and source documents were removed from the public deployment bundle.

Updated assets:

- `st-6680b-plus.webp`
- `st-9980a-plus-pro.webp`
- `st-hcac-ea-ua-na.webp`
- `st-hcac-gb-ua-ea.webp`
- `ev-charger-production-test-system.webp`
- `ev-charger-test-laboratory.webp`
- `pv-storage-evse-test-system.webp`
