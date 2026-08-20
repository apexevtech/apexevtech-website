# Inquiry Email Delivery Design

## Status

Approved in conversation on 2026-08-20. Written specification pending final user review.

## Goal

Make the existing inquiry forms deliver real inquiry emails to `gu@apexps-nj.com` through Resend while providing clear, accessible submission feedback. The implementation must keep service credentials on the server and must never report success unless Resend accepts the message.

## Scope

- Upgrade the shared inquiry form used on the contact page and every product detail page.
- Collect name, work email, phone or WhatsApp number, company, country, and project requirements.
- Require acknowledgement of the privacy policy before submission.
- Attach a form context so product inquiries identify the relevant product model and general inquiries identify the contact page.
- Add a Next.js route handler at `POST /api/inquiries`.
- Send both HTML and plain-text email through Resend.
- Provide pending, success, validation-error, configuration-error, and delivery-error UI states.
- Add automated tests for validation, message formatting, route behavior, and client submission states.

## Out of Scope

- SMS or WhatsApp Business notifications.
- CRM synchronization, database persistence, attachments, or file uploads.
- Marketing subscriptions or automated follow-up sequences.
- Durable distributed rate limiting. The first version uses validation and a honeypot; platform-level rate limiting can be added later if abuse appears.

## User Experience

The form retains the site's existing visual language and fields are arranged in the current one-column or two-column responsive layout.

Fields:

- `name`: required.
- `email`: required and used as the email `Reply-To` address.
- `phone`: optional; label clarifies that phone or WhatsApp numbers are accepted.
- `company`: optional.
- `country`: optional.
- `message`: required.
- `privacyAccepted`: required checkbox linking to `/privacy-policy`.
- `website`: visually hidden honeypot that normal users leave empty.
- `context`: supplied by the page, not typed by the visitor. Product pages use the product model; the contact page uses `General inquiry`.

When a valid form is submitted, the button changes to `Sending...` and is disabled to prevent duplicate submission. A successful response clears the visitor-entered fields and shows an `aria-live` success message. A failed response preserves the values and shows an actionable error. Field validation errors appear beside the relevant field and focus moves to the first invalid field.

## Architecture

### Shared Form Component

`components/InquiryForm.tsx` remains the shared form UI. It becomes a client component with controlled submission state and accepts a required `context` prop. The contact page passes `General inquiry`; product pages pass `product.model`.

The browser sends JSON to `/api/inquiries`. It never imports Resend and never receives the Resend API key or internal provider error details.

### API Route

`app/api/inquiries/route.ts` accepts only `POST` JSON requests. It delegates validation and message construction to small server-only helpers so they can be unit tested without making network calls.

Request fields and limits:

| Field | Requirement | Limit |
| --- | --- | --- |
| `name` | Required, trimmed | 2-100 characters |
| `email` | Required, valid address | 254 characters |
| `phone` | Optional, trimmed | 50 characters |
| `company` | Optional, trimmed | 120 characters |
| `country` | Optional, trimmed | 100 characters |
| `message` | Required, trimmed | 10-5,000 characters |
| `context` | Required, trimmed | 120 characters |
| `privacyAccepted` | Must be `true` | Boolean |
| `website` | Must be empty | 200 characters maximum |

The route rejects malformed JSON, wrong content types, invalid fields, and oversized content with `400`. A populated honeypot returns a generic `200` response without sending mail so bots do not learn that they were detected.

### Email Delivery

The route uses the Resend SDK with these server-side environment variables:

- `RESEND_API_KEY`: required.
- `INQUIRY_FROM_EMAIL`: required; for example `APEX Website <inquiries@apexpowersystems.com>` after domain verification.
- `INQUIRY_TO_EMAIL`: optional, defaulting to `gu@apexps-nj.com`.

The message subject is `Website inquiry: <context> - <name>`. The email includes every submitted field, the form context, and the submission timestamp. It includes plain-text and HTML bodies. All visitor-provided values are HTML-escaped before entering the HTML body. `replyTo` is set to the visitor's validated email address.

The route returns `503` when required server configuration is missing and `502` when Resend rejects or cannot deliver the request. Browser responses use stable, non-sensitive error codes and friendly messages. Full inquiry contents, API keys, and provider response bodies are not logged.

## Response Contract

Successful response:

```json
{ "ok": true, "message": "Your inquiry has been sent." }
```

Validation response:

```json
{
  "ok": false,
  "code": "VALIDATION_ERROR",
  "message": "Please correct the highlighted fields.",
  "fieldErrors": { "email": "Enter a valid email address." }
}
```

Configuration and provider failures return the same top-level shape without `fieldErrors`, using `EMAIL_NOT_CONFIGURED` or `EMAIL_DELIVERY_FAILED` as the code.

## Security and Privacy

- Resend credentials exist only in local or Vercel environment variables.
- Server validation is authoritative; client validation is only for usability.
- HTML email content is escaped.
- The endpoint accepts a bounded JSON body and ignores unknown fields.
- The honeypot silently drops obvious bot submissions.
- Logs contain outcome codes and request timing only, not inquiry bodies.
- The form links to the existing privacy policy and requires acknowledgement before sending.
- No inquiry data is stored in the application database because the first version has no database.

## Testing

Automated tests cover:

- Valid input normalization.
- Missing required fields and invalid email addresses.
- Minimum and maximum field lengths.
- Rejection of malformed requests and wrong content types.
- Honeypot submissions that return success without calling Resend.
- HTML escaping and plain-text message construction.
- Missing environment configuration.
- Successful Resend delivery and provider failure using a mocked delivery client.
- Product context and general inquiry context.
- Client pending state, double-submit prevention, success reset, field errors, and retryable delivery errors.

Runtime verification includes:

- `npm test`.
- `npm run typecheck`.
- `npm run build`.
- Desktop and 390px mobile screenshots for the contact and product forms.
- A local mocked submission covering success and failure states.
- One real Resend submission after the API key and verified sender are configured, followed by confirmation that the message arrived at `gu@apexps-nj.com` and that replying targets the visitor email.

## Rollout

1. Implement and verify the form and API route locally with a mocked Resend client.
2. Create or use a Resend account controlled by APEX.
3. Verify the selected sending domain in Resend when its DNS access is available.
4. Add `RESEND_API_KEY`, `INQUIRY_FROM_EMAIL`, and optionally `INQUIRY_TO_EMAIL` to the Vercel Production environment.
5. Deploy and run one synthetic production inquiry.
6. Confirm receipt, formatting, reply behavior, and error monitoring before treating the form as live.

Until step 4 is complete, the production endpoint must return `EMAIL_NOT_CONFIGURED`; the UI must not show a false success message.

## Acceptance Criteria

- A valid inquiry sends exactly one email to the configured recipient.
- Product emails identify the product model; contact-page emails identify a general inquiry.
- The recipient can reply directly to the visitor's validated email address.
- Invalid submissions never call Resend and show useful field errors.
- Bot honeypot submissions do not call Resend.
- Missing configuration and provider failures never display success.
- No credential or full inquiry content appears in browser responses or server logs.
- The form is usable without horizontal overflow at 390px and exposes status changes to assistive technology.
- Automated tests, type checking, and the production build pass.
