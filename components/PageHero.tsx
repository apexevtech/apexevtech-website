type PageHeroProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  description: string;
  compact?: boolean;
};

export function PageHero({ eyebrow, title, subtitle, description, compact = false }: PageHeroProps) {
  return (
    <section className={`${compact ? "bg-[#17324a]" : "bg-[#102a43]"} text-white`}>
      <div className={`mx-auto max-w-7xl px-5 lg:px-8 ${compact ? "py-10 md:py-12" : "py-12 md:py-16"}`}>
        <p className={`${compact ? "text-xs" : "text-sm"} font-black uppercase text-[#7de3ef]`}>{eyebrow}</p>
        <h1 className={`${compact ? "mt-3 max-w-5xl text-3xl md:text-4xl" : "mt-3 max-w-4xl text-3xl md:text-5xl"} font-black leading-[1.1]`}>
          {title}
        </h1>
        {subtitle ? <p className="mt-3 max-w-4xl text-lg font-semibold leading-7 text-white/90 md:text-xl">{subtitle}</p> : null}
        <p className={`${compact ? "mt-3 max-w-4xl text-base leading-7" : "mt-4 max-w-3xl text-base leading-7 md:text-lg"} text-slate-200`}>{description}</p>
      </div>
    </section>
  );
}
