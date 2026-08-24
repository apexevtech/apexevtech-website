type RateLimitOptions = {
  maxAttempts: number;
  windowMs: number;
};

type Entry = {
  count: number;
  startedAt: number;
};

export function createRateLimiter(options: RateLimitOptions) {
  const entries = new Map<string, Entry>();

  return {
    isLimited(key: string, now = Date.now()): boolean {
      const current = entries.get(key);
      if (!current || now - current.startedAt >= options.windowMs) {
        entries.set(key, { count: 1, startedAt: now });
        return false;
      }

      current.count += 1;
      return current.count > options.maxAttempts;
    },
    clear() {
      entries.clear();
    },
  };
}

export const inquiryRateLimiter = createRateLimiter({ maxAttempts: 5, windowMs: 10 * 60 * 1_000 });
