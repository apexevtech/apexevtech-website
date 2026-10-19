import type { InquiryApiResponse } from "@/lib/inquiries/types";

export async function requestInquiry(payload: unknown, timeoutMs = 20_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    const result = (await response.json()) as InquiryApiResponse;
    if (!result || typeof result.ok !== "boolean" || typeof result.message !== "string" || (result.ok && typeof result.leadRecorded !== "boolean")) {
      throw new Error("Invalid inquiry response");
    }
    return { response, result };
  } catch (error) {
    if (controller.signal.aborted) throw new DOMException("Inquiry confirmation timed out", "TimeoutError");
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
