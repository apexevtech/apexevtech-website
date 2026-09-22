# Production dependency security upgrade — 2026-09-22

## Findings

`npm audit --omit=dev` reported three production dependency findings through the Next.js image and CSS toolchain: bundled PostCSS and Sharp advisories.

## Resolution

- Upgraded Next.js from 15.5.25 to 16.3.5.
- Added Sharp 0.35.4 explicitly so every install resolves the patched image-processing release.
- Accepted the Next.js 16 TypeScript configuration updates for the automatic React JSX runtime and generated route types.
- Replaced the removed `next lint` command with ESLint flat configuration and added linting to GitHub Actions.
- Resolved the resulting React hook purity, internal-link and escaped-text findings.

## Validation

- 79 unit tests passed.
- TypeScript completed without errors.
- ESLint completed without errors.
- Next.js 16 production build generated all application routes.
- `npm audit --omit=dev` reports zero vulnerabilities.
