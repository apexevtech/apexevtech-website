import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactNode } from "react";
import { engineeringCases } from "@/data/engineering-cases";
import { projectBriefs } from "@/data/project-briefs";
import { getProjectBrief } from "@/lib/engineering-cases/briefs";
import { engineeringCaseDetailSlugs, getEngineeringCaseIndexHref, getEngineeringCaseMaterialDetailHref } from "@/lib/engineering-cases/detail-path";
import { buildReferenceCaseInquiryHref } from "@/lib/inquiries/reference-case";
import Page, { generateMetadata, generateStaticParams } from "@/app/(en)/project-cases/[slug]/page";

const locale = vi.hoisted(() => ({ chinese: false }));
vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  const t = (text: string) => translateText(text, locale.chinese ? "zh" : "en", messages);
  return { T: ({ children }: { children: ReactNode }) => typeof children === "string" ? t(children) : children, useLanguage: () => ({ t }) };
});

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const paramsFor = (slug: string) => ({ params: Promise.resolve({ slug }) });

describe("project reference brief pages", () => {
  beforeEach(() => { locale.chinese = false; });

  it("prerenders exactly three briefs and rejects other references rather than inventing detail pages", async () => {
    expect(generateStaticParams()).toEqual(engineeringCaseDetailSlugs.map((slug) => ({ slug })));
    for (const slug of [...engineeringCases.map((entry) => entry.slug).filter((slug) => !engineeringCaseDetailSlugs.some((item) => item === slug)), "unknown", "__proto__"]) {
      expect(getProjectBrief(slug)).toBeUndefined();
      expect(await generateMetadata(paramsFor(slug))).toEqual({});
      await expect(Page(paramsFor(slug))).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
    }
  });

  it.each(projectBriefs)("retains the honest reference and complete planning content for $caseSlug", async (brief) => {
    const reference = getProjectBrief(brief.caseSlug)!;
    const html = renderToStaticMarkup(await Page(paramsFor(brief.caseSlug)));
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(escape(brief.title));
    for (const text of [brief.objective, brief.scopeNote, reference.entry.summary, ...reference.entry.technicalFocus, ...brief.evidenceFields, ...reference.material.requirements, reference.material.reviewOutput, reference.material.planningNote, ...brief.reviewSteps.flatMap((step) => [step.title, step.description])]) {
      expect(html).toContain(escape(text));
    }
    expect(html).toContain("Project reference, not a verified APEX delivery record.");
    expect(html.indexOf("Project reference, not a verified APEX delivery record.")).toBeLessThan(html.indexOf("<figure"));
    expect(html).toContain(`href="${escape(buildReferenceCaseInquiryHref(brief.caseSlug, "detail"))}"`);
    expect(html).toContain(`href="${escape(getEngineeringCaseIndexHref(brief.caseSlug))}"`);
    expect(html).toContain(`href="/resources/${reference.entry.relatedResourceSlug}"`);
    expect(html).toContain(`href="/applications/${reference.application.slug}"`);
    expect(getEngineeringCaseMaterialDetailHref(brief.materialId)).toBe(`/project-cases/${brief.caseSlug}`);
    expect(html).toContain(encodeURIComponent(reference.image.src));
    expect(html).toContain('class="h-auto w-full object-contain"');
    expect(html.match(/id="configuration-review"/g)).toHaveLength(1);
    expect(html).not.toMatch(/<form\b|href="https?:|object-cover|scale-|"@type":"(?:Review|Product|Event)"/);
    for (const related of projectBriefs.filter((item) => item.caseSlug !== brief.caseSlug)) {
      expect(html).toContain(`href="/project-cases/${related.caseSlug}"`);
    }
    const breadcrumb = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)![1]);
    expect(breadcrumb["@type"]).toBe("BreadcrumbList");
    expect(breadcrumb.itemListElement[2].item).toBe(`https://www.link-jl.com/project-cases/${brief.caseSlug}`);
  });

  it("provides unique metadata and self-canonicals without claiming completed project results", async () => {
    const titles = [];
    const descriptions = [];
    for (const brief of projectBriefs) {
      const metadata = await generateMetadata(paramsFor(brief.caseSlug));
      expect(metadata.title).toBe(brief.title);
      expect(metadata.description).toBe(brief.description);
      expect(metadata.alternates?.canonical).toBe(`/project-cases/${brief.caseSlug}`);
      expect(metadata.openGraph).toMatchObject({ type: "website", images: [getProjectBrief(brief.caseSlug)!.image.src] });
      titles.push(metadata.title);
      descriptions.push(metadata.description);
    }
    expect(new Set(titles).size).toBe(3);
    expect(new Set(descriptions).size).toBe(3);
  });

  it("localizes all visible brief content and section controls without changing canonical destinations", async () => {
    locale.chinese = true;
    const { messages } = await import("@/lib/i18n/zh");
    for (const brief of projectBriefs) {
      const html = renderToStaticMarkup(await Page(paramsFor(brief.caseSlug)));
      const reference = getProjectBrief(brief.caseSlug)!;
      expect(html).toContain(`alt="${escape(messages[reference.image.alt])}"`);
      for (const text of [brief.title, brief.objective, brief.scopeNote, ...brief.reviewSteps.flatMap((step) => [step.title, step.description]), ...brief.evidenceFields, ...reference.material.requirements, reference.material.reviewOutput, reference.material.planningNote]) {
        expect(messages[text], text).toMatch(/[\u3400-\u9fff]/);
        expect(html).toContain(escape(messages[text]));
      }
      for (const text of ["Project reference brief", "Project reference, not a verified APEX delivery record.", "Configuration review", "Reference scope", "Records to define", "Review this scenario with an engineer", "Related planning materials", "More scenario briefs", "Back to this reference"]) {
        expect(messages[text], text).toMatch(/[\u3400-\u9fff]/);
        expect(html).toContain(escape(messages[text]));
      }
      expect(html).toContain("咨询类似配置");
      expect(html).toContain(`href="${escape(buildReferenceCaseInquiryHref(brief.caseSlug, "detail"))}"`);
    }
  });
});
