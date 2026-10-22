"use client";

import { useState } from "react";
import { formatInquiryRequirements } from "@/lib/inquiries/requirements";
import { T, useLanguage } from "@/components/LanguageProvider";

export function InquiryRequirementsAssistant({ disabled, onApply }: { disabled: boolean; onApply: (summary: string) => boolean }) {
  const { t } = useLanguage();
  const [error, setError] = useState("");

  return (
    <details className="rounded-md border border-slate-200 bg-[#f7fafc] p-4">
      <summary className="cursor-pointer py-1 text-sm font-bold text-[#1268a8]"><T>Need help describing your test scope? (optional)</T></summary>
      <fieldset disabled={disabled} className="mt-4 grid min-w-0 gap-4" onChange={() => setError("")}>
        <legend className="sr-only"><T>Build your test requirements</T></legend>
        <p className="text-sm leading-6 text-[#526b7d]"><T>Choose what you know, then add it to your message. You can edit the details before sending.</T></p>
        <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">
          <T>Test workflow</T>
          <select name="scopeWorkflow" defaultValue="" className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-base font-normal text-[#12263a]">
            <option value="">{t("Select a workflow (optional)")}</option>
            {["Laboratory / R&D validation", "Production / end-of-line testing", "Field commissioning / maintenance", "Metering verification", "Please recommend a test workflow"].map((value) => <option key={value} value={value}>{t(value)}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-2 text-sm font-bold text-[#385064]">
          <T>Charger connector / interface</T>
          <select name="scopeConnector" defaultValue="" className="min-h-12 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-base font-normal text-[#12263a]">
            <option value="">{t("Select an interface (optional)")}</option>
            {["GB/T AC", "GB/T DC", "CCS1 DC", "CCS2 DC", "CHAdeMO DC", "Type 1 / SAE J1772 AC", "Type 2 AC", "NACS AC", "NACS DC", "Multiple interfaces", "Not sure — please advise"].map((value) => <option key={value} value={value}>{t(value)}</option>)}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#385064]">
          <T>Voltage / current range (optional)</T>
          <input name="scopeElectricalRange" type="text" maxLength={120} placeholder={t("For example: 200–1000 V DC, up to 300 A")} className="min-w-0 rounded-md border border-slate-300 bg-white px-3 py-3 text-base font-normal text-[#12263a]" />
        </label>
        <p className="text-xs leading-5 text-[#526b7d]"><T>Unsure about a connector or rating? Leave it blank or ask for advice. Final equipment coverage will be confirmed by an engineer.</T></p>
        {error ? <p role="alert" className="text-sm font-semibold text-red-700">{t(error)}</p> : null}
        <button type="button" disabled={disabled} className="min-h-11 justify-self-start rounded-md border border-[#1479c9] bg-white px-4 py-2 text-sm font-bold text-[#1268a8] hover:bg-sky-50 disabled:opacity-60" onClick={(event) => {
          const form = event.currentTarget.form;
          if (!form) return;
          const data = new FormData(form);
          const summary = formatInquiryRequirements({ workflow: String(data.get("scopeWorkflow") ?? ""), connector: String(data.get("scopeConnector") ?? ""), electricalRange: String(data.get("scopeElectricalRange") ?? "") }, t);
          if (!summary) setError("Choose a workflow or interface, or enter an electrical range first.");
          else if (!onApply(summary)) setError("These details would exceed the 5,000-character message limit. Shorten your message before adding them.");
          else setError("");
        }}><T>Add details to message</T></button>
      </fieldset>
    </details>
  );
}
