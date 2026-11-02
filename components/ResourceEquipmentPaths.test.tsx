import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { ResourceEquipmentPaths } from "@/components/ResourceEquipmentPaths";
import { TrackedLink } from "@/components/TrackedLink";

const locale = vi.hoisted(() => ({ chinese: false }));
vi.mock("@/components/LanguageProvider", async () => {
  const { messages } = await import("@/lib/i18n/zh");
  const { translateText } = await import("@/lib/i18n/translate");
  return { T: ({ children }: { children: ReactNode }) => typeof children === "string" ? translateText(children, locale.chinese ? "zh" : "en", messages) : children };
});
vi.mock("@/components/TrackedLink", () => ({
  TrackedLink: ({ href, children }: { href: string; children: ReactNode }) => <a href={href}>{children}</a>,
}));

describe("guide equipment paths", () => {
  it("attributes directory clicks to the guide and product clicks to the actual model", () => {
    type LinkProps = { href?: string; eventParameters?: Record<string, string>; children?: ReactNode };
    const links: ReactElement<LinkProps>[] = [];
    const visit = (node: ReactNode) => Children.forEach(node, (child) => {
      if (!isValidElement<LinkProps>(child)) return;
      if (child.type === TrackedLink) links.push(child);
      if (child.props.children) visit(child.props.children);
    });
    visit(ResourceEquipmentPaths({ resourceSlug: "choose-ev-charger-test-system" }));
    for (const href of ["/products?type=ac#equipment", "/products?type=dc#equipment"]) {
      const params = links.find((link) => link.props.href === href)!.props.eventParameters;
      expect(params).toEqual({ resource_slug: "choose-ev-charger-test-system" });
    }
    expect(links.find((link) => link.props.href === "/products/ast-9000")!.props.eventParameters).toEqual({ resource_slug: "choose-ev-charger-test-system", product_model: "AST-9000" });
  });

  it.each([false, true])("identifies each specification download in English and Chinese (Chinese: %s)", (chinese) => {
    locale.chinese = chinese;
    const html = renderToStaticMarkup(<ResourceEquipmentPaths resourceSlug="choose-ev-charger-test-system" />);
    for (const [href, model] of [["/downloads/st-hcac-gb-ua-ea-specifications.docx", "ST-HCAC-GB / UA / EA"], ["/downloads/st-hcdc-hpc-specifications.docx", "ST-HCDC-HPC"], ["/downloads/ast-9000-specifications.docx", "AST-9000"]]) {
      const link = html.match(new RegExp(`<a href="${href}"[^>]*>[\\s\\S]*?<\\/a>`))?.[0];
      expect(link).toContain(model);
      expect(link).toContain(chinese ? "原始规格书（Word）" : "Original specifications (Word)");
    }
  });
});
