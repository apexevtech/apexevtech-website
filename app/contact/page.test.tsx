import { describe, expect, it } from "vitest";
import ContactPage from "./page";
import { company } from "@/data/site";

describe("Contact page layout", () => {
  it("keeps the contact details compact rather than stretching with the form", () => {
    const tree = ContactPage();
    const grid = tree.props.children[1].props.children;
    const aside = grid.props.children[0];
    expect(aside.type).toBe("aside");
    expect(aside.props.className).toContain("self-start");
    expect(aside.props.className).toContain("min-w-0");
    expect(aside.props.children[0].props.className).toContain("text-2xl");
    expect(grid.props.children[1].props.id).toBe("inquiry-form");
  });

  it("retains the company contact links with adequate touch targets", () => {
    const aside = ContactPage().props.children[1].props.children.props.children[0];
    const links = aside.props.children[1].props.children.slice(2);
    expect(links.map((link: { props: { href: string } }) => link.props.href)).toEqual([
      `mailto:${company.email}`,
      `tel:${company.phone.replaceAll(" ", "")}`,
    ]);
    for (const link of links) {
      expect(link.props.className).toContain("min-h-11");
      expect(link.props.className).toContain("max-w-full");
    }
  });
});
