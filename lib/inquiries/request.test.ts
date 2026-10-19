import { afterEach, describe, expect, it, vi } from "vitest";
import { requestInquiry } from "@/lib/inquiries/request";

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("inquiry request confirmation", () => {
  it("returns confirmed delivery without another request", async () => {
    const result = { ok: true, message: "Inquiry sent", leadRecorded: true };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(result)));
    vi.stubGlobal("fetch", fetchMock);
    expect((await requestInquiry({ message: "Test requirements" })).result).toEqual(result);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("preserves server validation errors and releases its timer", async () => {
    vi.useFakeTimers();
    const result = { ok: false, message: "Check your email", code: "VALIDATION_ERROR", fieldErrors: { email: "Invalid email" } };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify(result), { status: 400 })));
    const confirmation = await requestInquiry({ email: "test" });
    expect(confirmation.response.status).toBe(400);
    expect(confirmation.result).toEqual(result);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("aborts a stalled request without retrying it", async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn((_url, options: RequestInit) => new Promise((_resolve, reject) => {
      options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
    }));
    vi.stubGlobal("fetch", fetchMock);
    const result = expect(requestInquiry({ message: "Test requirements" })).rejects.toMatchObject({ name: "TimeoutError" });
    await vi.advanceTimersByTimeAsync(20_000);
    await result;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("also bounds the wait for a stalled response body", async () => {
    vi.useFakeTimers();
    vi.stubGlobal("fetch", vi.fn((_url, options: RequestInit) => Promise.resolve({
      json: () => new Promise((_resolve, reject) => {
        options.signal?.addEventListener("abort", () => reject(new DOMException("Aborted", "AbortError")));
      }),
    })));
    const result = expect(requestInquiry({})).rejects.toMatchObject({ name: "TimeoutError" });
    await vi.advanceTimersByTimeAsync(20_000);
    await result;
  });

  it("rejects an unexpected response without reporting success", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ status: "accepted" }))));
    await expect(requestInquiry({})).rejects.toThrow("Invalid inquiry response");
  });
});
