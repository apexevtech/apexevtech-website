import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("footer contact tracking", () => {
  it("tracks WhatsApp clicks from the footer", () => {
    const source = readFileSync(join(process.cwd(), "components", "Footer.tsx"), "utf8");

    expect(source).toContain('eventName="whatsapp_click"');
    expect(source).toContain('location="footer"');
  });
});
