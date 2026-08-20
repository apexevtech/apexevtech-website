type InquiryFormProps = {
  compact?: boolean;
};

export function InquiryForm({ compact = false }: InquiryFormProps) {
  return (
    <form className="grid gap-5 rounded-md border border-slate-200 bg-white p-6 shadow-[0_12px_36px_rgba(18,38,58,0.07)] sm:p-8">
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <label className="grid gap-2 text-sm font-bold text-[#385064]">
          Name
          <input className="rounded-md border border-slate-300 bg-[#fbfcfd] px-3 py-3 font-normal text-[#12263a] outline-none transition focus:border-[#1479c9] focus:bg-white" name="name" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#385064]">
          Email
          <input className="rounded-md border border-slate-300 bg-[#fbfcfd] px-3 py-3 font-normal text-[#12263a] outline-none transition focus:border-[#1479c9] focus:bg-white" type="email" name="email" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#385064]">
          Company
          <input className="rounded-md border border-slate-300 bg-[#fbfcfd] px-3 py-3 font-normal text-[#12263a] outline-none transition focus:border-[#1479c9] focus:bg-white" name="company" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-[#385064]">
          Country
          <input className="rounded-md border border-slate-300 bg-[#fbfcfd] px-3 py-3 font-normal text-[#12263a] outline-none transition focus:border-[#1479c9] focus:bg-white" name="country" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-[#385064]">
        Message
        <textarea className="min-h-32 rounded-md border border-slate-300 bg-[#fbfcfd] px-3 py-3 font-normal text-[#12263a] outline-none transition focus:border-[#1479c9] focus:bg-white" name="message" />
      </label>
      <button className="rounded-md bg-[#1479c9] px-5 py-3 font-extrabold text-white transition hover:bg-[#0f5f9f]" type="submit">
        Request a quote
      </button>
    </form>
  );
}
