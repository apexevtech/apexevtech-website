# Analytics follow-up

Date: 2026-10-10

## GA4 evidence

- The production GA4 stream URL is `https://www.link-jl.com` and its measurement ID matches the deployed public ID.
- Enhanced measurement is enabled for page views, scrolls, outbound clicks and four additional automatic events.
- The 28-day report contained 5 active users, 58 events and one `google / organic` session.
- Recent events included `page_view`, `session_start`, `first_visit`, `form_start`, `generate_lead`, `whatsapp_click`, `scroll`, `click` and `user_engagement`.
- `generate_lead` remains a key event. `whatsapp_click` was also marked as a key event so reports cover form and WhatsApp inquiries.

## Reliability fix

- Analytics used to wait for `requestIdleCallback` after consent. A background or throttled tab can defer that callback indefinitely and lose a short visit.
- Commit `02ac78b` initializes GA4 and Clarity immediately after analytics consent while retaining the existing consent gate and queued-event handling.
- Analytics tests, TypeScript validation, the full production build and the GitHub quality check passed.
- The production JavaScript bundle was verified after deployment and no longer contains the idle-callback path.

## Current limitations and follow-up

- The operator network could load the Google tag but could not connect to the `google-analytics.com` collection endpoint, so a same-session realtime confirmation was not possible from that network.
- Review the GA4 realtime and recent-events reports from a network that can reach Google Analytics after a consented production visit.
- Bing Site Scan still reported a quota of 0 remaining pages on 2026-10-10. Retry after the quota resets; the sitemap and URL submissions are already successful.
