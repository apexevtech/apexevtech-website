import type { InquirySubmission } from "@/lib/inquiries/types";

export type InquiryEmail = {
  subject: string;
  replyTo: string;
  text: string;
  html: string;
};

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildInquiryEmail(inquiry: InquirySubmission): InquiryEmail {
  const subjectContext = inquiry.context ? ` - ${inquiry.context}` : "";
  const subject = `New APEX website inquiry${subjectContext}`;
  const fields: Array<[string, string]> = [
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Company", inquiry.company || "Not provided"],
    ["Country", inquiry.country || "Not provided"],
    ["Context", inquiry.context || "General website inquiry"],
  ];
  if (inquiry.attribution) {
    fields.push(["First touch", JSON.stringify(inquiry.attribution.firstTouch)]);
    fields.push(["Latest touch", JSON.stringify(inquiry.attribution.latestTouch)]);
  }
  const text = [
    subject,
    "",
    ...fields.flatMap(([label, value]) => [`${label}: ${value}`, ""]),
    "Message:",
    inquiry.message,
  ].join("\n");
  const htmlFields = fields
    .map(([label, value]) => `<tr><th style="padding:8px 12px;text-align:left;background:#eef4f7;color:#234056">${escapeHtml(label)}</th><td style="padding:8px 12px;color:#526b7d">${escapeHtml(value)}</td></tr>`)
    .join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#12263a"><h2>${escapeHtml(subject)}</h2><table style="border-collapse:collapse;border:1px solid #dce5ea">${htmlFields}</table><h3>Message</h3><p style="white-space:pre-wrap">${escapeHtml(inquiry.message)}</p></div>`;

  return { subject, replyTo: inquiry.email, text, html };
}
