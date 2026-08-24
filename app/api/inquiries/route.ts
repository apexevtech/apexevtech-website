import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/inquiries/delivery";
import { inquiryRateLimiter } from "@/lib/inquiries/rate-limit";
import { parseInquiry } from "@/lib/inquiries/validation";
import type { InquiryApiResponse } from "@/lib/inquiries/types";

export const runtime = "nodejs";
const MAX_REQUEST_BYTES = 16_384;

function json(body: InquiryApiResponse, status = 200, result = "UNKNOWN") {
  console.info("Inquiry request", { result });
  return NextResponse.json(body, { status });
}

async function readLimitedBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

function requestKey(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return json({ ok: false, code: "INVALID_REQUEST", message: "Send the inquiry as JSON." }, 400, "INVALID_REQUEST");
  }

  let rawBody: string | null;
  try {
    rawBody = await readLimitedBody(request);
  } catch {
    return json({ ok: false, code: "INVALID_REQUEST", message: "Please submit the form again." }, 400, "INVALID_REQUEST");
  }

  if (rawBody === null) {
    return json({ ok: false, code: "INVALID_REQUEST", message: "The inquiry request is too large." }, 400, "INVALID_REQUEST");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, code: "INVALID_REQUEST", message: "Please submit the form again." }, 400, "INVALID_REQUEST");
  }

  const parsed = parseInquiry(body);
  if (!parsed.ok) {
    return json(
      {
        ok: false,
        code: "VALIDATION_ERROR",
        message: "Please check the highlighted fields.",
        fieldErrors: parsed.fieldErrors,
      },
      400,
      "VALIDATION_ERROR",
    );
  }

  if (parsed.isBot) {
    return json({ ok: true, message: "Thank you. Your inquiry has been received." }, 200, "BOT_IGNORED");
  }

  if (inquiryRateLimiter.isLimited(requestKey(request))) {
    return json(
      {
        ok: false,
        code: "RATE_LIMITED",
        message: "Too many requests. Please wait a few minutes and try again.",
      },
      429,
      "RATE_LIMITED",
    );
  }

  const delivery = await deliverInquiry(parsed.value);
  if (delivery.ok) {
    return json({ ok: true, message: "Thanks — your inquiry has been sent. Our team will reply shortly." }, 200, "SUCCESS");
  }

  if (delivery.code === "NOT_CONFIGURED") {
    return json(
      {
        ok: false,
        code: "EMAIL_NOT_CONFIGURED",
        message: "The inquiry service is temporarily unavailable. Please email us directly instead.",
      },
      503,
      "EMAIL_NOT_CONFIGURED",
    );
  }

  return json(
    {
      ok: false,
      code: "EMAIL_DELIVERY_FAILED",
      message: "We could not send your inquiry. Please try again or email us directly.",
    },
    502,
    "EMAIL_DELIVERY_FAILED",
  );
}
