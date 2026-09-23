# Search click-through optimization

Date: 2026-09-23

## Evidence

The authenticated Search Console performance report for the previous three months showed:

- 183 impressions;
- 1 click;
- 0.5% average click-through rate;
- 28.2 average position.

The highest-impression zero-click queries included `apex ev lab`, `dc fast charger testing`, `ev charger testing`, `evse testing after commissioning`, `charger testing system`, `ac charger testing`, `emobility protocol testing` and `evse end-of-line testing`.

Search Console showed that both `dc fast charger testing` and `ev charger testing` previously landed on `/resources/choose-ev-charger-test-system`. The dedicated pages released immediately before this change now provide closer intent matches for those two queries.

## Snippet changes

- Homepage title now leads with APEX and explicitly describes EV charger test-lab equipment and AC/DC EVSE systems.
- The system-selection guide now leads with `EV Charger Test System` and summarizes the exact comparison criteria.
- The AC/DC comparison now leads with `AC Charger Testing`.
- The protocol guide now includes `eMobility` and `EV Charging Protocol Testing` in the title.
- The post-installation guide now leads with `EVSE Testing After Commissioning` and describes its checklist value.

Descriptions were rewritten to identify the intended workflow, concrete comparison factors and evidence available on the page. Canonical URLs remain unchanged. Modified dates were advanced only for resources whose search presentation changed.

## Verification

- `npm test`: 37 files and 81 tests passed.
- `npm run build`: passed; 53 static pages generated.
- `npm run typecheck`: passed after the build completed.

The first parallel typecheck overlapped with Next.js regenerating `.next/types` and reported missing generated files. This was a local command race rather than a source error; the sequential typecheck passed.

CTR should be compared only after Google recrawls the updated pages and should be evaluated alongside position, since the current query sample is small and several queries rank outside the first results page.

## Production release

- Commit: `da41d55`
- Vercel deployment: `dpl_FotbFypjzTThKq8ML9vURTHeVTRd`
- Production alias: `https://www.link-jl.com`
- Live HTML confirmed the updated title and description on the homepage and four targeted resource pages.
- All 48 canonical URLs were submitted to IndexNow after deployment.
