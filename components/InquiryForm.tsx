"use client";

import type { FormEvent } from "react";
import { useRef, useState } from "react";
import type { InquiryApiResponse, InquiryField, InquiryFieldErrors } from "@/lib/inquiries/types";

type InquiryFormProps = {
  compact?: boolean;
  context?: string;
};

const fieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  country: "Country",
  message: "Message",
};

export function InquiryForm({ compact = false, context = "General website inquiry" }: InquiryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({});
  const startedAt = useRef(Date.now());

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setFieldErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      country: formData.get("country"),
      message: formData.get("message"),
      context,
      privacyAccepted: formData.get("privacyAccepted") === "on",
      website: formData.get("website"),
      formStartedAt: startedAt.current,
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as InquiryApiResponse;

      if (!response.ok || !result.ok) {
        setFieldErrors(!result.ok ? result.fieldErrors ?? {} : {});
        setMessage({ type: "error", text: result.ok ? "Please try again." : result.message });
        return;
      }

      form.reset();
      startedAt.current = Date.now();
      setMessage({ type: "success", text: result.message });
    } catch {
      setMessage({ type: "error", text: "We could not send your inquiry. Please email us directly instead." });
    } finally {
      setSubmitting(false);
    }
  }

  function inputClass(field: InquiryField) {
    return `rounded-md border ${fieldErrors[field] ? "border-red-400" : "border-slate-300"} bg-[#fbfcfd] px-3 py-3 font-normal text-[#12263a] outline-none transition focus:border-[#1479c9] focus:bg-white`;
  }

  function errorFor(field: InquiryField) {
    return fieldErrors[field] ? <span className="text-xs font-semibold text-red-600">{fieldErrors[field]}</span> : null;
  }

  return (
    <form className="relative grid gap-5 rounded-md border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(18,38,58,0.07)] sm:p-8" onSubmit={handleSubmit}>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        {(["name", "email", "phone", "company", "country"] as const).map((field) => (
          <label key={field} className="grid gap-2 text-sm font-bold text-[#385064]">
            {fieldLabels[field]}{field === "name" || field === "email" ? " *" : ""}
            <input
              className={inputClass(field)}
              name={field}
              type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
              autoComplete={field === "email" ? "email" : field === "phone" ? "tel" : field}
              required={field === "name" || field === "email"}
              aria-invalid={Boolean(fieldErrors[field])}
              aria-describedby={fieldErrors[field] ? `${field}-error` : undefined}
            />
            {fieldErrors[field] ? <span id={`${field}-error`} className="text-xs font-semibold text-red-600">{fieldErrors[field]}</span> : null}
          </label>
        ))}
      </div>

      <label className="grid gap-2 text-sm font-bold text-[#385064]">
        Message *
      <textarea
          className={`${inputClass("message")} min-h-32`}
          name="message"
          required
          minLength={10}
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-error" : undefined}
        />
        {errorFor("message")}
      </label>

      <label className="flex items-start gap-3 text-sm leading-6 text-[#526b7d]">
        <input className="mt-1 h-4 w-4 shrink-0 accent-[#1479c9]" type="checkbox" name="privacyAccepted" required />
        <span>
          I agree that APEX may use my information to respond to this inquiry. See the <a className="font-bold text-[#1479c9] underline" href="/privacy-policy">Privacy Policy</a>.
        </span>
      </label>
      {fieldErrors.privacyAccepted ? <span className="text-xs font-semibold text-red-600">{fieldErrors.privacyAccepted}</span> : null}

      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {message ? (
        <p className={`rounded-md border px-4 py-3 text-sm font-semibold ${message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-700"}`} role="status" aria-live="polite">
          {message.text}
        </p>
      ) : null}

      <button className="rounded-md bg-[#1479c9] px-5 py-3 font-extrabold text-white transition hover:bg-[#0f5f9f] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Request a quote"}
      </button>
    </form>
  );
}
