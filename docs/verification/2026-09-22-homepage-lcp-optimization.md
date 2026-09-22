# Homepage LCP optimization verification

Date: 2026-09-22

## Changes

- Marked the homepage hero image as eager and high priority.
- Set a seven-day minimum cache lifetime for optimized images.
- Extended stable `/assets/` browser caching to seven days with stale revalidation.
- Kept downloadable documents at a one-day cache lifetime so replacements propagate promptly.

## Verification

- ESLint passed.
- TypeScript passed.
- 79 Vitest checks passed across 37 test files.
- The production build generated all 51 static pages successfully.
- The production hero image contains `fetchpriority="high"` and `loading="eager"`.
- Mobile Lighthouse scores after the hero loading fix:
  - Performance: 96
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
- Lighthouse confirmed all LCP discovery checks pass.
- Observed metrics: FCP 1.4 s, LCP 2.4 s, Speed Index 3.5 s, TBT 30 ms, CLS 0.

Report saved locally at `/tmp/apex-lighthouse-lcp-20260922.json`.
