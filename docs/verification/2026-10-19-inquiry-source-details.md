# Inquiry source details, 2026-10-19

## Scope

- Guide inquiry links carry an explicit local source-page path, including the equipment configuration CTA.
- Equipment finder links default to the product catalog as their source.
- Inquiry payloads keep selected configuration separately from the buyer-editable message.
- Email text and HTML include optional Source page and Selected configuration rows. Existing product context and UTM attribution remain unchanged.
- The server accepts only product/resource paths without query strings, external origins or traversal. Configuration is capped at 600 characters and HTML-escaped by the existing email renderer.
- No browsing history, referrer URLs or extra client-side tracking storage is introduced. Source details are client-supplied context, not proof of traffic origin.

## Verification

- 114 unit tests passed, including source/configuration handling, invalid source paths, bounds and email escaping.
- ESLint and production build passed.
- Local isolated Playwright flow: opened CCS2 guide, clicked configuration CTA, replaced the whole message, completed required fields and submitted to an intercepted local API response. Assertions confirmed the guide source, DC/CCS2 configuration and edited message all remained present.
- The local test did not send an email or create a real lead. Existing delivered-mail verification was not repeated.
