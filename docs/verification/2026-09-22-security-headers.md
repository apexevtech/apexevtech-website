# Security response headers — 2026-09-22

## Added site-wide

- Content Security Policy limited to same-origin assets plus the configured Google Analytics and Microsoft Clarity endpoints.
- HSTS for HTTPS enforcement, including subdomains.
- Clickjacking protection through CSP `frame-ancestors` and `X-Frame-Options`.
- MIME sniffing, referrer and cross-origin opener protections.
- Permissions Policy disabling camera, microphone, geolocation, payment and USB access.

Existing download `X-Robots-Tag` and attachment headers remain applied to their matching paths.
