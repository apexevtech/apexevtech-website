import { describe, expect, it } from "vitest";
import { createRateLimiter } from "@/lib/inquiries/rate-limit";

describe("createRateLimiter", () => {
  it("allows the configured number of attempts and blocks the next one", () => {
    const limiter = createRateLimiter({ maxAttempts: 2, windowMs: 60_000 });

    expect(limiter.isLimited("198.51.100.10")).toBe(false);
    expect(limiter.isLimited("198.51.100.10")).toBe(false);
    expect(limiter.isLimited("198.51.100.10")).toBe(true);
    expect(limiter.isLimited("198.51.100.11")).toBe(false);
  });
});
