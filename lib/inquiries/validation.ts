import type { InquiryFieldErrors, InquiryParseResult } from "@/lib/inquiries/types";
import type { UtmAttribution, UtmValues } from "@/lib/attribution/utm";

const MIN_SUBMIT_TIME_MS = 1_200;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1_000;

function asRecord(input: unknown): Record<string, unknown> | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return null;
  }

  return input as Record<string, unknown>;
}

function clean(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function errorResult(fieldErrors: InquiryFieldErrors): InquiryParseResult {
  return { ok: false, fieldErrors };
}

export function parseInquiry(input: unknown, now = Date.now()): InquiryParseResult {
  const record = asRecord(input);
  if (!record) {
    return errorResult({ form: "Please submit the form again." });
  }

  if (clean(record.website, 200)) {
    return { ok: true, isBot: true };
  }

  const rawStartedAt = record.formStartedAt;
  const startedAt =
    typeof rawStartedAt === "number"
      ? rawStartedAt
      : typeof rawStartedAt === "string" && rawStartedAt.trim()
        ? Number(rawStartedAt)
        : Number.NaN;
  if (!Number.isFinite(startedAt)) {
    return errorResult({ form: "Please submit the form again." });
  }
  if (now - startedAt < MIN_SUBMIT_TIME_MS || now - startedAt > MAX_FORM_AGE_MS) {
    return { ok: true, isBot: true };
  }

  const name = clean(record.name, 120);
  const email = clean(record.email, 254).toLowerCase();
  const company = clean(record.company, 160);
  const country = clean(record.country, 100);
  const rawMessage = typeof record.message === "string" ? record.message.trim() : "";
  const message = rawMessage.slice(0, 5_000);
  const context = clean(record.context, 200);
  const privacyAccepted = record.privacyAccepted === true || record.privacyAccepted === "true";

  const fieldErrors: InquiryFieldErrors = {};
  if (name.length < 2) fieldErrors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fieldErrors.email = "Please enter a valid business email.";
  if (rawMessage.length > 5_000) {
    fieldErrors.message = "Please keep your message under 5,000 characters.";
  } else if (message.length < 10) {
    fieldErrors.message = "Please add a few details about your requirements.";
  }
  if (!privacyAccepted) fieldErrors.privacyAccepted = "Please accept the privacy notice to continue.";

  const rawAttribution = record.attribution;
  const attribution = rawAttribution && typeof rawAttribution === "object" ? rawAttribution as Partial<UtmAttribution> : undefined;
  const safeAttribution: UtmAttribution | undefined = attribution
    ? { firstTouch: cleanUtmValues(attribution.firstTouch), latestTouch: cleanUtmValues(attribution.latestTouch) }
    : undefined;
  if (Object.keys(fieldErrors).length > 0) return errorResult(fieldErrors);
  const value = { name, email, company, country, message, context, privacyAccepted: true as const };
  return safeAttribution ? { ok: true, isBot: false, value: { ...value, attribution: safeAttribution } } : { ok: true, isBot: false, value };
}

function cleanUtmValues(input: unknown): UtmValues {
  if (!input || typeof input !== "object" || Array.isArray(input)) return {};
  const record = input as Record<string, unknown>;
  const keys = ["utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm"] as const;
  return Object.fromEntries(keys.flatMap((key) => {
    const value = clean(record[key], 120);
    return value ? [[key, value]] : [];
  })) as UtmValues;
}
