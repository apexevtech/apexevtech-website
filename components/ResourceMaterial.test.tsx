import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { getResourceBrowserCategoryLabel, resourceBrowserEntries } from "@/lib/resources/browser";
import { getResourceMaterialImage } from "@/lib/resources/images";
import { projectBriefs } from "@/data/project-briefs";
import { ResourceMaterial } from "./ResourceMaterial";

vi.mock("@/components/TrackedLink", () => ({
  TrackedLink: ({ eventName, location, eventParameters, ...props }: { eventName: string; location: string; eventParameters: Record<string, string>; children: ReactNode; href: string; className: string }) => createElement("a", {
    ...props,
    "data-event-name": eventName,
    "data-event-location": location,
    "data-event-parameters": JSON.stringify(eventParameters),
  }),
}));

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("'", "&#x27;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function render(entry: (typeof resourceBrowserEntries)[number]) {
  return renderToStaticMarkup(createElement(ResourceMaterial, { entry, category: getResourceBrowserCategoryLabel(entry.categoryId) }));
}

describe("resource material gallery cards", () => {
  it("opens the three published scenario briefs without changing original planning destinations", () => {
    for (const entry of resourceBrowserEntries) {
      const html = render(entry);
      const brief = entry.kind === "scenario" ? projectBriefs.find((item) => item.materialId === entry.id) : undefined;
      if (brief && entry.kind === "scenario") {
        expect(html).toContain(`href="/project-cases/${brief.caseSlug}"`);
        expect(html).toContain("View scenario brief");
        expect(html).toContain(`href="${entry.material.relatedHref}"`);
      } else expect(html).not.toContain("View scenario brief");
    }
  });
  it("renders every material with a local uncropped image and stable gallery dimensions", () => {
    expect(resourceBrowserEntries).toHaveLength(46);
    for (const entry of resourceBrowserEntries) {
      const image = getResourceMaterialImage(entry);
      const html = render(entry);
      expect(html).toContain(`id="material-${entry.id}"`);
      expect(html).toContain(`data-material-type="${entry.kind}"`);
      expect(html).toContain(`aria-labelledby="material-${entry.id}-title"`);
      expect(html.match(/<article\b/g)).toHaveLength(1);
      expect(html.match(/<img\b/g)).toHaveLength(1);
      expect(image.src).toMatch(/^\/assets\//);
      expect(html).toContain(encodeURIComponent(image.src));
      expect(html).toContain(escape(image.alt));
      expect(html).toContain(`width="${image.width}"`);
      expect(html).toContain(`height="${image.height}"`);
      expect(html).toContain("aspect-[8/5]");
      expect(html).toContain("min-h-14 min-w-0 flex-1 line-clamp-2");
      expect(html).toContain("text-lg font-semibold leading-7 text-[#12263a]");
      expect(html).not.toContain("line-clamp-1");
      expect(html).toContain('class="h-full w-full object-contain');
      expect(html).not.toMatch(/object-cover|rounded-|shadow-|saiter\.cn|Source:|Source reference image/);
    }
  });

  it("links guide previews directly to their articles and retains the full server-rendered descriptions", () => {
    const entries = resourceBrowserEntries.filter((entry) => entry.kind === "guide");
    expect(entries).toHaveLength(22);
    for (const entry of entries) {
      const html = render(entry);
      expect(html.match(new RegExp(`href="/resources/${entry.resource.slug}"`, "g"))).toHaveLength(2);
      expect(html).toContain(`title="${escape(entry.resource.title)}"`);
      expect(html).toContain(escape(entry.resource.title));
      expect(html).toContain(escape(entry.resource.description));
      expect(html).toContain("Read the guide");
      expect(html).toContain("line-clamp-2 min-h-12");
      expect(html).not.toMatch(/<details\b|<summary\b|href="https?:/);
      expect(html).not.toContain("Planning checklist");
    }
  });

  it("keeps full planning and technical context in accessible native disclosures with tracked internal links", () => {
    const entries = resourceBrowserEntries.filter((entry) => entry.kind !== "guide");
    expect(entries).toHaveLength(24);
    for (const entry of entries) {
      const html = render(entry);
      const material = entry.material;
      expect(html).toContain(`aria-label="Material details: ${escape(material.title)}"`);
      expect(html).toContain(escape(material.title));
      expect(html).toContain(escape(material.summary));
      expect(html).toContain(escape(material.reviewOutput));
      expect(html).toContain(escape(material.planningNote));
      expect(html).toContain(escape(material.source.summary));
      expect(html).toContain(escape(material.source.scopeNote));
      for (const requirement of material.requirements) expect(html).toContain(`<li>${escape(requirement)}</li>`);
      expect(html).toContain(`href="${escape(material.relatedHref)}"`);
      expect(html).toContain(escape(material.relatedLabel));
      expect(html).toContain('data-event-name="library_material_click"');
      expect(html).toContain('data-event-location="resources"');
      expect(html).toContain(`data-event-parameters="${escape(JSON.stringify({ material_id: entry.id, material_type: entry.kind === "source" ? "solution" : "application", material_category: entry.originalCategoryId }))}"`);
      expect(html.match(/<details\b/g)).toHaveLength(3);
      expect(html.match(/<summary\b/g)).toHaveLength(3);
      expect(html).toContain("Planning checklist");
      expect(html).toContain("Technical context");
      expect(html).toContain("group-open/material:line-clamp-none");
      expect(html).not.toMatch(/<details[^>]*\bopen(?:=|\s|>)|href="https?:/);
      for (const summary of html.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/g)) expect(summary[1]).not.toMatch(/<a\b|<button\b/);
    }
  });
});
