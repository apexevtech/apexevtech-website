import type { Metadata } from "next";
import { ApplicationCard } from "@/components/ApplicationCard";
import { PageHero } from "@/components/PageHero";
import { StructuredData } from "@/components/StructuredData";
import { applicationExamples } from "@/data/applications";
import { buildApplicationIndexStructuredData } from "@/lib/seo/application-structured-data";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { siteUrl } from "@/lib/seo/site-urls";

export const metadata: Metadata = buildPageMetadata({
  title: "EV Charger Testing Project Examples & Architectures",
  description: "Review evidence-based EV charger testing project examples for laboratories, production, mobile commissioning and PV-storage-charging integration.",
  path: "/applications",
});

export default function ApplicationsPage() {
  const itemListData = buildApplicationIndexStructuredData(applicationExamples, siteUrl);
  return <>
    <StructuredData data={itemListData} />
    <PageHero eyebrow="Applications" title="EV charger testing project examples for laboratory, factory and field work." description="Review representative configurations, execution workflows and project evidence requirements before defining a system for your charger and test plan." />
    <section className="border-b border-slate-200 bg-[#f3f8fa] px-5 py-8 lg:px-8">
      <p className="mx-auto max-w-7xl border-l-4 border-[#00a6c7] pl-5 text-sm leading-6 text-[#385064]"><strong>Scope note:</strong> These pages describe reference application architectures based on published APEX equipment capabilities. They are not named customer case studies or claims of certification, project delivery or measured customer outcomes.</p>
    </section>
    <section className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
      <div className="grid gap-8 md:grid-cols-2">{applicationExamples.map((application, index) => <ApplicationCard key={application.slug} application={application} priority={index < 2} />)}</div>
    </section>
  </>;
}
