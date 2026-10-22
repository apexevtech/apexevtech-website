import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { applicationExamples } from "@/data/applications";
import { interfaceTopics } from "@/data/interface-topics";
import { resourceEquipmentPaths } from "@/data/resource-equipment";
import { resources } from "@/data/resources";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { contentMessages } from "./messages-content";
import { translateText } from "./translate";

function expectChinese(values: string[]) {
  for (const value of values) {
    expect(contentMessages[value], `Missing Chinese content: ${value}`).toMatch(/[\u3400-\u9fff]/);
  }
}

describe("public-page Chinese content", () => {
  it("covers the complete user-facing application architectures", () => {
    for (const application of applicationExamples) {
      expectChinese([
        application.title, application.category, application.description, application.summary,
        ...application.intendedFor, ...application.objectives, ...application.outputs, ...application.confirmBeforeProject,
        ...application.configuration.flatMap((item) => [item.component, item.purpose]),
        ...application.workflow.flatMap((item) => [item.step, item.detail]),
        ...application.evidencePlan.flatMap((item) => [item.evidence, item.reviewUse]),
      ]);
    }
  });

  it("covers interface scope, planning and FAQs without changing protocol names", () => {
    for (const topic of interfaceTopics) {
      expectChinese([
        topic.title, topic.description, topic.summary, ...topic.scope,
        ...topic.planningSteps.flatMap((step) => [step.title, step.detail]),
        ...topic.faqs.flatMap((faq) => [faq.question, faq.answer]),
      ]);
      expect(translateText(topic.name, "zh", contentMessages)).toBe(topic.name);
    }
  });

  it("covers guide introductions, headings and questions", () => {
    for (const resource of resources) {
      expectChinese([
        resource.title, resource.description, resource.topic, resource.summaryAnswer,
        ...resource.sections.map((section) => section.heading),
        ...resource.faqs.flatMap((faq) => [faq.question, faq.answer]),
      ]);
    }
  });

  it("covers equipment-selection paths and preserves model identifiers", () => {
    for (const equipment of Object.values(resourceEquipmentPaths)) {
      expectChinese(equipment.paths.flatMap((path) => [path.title, path.scope, path.label]));
      if (equipment.note) expectChinese([equipment.note]);
      if (equipment.inquiryLabel) expectChinese([equipment.inquiryLabel]);
    }
    expect(translateText("ST-9980EA-HPC", "zh", contentMessages)).toBe("ST-9980EA-HPC");
    expect(translateText("1000 V / 500 A", "zh", contentMessages)).toBe("1000 V / 500 A");
  });

  it("keeps server-rendered English copy and heading structure unchanged", () => {
    const html = renderToStaticMarkup(<><PageHero eyebrow="About Us" title="APEX" description="Company overview" /><SectionHeading eyebrow="Core capabilities" title="Test equipment" description="Choose a system" /></>);
    expect(html).toContain(">About Us</p>");
    expect(html).toContain(">APEX</h1>");
    expect(html).toContain(">Core capabilities</p>");
    expect(html).not.toContain("<span");
    expect(translateText("Test equipment", "en", contentMessages)).toBe("Test equipment");
    expect(translateText("Test equipment", "zh", contentMessages)).toBe("测试设备");
  });
});
