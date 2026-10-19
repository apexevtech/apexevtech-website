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

  it("allows analytics follow-up requests without opening unrelated Google endpoints", () => {
    const policy = securityHeaders.find(({ key }) => key === "Content-Security-Policy")!.value;
    const directives = Object.fromEntries(policy.split("; ").map((directive) => {
      const [name, ...sources] = directive.split(" ");
      return [name, sources];
    }));

    expect(directives["script-src"]).toContain("https://scripts.clarity.ms");
    expect(directives["connect-src"]).toContain("https://www.google.com/g/collect");
    expect(directives["connect-src"]).not.toContain("https://www.google.com");
    expect(directives["script-src"]).not.toContain("https://*.google.com");
    expect(directives["script-src"]).not.toContain("'unsafe-eval'");
    expect(directives["object-src"]).toEqual(["'none'"]);
  });
});
