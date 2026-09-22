# Continuous integration quality checks — 2026-09-22

GitHub Actions now validates every pull request and every push to `main` with Node.js 22 and the committed dependency lockfile.

Required commands:

1. `npm ci`
2. `npm test`
3. `npm run typecheck`
4. `npm run build`

The workflow uses read-only repository permissions, cancels superseded runs on the same ref and has a 15-minute timeout.
