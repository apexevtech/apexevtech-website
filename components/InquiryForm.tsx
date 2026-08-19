type InquiryFormProps = {
  compact?: boolean;
};

export function InquiryForm({ compact = false }: InquiryFormProps) {
  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Name
          <input className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" name="name" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Email
          <input className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" type="email" name="email" required />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Company
          <input className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" name="company" />
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          Country
          <input className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" name="country" />
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-slate-700">
        Message
        <textarea className="min-h-32 rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" name="message" />
      </label>
      <button className="rounded-md bg-apex-blue px-5 py-3 font-extrabold text-white transition hover:bg-blue-700" type="submit">
        Submit Inquiry
      </button>
    </form>
  );
}
