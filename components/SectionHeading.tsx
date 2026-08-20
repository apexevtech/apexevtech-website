type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
};

export function SectionHeading({ eyebrow, title, description, compact = false }: SectionHeadingProps) {
  return (
    <div className={`${compact ? "mb-5" : "mb-10"} max-w-3xl`}>
      <p className={`${compact ? "text-xs" : "text-sm"} font-black uppercase text-[#1479c9]`}>{eyebrow}</p>
      <h2 className={`${compact ? "mt-2 text-2xl md:text-3xl" : "mt-3 text-3xl md:text-4xl"} font-black leading-[1.12] text-[#12263a]`}>{title}</h2>
      {description ? <p className={`${compact ? "mt-2 text-sm leading-6" : "mt-4 text-base leading-7"} text-[#526b7d]`}>{description}</p> : null}
    </div>
  );
}
