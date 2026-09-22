import { describe, expect, it } from "vitest";
import { securityHeaders } from "@/lib/security/headers";

describe("security headers", () => {
  it("protects every page while allowing the configured analytics providers", () => {
    const headers = Object.fromEntries(securityHeaders.map(({ key, value }) => [key, value]));
    expect(headers["Strict-Transport-Security"]).toContain("includeSubDomains");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["Content-Security-Policy"]).toContain("frame-ancestors 'none'");
    expect(headers["Content-Security-Policy"]).toContain("https://www.googletagmanager.com");
    expect(headers["Content-Security-Policy"]).toContain("https://www.clarity.ms");
  });
});
