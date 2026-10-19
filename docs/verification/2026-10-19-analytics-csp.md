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
