import { Children, isValidElement, type ReactElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Footer } from "@/components/Footer";

type LinkProps = { href?: string; children?: ReactNode; target?: string; rel?: string; prefetch?: boolean; className?: string; eventName?: string; location?: string };

function linksIn(node: ReactNode): Array<ReactElement<LinkProps>> {
  if (!isValidElement<LinkProps>(node)) return [];
  return [
    ...(typeof node.props.href === "string" ? [node] : []),
    ...Children.toArray(node.props.children).flatMap(linksIn),
  ];
}

describe("Footer privacy navigation", () => {
  it("opens the policy separately without interrupting a draft", () => {
    const links = linksIn(Footer());
    const policy = links.find((link) => link.props.href === "/privacy-policy");
    expect(policy?.props).toMatchObject({
      target: "_blank",
      rel: "noopener noreferrer",
      prefetch: false,
    });
    expect(policy?.props.className).toContain("min-h-11");
    const html = renderToStaticMarkup(policy);
    expect(html).toContain('aria-hidden="true">Privacy Policy</span>');
    expect(html).toContain('class="sr-only">Privacy Policy (opens in a new tab)</span>');
    expect(html).toContain("lucide-external-link");
  });

  it("keeps ordinary footer navigation in the current tab", () => {
    const links = linksIn(Footer()).filter((link) => link.props.href?.startsWith("/") && link.props.href !== "/privacy-policy");
    expect(links.length).toBeGreaterThan(3);
    for (const link of links) expect(link.props.target).toBeUndefined();
  });

  it("retains WhatsApp contact tracking in the footer", () => {
    const whatsapp = linksIn(Footer()).find((link) => link.props.href?.startsWith("https://api.whatsapp.com/"));
    expect(whatsapp?.props).toMatchObject({ eventName: "whatsapp_click", location: "footer", target: "_blank", rel: "noopener noreferrer" });
  });

  it("keeps a single combined Project Cases entry without legacy resource entries", () => {
    const hrefs = linksIn(Footer()).map((link) => link.props.href);
    expect(hrefs.filter((href) => href === "/project-cases")).toHaveLength(1);
    expect(hrefs).not.toContain("/engineering-cases");
    expect(hrefs).not.toContain("/resources");
    expect(hrefs).toContain("/contact");
    expect(renderToStaticMarkup(Footer())).toContain(">Project Cases</a>");
  });
});
