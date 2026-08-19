type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  compact?: boolean;
};

export function PageHero({ eyebrow, title, subtitle, description, compact = false }: PageHeroProps) {
  return (
    <section className={`${compact ? "bg-slate-950" : "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950"} text-white`}>
      <div className={`mx-auto max-w-7xl px-5 lg:px-8 ${compact ? "py-12 md:py-14" : "py-20"}`}>
        <p className={`${compact ? "text-xs" : "text-sm"} font-extrabold uppercase text-sky-300`}>{eyebrow}</p>
        <h1 className={`${compact ? "mt-3 max-w-5xl text-3xl md:text-4xl lg:text-[42px]" : "mt-4 max-w-4xl text-4xl md:text-6xl"} font-black leading-tight`}>
          {title}
        </h1>
        {subtitle ? <p className="mt-2 max-w-4xl text-lg font-semibold leading-7 text-slate-100 md:text-xl">{subtitle}</p> : null}
        <p className={`${compact ? "mt-3 max-w-4xl text-base leading-7" : "mt-5 max-w-3xl text-lg leading-8"} text-slate-300`}>{description}</p>
      </div>
    </section>
  );
}
