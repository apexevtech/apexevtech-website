# apexevtech-website
Official website of APEX EV Charging Test Solutions

## Local setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The inquiry form sends through Resend. Set `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL` (a verified Resend sender) and `INQUIRY_TO_EMAIL` in `.env.local` or the Vercel project settings. `INQUIRY_TO_EMAIL` defaults to `gu@apexps-nj.com` when omitted.

Set `NEXT_PUBLIC_GA_ID` to enable the Google Analytics 4 script. It is loaded only after a visitor accepts optional analytics in the cookie notice. Set `GOOGLE_SITE_VERIFICATION` to add the Google Search Console verification meta tag.

The generated `sitemap.xml` and `robots.txt` use `NEXT_PUBLIC_SITE_URL`, falling back to `https://www.apexpowersystems.com`.
