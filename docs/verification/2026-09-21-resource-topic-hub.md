# Resource topic hub — 2026-09-21

## Change

The resources index now groups all 15 technical guides into four visitor-oriented paths:

- Interfaces & standards — 6 guides
- System selection — 3 guides
- Laboratory & production — 3 guides
- Field & commissioning — 3 guides

The page includes a four-card topic navigator, stable section anchors, descriptive section introductions and grouped article cards. Article titles use H3 beneath each topic H2, preserving one H1 for the page.

The index also emits an `ItemList` JSON-LD object containing every guide once with a canonical URL and sequential position. Group definitions are maintained separately from article content, with tests that reject missing, duplicate or unknown assignments.

## Verification

- 30 test files and 65 tests passed.
- TypeScript validation passed.
- The Next.js production build generated all 40 pages successfully.
- Browser checks at 1440 × 1000 and 390 × 844 found all four topic links and all 15 article cards.
- Topic anchors update the URL and scroll to the expected section.
- The rendered page contains one H1, five H2 headings and 15 H3 article headings.
- The rendered JSON-LD contains the ItemList.
- No horizontal overflow was found at desktop or mobile width.

## Production deployment

Deployed as `dpl_Fhn6TLcgDEFy4XDTLXBLWBBaktdQ`. Vercel reported `READY` and assigned the release to `https://www.link-jl.com`.

The canonical production page returned HTTP 200 and contained all four topic anchors, 15 article cards, one H1, five main-content H2 headings, 15 H3 article headings, a self-referencing canonical and an ItemList with all 15 guide URLs.
