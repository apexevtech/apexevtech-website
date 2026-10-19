"use client";

import { company } from "@/data/site";
import { TrackedLink } from "@/components/TrackedLink";
import Link from "next/link";
import type { FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { InquiryField, InquiryFieldErrors } from "@/lib/inquiries/types";
import { requestInquiry } from "@/lib/inquiries/request";
import { clearAttribution, readAttribution } from "@/lib/attribution/utm";
import { trackEvent } from "@/lib/analytics/events";
import { products } from "@/data/site";
import { InquiryRequirementsAssistant } from "@/components/InquiryRequirementsAssistant";
import { addInquiryRequirements } from "@/lib/inquiries/requirements";
import { resolveInquiryPrefill, shouldReplaceInquiryPrefill } from "@/lib/inquiries/prefill";
import { QueryStateSync } from "@/components/QueryStateSync";

type InquiryFormProps = {
  compact?: boolean;
  context?: string;
  prefillProductsFromQuery?: boolean;
  prefillContextFromQuery?: boolean;
};

const fieldLabels: Record<string, string> = {
  name: "Name",
  email: "Email",
  phone: "Phone",
  company: "Company",
  country: "Country",
  message: "Message",
};

export function InquiryForm({ compact = false, context = "General website inquiry", prefillProductsFromQuery = false, prefillContextFromQuery = false }: InquiryFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<InquiryFieldErrors>({});
  const [resolvedContext, setResolvedContext] = useState(context);
  const [relatedProductModels, setRelatedProductModels] = useState(context.startsWith("Product inquiry: ") ? context.slice("Product inquiry: ".length) : "");
  const startedAt = useRef(0);
  const inFlight = useRef(false);
  const interactionTracked = useRef(false);
  const invalidTracked = useRef(false);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const previousPrefill = useRef("");
  const formRef = useRef<HTMLFormElement>(null);
  const feedbackRef = useRef<HTMLDivElement>(null);
  const focusField = useRef<string | null>(null);
  const analyticsParameters = {
    form_id: "equipment_inquiry",
    form_context: resolvedContext,
    ...(relatedProductModels ? { product_models: relatedProductModels } : {}),
  };
  const whatsappHref = `https://api.whatsapp.com/send?phone=8617714412321&text=${encodeURIComponent(`Hello APEX, I need help with ${resolvedContext}.`)}`;

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (submitting || !message) return;
    const control = focusField.current ? formRef.current?.elements.namedItem(focusField.current) : null;
    if (control instanceof HTMLElement) control.focus();
    else feedbackRef.current?.focus();
    focusField.current = null;
  }, [message, submitting]);

  const syncInquiryContext = useCallback((params: URLSearchParams) => {
    const prefill = resolveInquiryPrefill(params, { context, prefillProductsFromQuery, prefillContextFromQuery }, products);
    setResolvedContext(prefill.context);
    setRelatedProductModels(prefill.productModels);
    const textarea = messageRef.current;
    if (textarea && shouldReplaceInquiryPrefill(textarea.value, previousPrefill.current)) {
      textarea.value = prefill.message;
    }
    previousPrefill.current = prefill.message;
  }, [context, prefillProductsFromQuery, prefillContextFromQuery]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSubmitting(true);
    setMessage(null);
    setFieldErrors({});
    focusField.current = null;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      company: formData.get("company"),
      country: formData.get("country"),
      message: formData.get("message"),
      context: resolvedContext,
      privacyAccepted: formData.get("privacyAccepted") === "on",
      website: formData.get("website"),
      formStartedAt: startedAt.current,
      attribution: readAttribution(),
    };
    trackEvent("inquiry_submit", analyticsParameters);

    try {
      const { response, result } = await requestInquiry(payload);

      if (!response.ok || !result.ok) {
        setFieldErrors(!result.ok ? result.fieldErrors ?? {} : {});
        setMessage({ type: "error", text: result.ok ? "Please try again." : result.message });
        trackEvent("inquiry_error", { ...analyticsParameters, reason: result.ok ? "HTTP_ERROR" : result.code });
        if (!result.ok && result.fieldErrors) {
          focusField.current = Object.keys(result.fieldErrors).find((field) => form.elements.namedItem(field) instanceof HTMLElement) ?? null;
        }
        return;
      }

      form.reset();
      startedAt.current = Date.now();
      if (result.leadRecorded) trackEvent("generate_lead", { ...analyticsParameters, lead_source: "website_form" });
      interactionTracked.current = false;
      clearAttribution();
      setMessage({ type: "success", text: result.message });
    } catch (error) {
      const timedOut = error instanceof DOMException && error.name === "TimeoutError";
      trackEvent("inquiry_error", { ...analyticsParameters, reason: timedOut ? "TIMEOUT" : "NETWORK_ERROR" });
      setMessage({ type: "error", text: "We could not confirm delivery. Your inquiry may have reached us. Your entries are still here; please contact us by email to confirm before sending again." });
    } finally {
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  function inputClass(field: InquiryField) {
    return `rounded-md border ${fieldErrors[field] ? "border-red-400" : "border-slate-300"} bg-[#fbfcfd] px-3 py-3 text-base font-normal text-[#12263a] outline-none transition focus:border-[#1479c9] focus:bg-white`;
  }

  function errorFor(field: InquiryField) {
    return fieldErrors[field] ? <span id={`${field}-error`} className="text-xs font-semibold text-red-600">{fieldErrors[field]}</span> : null;
  }

  return (
    <form ref={formRef} aria-label="Equipment inquiry" aria-busy={submitting} className="inquiry-form relative grid gap-5 rounded-md border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(18,38,58,0.07)] sm:p-8" onSubmit={handleSubmit} onInvalid={() => {
      if (!invalidTracked.current) {
        invalidTracked.current = true;
        trackEvent("inquiry_error", { ...analyticsParameters, reason: "CLIENT_VALIDATION" });
      }
    }} onChange={(event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.name === "website") return;
      if ((target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) && target.name in fieldErrors) {
        setFieldErrors((previous) => {
          const next = { ...previous };
          delete next[target.name as InquiryField];
          return next;
        });
      }
      invalidTracked.current = false;
      if (!startedAt.current) startedAt.current = Date.now();
      if (!interactionTracked.current) {
        interactionTracked.current = true;
        trackEvent("inquiry_start", analyticsParameters);
      }
    }}>
      <QueryStateSync onChange={syncInquiryContext} />
      <div className="border-b border-slate-200 pb-5">
        <p className="font-black text-[#12263a]">Tell us about your test requirements</p>
        {relatedProductModels ? <p className="mt-3 break-words rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-sm leading-6 text-[#385064]"><span className="font-bold">Equipment of interest: </span>{relatedProductModels}</p> : null}
        <p className="mt-2 text-sm leading-6 text-[#526b7d]">Company and country are optional. Prefer a direct conversation?</p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm">
          <TrackedLink href={whatsappHref} target="_blank" rel="noopener noreferrer" eventName="whatsapp_click" location="inquiry-direct" eventParameters={analyticsParameters} className="inline-flex min-h-11 items-center rounded-md bg-[#15803d] px-4 font-bold text-white">Ask on WhatsApp</TrackedLink>
          <TrackedLink href={`mailto:${company.email}?subject=${encodeURIComponent(resolvedContext)}`} eventName="email_click" location="inquiry-direct" eventParameters={analyticsParameters} className="inline-flex min-h-11 items-center rounded-md border border-slate-300 px-4 font-bold text-[#1268a8]">Email an engineer</TrackedLink>
        </div>
      </div>
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        {(["name", "email", "company", "country"] as const).map((field) => (
          <label key={field} className="grid gap-2 text-sm font-bold text-[#385064]">
            {fieldLabels[field]}{field === "name" || field === "email" ? " *" : " (optional)"}
            <input
              className={inputClass(field)}
              name={field}
              type={field === "email" ? "email" : "text"}
              autoComplete={field === "company" ? "organization" : field === "country" ? "country-name" : field}
              required={field === "name" || field === "email"}
              minLength={field === "name" ? 2 : undefined}
              maxLength={field === "name" ? 120 : field === "email" ? 254 : field === "company" ? 160 : 100}
              disabled={submitting}
              aria-invalid={Boolean(fieldErrors[field])}
              aria-describedby={fieldErrors[field] ? `${field}-error` : undefined}
            />
            {fieldErrors[field] ? <span id={`${field}-error`} className="text-xs font-semibold text-red-600">{fieldErrors[field]}</span> : null}
          </label>
        ))}
      </div>

      <InquiryRequirementsAssistant disabled={submitting} onApply={(summary) => {
        const textarea = messageRef.current;
        if (!textarea) return false;
        const combined = addInquiryRequirements(textarea.value, summary);
        if (combined === null) return false;
        textarea.value = combined;
        setFieldErrors((previous) => ({ ...previous, message: undefined }));
        textarea.focus();
        return true;
      }} />

      <label className="grid gap-2 text-sm font-bold text-[#385064]">
        Message *
      <textarea
          ref={messageRef}
          className={`${inputClass("message")} min-h-32`}
          name="message"
          required
          minLength={10}
          maxLength={5000}
          disabled={submitting}
          placeholder="For example: CCS2 DC charger, 1000 V / 300 A, field commissioning and protocol diagnosis."
          aria-invalid={Boolean(fieldErrors.message)}
          aria-describedby={fieldErrors.message ? "message-help message-error" : "message-help"}
        />
        {errorFor("message")}
      </label>

      <p id="message-help" className="-mt-3 text-xs leading-5 text-[#526b7d]">Include your charger connector, voltage/current range and required tests (at least 10 characters).</p>

      <label className="flex items-start gap-3 text-sm leading-6 text-[#526b7d]">
        <input className="mt-1 h-4 w-4 shrink-0 accent-[#1479c9]" type="checkbox" name="privacyAccepted" required disabled={submitting} aria-invalid={Boolean(fieldErrors.privacyAccepted)} aria-describedby={fieldErrors.privacyAccepted ? "privacy-error" : undefined} />
        <span>
          I agree that APEX may use my information to respond to this inquiry. See the <a className="font-bold text-[#1268a8] underline" href="/privacy-policy">Privacy Policy</a>.
        </span>
      </label>
      {fieldErrors.privacyAccepted ? <span id="privacy-error" className="text-xs font-semibold text-red-600">{fieldErrors.privacyAccepted}</span> : null}

      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {message?.type === "success" ? (
        <div ref={feedbackRef} tabIndex={-1} className="grid gap-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-5 text-sm text-emerald-900" role="status" aria-live="polite">
          <p className="font-bold">{message.text}</p>
          <div className="flex flex-wrap gap-3">
            <TrackedLink href={whatsappHref} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-md bg-[#15803d] px-4 py-2 font-bold text-white" eventName="whatsapp_click" location="inquiry-success" eventParameters={analyticsParameters}>Continue on WhatsApp</TrackedLink>
            <Link href="/products" className="rounded-md border border-emerald-300 px-4 py-2 font-bold text-emerald-900">Browse products</Link>
            <Link href="/solutions" className="rounded-md border border-emerald-300 px-4 py-2 font-bold text-emerald-900">Review solutions</Link>
          </div>
        </div>
      ) : message?.type === "error" ? (
        <div ref={feedbackRef} tabIndex={-1} className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700" role="alert">
          {message.text}
          <TrackedLink href={`mailto:${company.email}?subject=${encodeURIComponent(resolvedContext)}`} eventName="email_click" location="inquiry-error" eventParameters={analyticsParameters} className="mt-2 block min-h-11 py-2 font-bold underline">Email {company.email}</TrackedLink>
        </div>
      ) : null}

      <button className="rounded-md bg-[#1479c9] px-5 py-3 font-extrabold text-white transition hover:bg-[#0f5f9f] disabled:cursor-wait disabled:opacity-60" type="submit" disabled={submitting}>
        {submitting ? "Sending..." : "Request a quote"}
      </button>
    </form>
  );
}
