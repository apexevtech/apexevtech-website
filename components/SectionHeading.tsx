import { T } from "@/components/LanguageProvider";
type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  compact?: boolean;
};

export function SectionHeading({ eyebrow, title, description, compact = false }: SectionHeadingProps) {
  return (
    <div className={`${compact ? "mb-5" : "mb-10"} max-w-3xl`}>
      <p className={`${compact ? "text-xs" : "text-sm"} font-black uppercase text-[#1268a8]`}><T>{eyebrow}</T></p>
      <h2 className={`${compact ? "mt-2 text-2xl font-semibold leading-[1.3] md:text-3xl" : "mt-3 text-3xl font-bold leading-[1.25] md:text-4xl"} text-[#12263a]`}><T>{title}</T></h2>
      {description ? <p className={`${compact ? "mt-2 text-sm leading-6" : "mt-4 text-base leading-7"} text-[#526b7d]`}><T>{description}</T></p> : null}
    </div>
  );
}
