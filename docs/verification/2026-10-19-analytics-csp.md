# Analytics CSP repair, 2026-10-19

## Observed evidence

- After the user confirmed a debug visit, GA4 Realtime and DebugView still showed no incoming users/devices during the check. This is not a successful ingestion verification.
- Production Chrome Console showed the Clarity bootstrap loading, but its follow-up `https://scripts.clarity.ms/0.8.72-beta/clarity.js` was blocked by `script-src`.
- The GA4 `page_view` request used the expected measurement ID, with debug mode enabled, but the primary Google Analytics collection connection closed on this computer.
- The subsequent `https://www.google.com/g/collect` request was separately blocked by `connect-src`.
- A Google Translate stylesheet violation was also present; it is unrelated to site analytics and is not allowlisted by this change.

## Scoped repair

- Allow only the additional Clarity script host, not arbitrary third-party scripts.
- Allow only the observed Google `/g/collect` endpoint, not the whole Google origin or a Google wildcard.
- Keep consent gating and all other security restrictions unchanged.
- Add directive-specific regression coverage.

Reference: [Microsoft Clarity CSP guidance](https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp), [Google tag CSP guidance](https://developers.google.com/tag-platform/security/guides/csp).

## Remaining acceptance criterion

Verify an actual incoming GA4 debug event from a network that can reach Google's collection services. Removing a CSP block does not prove network delivery or GA4 ingestion.

## Follow-up browser verification

- GA4 DebugView subsequently displayed two `page_view` events; one inspected event had `debug_mode=1` and `page_location=https://www.link-jl.com/?ga_debug=1`. This confirms ingestion of page events, not the entire conversion funnel.
- An isolated, non-translated production browser successfully downloaded the ST-9980EA-HPC Word file (HTTP 200) and opened the inquiry form with DC / CCS2 scope prefilled. No additional inquiry was submitted.
- Actual GA requests contained `catalog_download` with the guide slug and model, and `guide_inquiry_click` with the guide slug. Both failed with `ERR_CONNECTION_CLOSED` at the primary collection host on this computer; successful custom-event ingestion remains unverified.
- The GA fallback endpoint returned HTTP 204 for page events. Clarity collection also returned HTTP 204, without the previous script CSP block.
- Next Link attempted RSC prefetches for Word files, causing unnecessary 404s even though the actual document returned 200. The new guide document links now disable prefetch and use the native download attribute while retaining click tracking.
