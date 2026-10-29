import type { Metadata } from "next";
import Link from "@/components/LocaleLink";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, ClipboardList, FileCheck2, Info, MessageSquare, Workflow } from "lucide-react";
import { T } from "@/components/LanguageProvider";
import { StructuredData } from "@/components/StructuredData";
import { TrackedLink } from "@/components/TrackedLink";
import { ProjectBriefImage } from "@/components/ProjectBriefImage";
import { projectBriefs } from "@/data/project-briefs";
import { getProjectBrief } from "@/lib/engineering-cases/briefs";
import { engineeringCaseDetailSlugs, getEngineeringCaseIndexHref } from "@/lib/engineering-cases/detail-path";
import { getEngineeringCaseCategoryLabel } from "@/lib/engineering-cases/filter";
import { buildReferenceCaseInquiryHref } from "@/lib/inquiries/reference-case";
import { getResource } from "@/lib/resources/catalog";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return engineeringCaseDetailSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const reference = getProjectBrief((await params).slug);
  if (!reference) return {};
  return buildPageMetadata({
    title: reference.brief.title,
    description: reference.brief.description,
    path: `/project-cases/${reference.entry.slug}`,
    image: reference.image.src,
  });
}

export default async function ProjectBriefPage({ params }: Props) {
  const reference = getProjectBrief((await params).slug);
  if (!reference) notFound();
  const { brief, entry, image, material, application } = reference;
  const guide = getResource(entry.relatedResourceSlug)!;
  const inquiryHref = buildReferenceCaseInquiryHref(entry.slug, "detail");
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Project Cases", item: `${siteUrl}/project-cases` },
      { "@type": "ListItem", position: 3, name: brief.title, item: `${siteUrl}/project-cases/${entry.slug}` },
    ],
  };
  const inquiryAction = (location: string) => <TrackedLink href={inquiryHref} eventName="case_inquiry_click" location={location} eventParameters={{ reference_case: entry.slug }} className="inline-flex min-h-11 max-w-full items-center justify-center gap-2 rounded-md bg-[#1268a8] px-5 py-3 text-sm font-semibold leading-6 text-white hover:bg-[#0f5f9f]"><MessageSquare size={18} aria-hidden="true" className="shrink-0" /><span><T>Discuss a similar configuration</T></span></TrackedLink>;

  return <>
    <StructuredData data={breadcrumb} />
    <article className="bg-white">
      <header className="border-b border-slate-200 px-5 pb-8 pt-6 sm:pb-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm leading-6 text-[#526b7d]">
            <Link href="/" className="inline-flex min-h-11 items-center text-[#1268a8] hover:underline"><T>Home</T></Link><span aria-hidden="true">/</span>
            <Link href="/project-cases" className="inline-flex min-h-11 items-center text-[#1268a8] hover:underline"><T>Project Cases</T></Link><span aria-hidden="true">/</span><span aria-current="page"><T>{entry.title}</T></span>
          </nav>
          <p className="mt-5 text-xs font-semibold leading-6 text-[#1268a8]"><T>Project reference brief</T><span aria-hidden="true"> / </span><T>{getEngineeringCaseCategoryLabel(entry.categoryId)}</T></p>
          <h1 className="mt-2 max-w-4xl break-words text-3xl font-bold leading-tight text-[#12263a] md:text-4xl"><T>{brief.title}</T></h1>
          <p className="mt-4 max-w-4xl text-base leading-7 text-[#526b7d]"><T>{brief.objective}</T></p>
          <div className="mt-5 flex max-w-4xl items-start gap-2 border-l-2 border-[#8bb3cf] pl-4 text-sm leading-6 text-[#526b7d]"><Info size={18} aria-hidden="true" className="mt-1 shrink-0 text-[#1268a8]" /><p><T>Project reference, not a verified APEX delivery record.</T></p></div>
          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
            {inquiryAction("case-brief-top")}
            <Link href="#configuration-review" prefetch={false} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><ClipboardList size={18} aria-hidden="true" className="shrink-0" /><T>Configuration review</T></Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1088px] px-5 py-8 sm:py-10 lg:px-8">
        <figure className="mx-auto max-w-3xl">
          <ProjectBriefImage image={image} />
          <figcaption className="mt-3 text-xs leading-6 text-[#60717d]"><T>{image.alt}</T></figcaption>
        </figure>
        <section className="mt-8 border-t border-slate-200 pt-6" aria-labelledby="reference-scope">
          <h2 id="reference-scope" className="text-xl font-semibold leading-7 text-[#12263a]"><T>Reference scope</T></h2>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#526b7d]"><T>{entry.summary}</T></p>
          <p className="mt-3 max-w-4xl text-sm leading-7 text-[#60717d]"><T>{brief.scopeNote}</T></p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2">{entry.technicalFocus.map((focus) => <li key={focus} className="inline-flex items-start gap-2 text-sm font-semibold leading-6 text-[#385064]"><Check size={17} aria-hidden="true" className="mt-1 shrink-0 text-[#1268a8]" /><T>{focus}</T></li>)}</ul>
        </section>
      </div>

      <section id="configuration-review" className="scroll-mt-28 border-y border-slate-200 bg-[#f5f7f8] px-5 py-8 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="flex items-center gap-2 text-2xl font-semibold leading-8 text-[#12263a]"><Workflow size={22} aria-hidden="true" className="shrink-0 text-[#1268a8]" /><T>Configuration review</T></h2>
          <ol className="mt-6 grid gap-7 md:grid-cols-3">{brief.reviewSteps.map((step, index) => <li key={step.title} className="min-w-0 border-t-2 border-[#8bb3cf] pt-4">
            <span aria-hidden="true" className="text-xs font-semibold tabular-nums text-[#1268a8]">{String(index + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-base font-semibold leading-6 text-[#12263a]"><T>{step.title}</T></h3>
            <p className="mt-2 text-sm leading-7 text-[#526b7d]"><T>{step.description}</T></p>
          </li>)}</ol>
        </div>
      </section>

      <section className="px-5 py-8 sm:py-10 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 md:gap-12">
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-xl font-semibold leading-7 text-[#12263a]"><ClipboardList size={20} aria-hidden="true" className="shrink-0 text-[#1268a8]" /><T>Requirements to confirm</T></h2>
            <ul className="mt-4 divide-y divide-slate-200">{material.requirements.map((requirement) => <li key={requirement} className="py-3 text-sm leading-7 text-[#526b7d] first:pt-0"><T>{requirement}</T></li>)}</ul>
            <p className="mt-4 border-l-2 border-[#8bb3cf] pl-4 text-xs leading-6 text-[#60717d]"><T>{material.planningNote}</T></p>
          </div>
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-xl font-semibold leading-7 text-[#12263a]"><FileCheck2 size={20} aria-hidden="true" className="shrink-0 text-[#1268a8]" /><T>Records to define</T></h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-7 text-[#526b7d]">{brief.evidenceFields.map((field) => <li key={field}><T>{field}</T></li>)}</ul>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-[#f5f7f8] px-5 py-8 lg:px-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-5">
          <div className="max-w-2xl"><h2 className="text-xl font-semibold leading-7 text-[#12263a]"><T>Review this scenario with an engineer</T></h2><p className="mt-2 text-sm leading-7 text-[#526b7d]"><T>{material.reviewOutput}</T></p></div>
          {inquiryAction("case-brief-bottom")}
        </div>
      </section>

      <section className="px-5 py-8 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-semibold leading-7 text-[#12263a]"><T>Related planning materials</T></h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2">
            <Link href={`/resources/${guide.slug}`} className="flex min-w-0 items-start gap-3 border-t border-slate-200 py-4 text-[#1268a8] hover:underline"><BookOpen size={20} aria-hidden="true" className="mt-1 shrink-0" /><span className="min-w-0 flex-1 text-sm font-semibold leading-7"><T>{guide.title}</T></span><ArrowRight size={18} aria-hidden="true" className="mt-1 shrink-0" /></Link>
            <Link href={`/applications/${application.slug}`} className="flex min-w-0 items-start gap-3 border-t border-slate-200 py-4 text-[#1268a8] hover:underline"><Workflow size={20} aria-hidden="true" className="mt-1 shrink-0" /><span className="min-w-0 flex-1 text-sm font-semibold leading-7"><T>{application.title}</T></span><ArrowRight size={18} aria-hidden="true" className="mt-1 shrink-0" /></Link>
          </div>
          <nav aria-label="More project reference briefs" className="mt-6 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-semibold leading-6 text-[#385064]"><T>More scenario briefs</T></h3>
            <ul className="mt-2 flex flex-wrap gap-x-7 gap-y-1">{projectBriefs.filter((item) => item.caseSlug !== entry.slug).map((item) => <li key={item.caseSlug}><Link href={`/project-cases/${item.caseSlug}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold leading-6 text-[#1268a8] hover:underline"><span><T>{item.title}</T></span><ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link></li>)}</ul>
          </nav>
          <Link href={getEngineeringCaseIndexHref(entry.slug)} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold leading-6 text-[#526b7d] hover:text-[#1268a8] hover:underline"><ArrowLeft size={17} aria-hidden="true" className="shrink-0" /><T>Back to this reference</T></Link>
        </div>
      </section>
    </article>
  </>;
}
