import { Resend } from "resend";
import { buildInquiryEmail } from "@/lib/inquiries/email";
import type { InquirySubmission } from "@/lib/inquiries/types";

export type DeliveryResult =
  | { ok: true }
  | { ok: false; code: "NOT_CONFIGURED" | "DELIVERY_FAILED"; detail?: string };

export async function deliverInquiry(inquiry: InquirySubmission): Promise<DeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.INQUIRY_FROM_EMAIL;
  const to = process.env.INQUIRY_TO_EMAIL || "gu@apexps-nj.com";

  if (!apiKey || !from || !to) {
    return { ok: false, code: "NOT_CONFIGURED" };
  }

  const email = buildInquiryEmail(inquiry);
  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email.replyTo,
      subject: email.subject,
      text: email.text,
      html: email.html,
    });

    return error ? { ok: false, code: "DELIVERY_FAILED", detail: error.message } : { ok: true };
  } catch (error) {
    return {
      ok: false,
      code: "DELIVERY_FAILED",
      detail: error instanceof Error ? error.message : "Unknown delivery error",
    };
  }
}
