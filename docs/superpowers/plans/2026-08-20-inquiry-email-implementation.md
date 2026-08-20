# 询价邮件发送实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将联系页和产品详情页的询价表单接入 Resend，使有效询价真实发送到 `gu@apexps-nj.com`，并提供安全校验、反垃圾处理和完整的界面反馈。

**Architecture:** 浏览器只向站内 `POST /api/inquiries` 发送 JSON。纯函数模块负责输入校验和邮件正文构建，服务端发送适配器负责读取环境变量并调用 Resend，API 路由只负责编排和状态码映射。共用 React 表单组件复用同一套校验规则，并根据联系页或产品页传入来源上下文。

**Tech Stack:** Next.js 15 App Router、React 19、TypeScript、Resend、Vitest、Testing Library、jsdom、Tailwind CSS。

---

## 文件结构

- Create: `vitest.config.ts`：Vitest、jsdom 和 `@` 路径别名配置。
- Create: `tests/setup.ts`：加载 Testing Library 的 DOM 断言。
- Create: `lib/inquiries/types.ts`：询价字段、校验结果和 API 响应类型。
- Create: `lib/inquiries/validation.ts`：纯函数输入标准化和校验。
- Create: `lib/inquiries/validation.test.ts`：输入校验测试。
- Create: `lib/inquiries/email.ts`：安全构建纯文本和 HTML 邮件。
- Create: `lib/inquiries/email.test.ts`：邮件构建和转义测试。
- Create: `lib/inquiries/delivery.ts`：Resend 发送适配器和环境配置检查。
- Create: `lib/inquiries/delivery.test.ts`：发送成功、失败和缺少配置测试。
- Create: `app/api/inquiries/route.ts`：公开的询价 POST 接口。
- Create: `app/api/inquiries/route.test.ts`：接口状态码和编排测试。
- Modify: `components/InquiryForm.tsx`：真实提交、字段错误和状态反馈。
- Create: `components/InquiryForm.test.tsx`：客户端交互测试。
- Modify: `app/contact/page.tsx`：传入通用询价上下文。
- Modify: `app/products/[slug]/page.tsx`：传入产品型号上下文。
- Modify: `.gitignore`：允许提交不含凭据的 `.env.example`。
- Create: `.env.example`：列出不含真实凭据的 Resend 配置。
- Modify: `README.md`：说明本地和 Vercel 配置流程。
- Modify: `package.json`、`package-lock.json`：增加依赖和测试命令。

### Task 1: 建立测试和 Resend 依赖

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: 安装运行时和测试依赖**

Run:

```bash
npm install resend
npm install --save-dev vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

Expected: 命令退出码为 `0`，`package-lock.json` 更新，`resend` 位于 `dependencies`，其余包位于 `devDependencies`。

- [ ] **Step 2: 增加测试命令**

在 `package.json` 的 `scripts` 中加入：

```json
{
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: 创建 Vitest 配置**

Create `vitest.config.ts`:

```ts
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL(".", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    environmentOptions: {
      jsdom: { pretendToBeVisual: true },
    },
    setupFiles: ["./tests/setup.ts"],
    clearMocks: true,
  },
});
```

Create `tests/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 4: 运行空测试套件确认工具可启动**

Run: `npm test -- --passWithNoTests`

Expected: Vitest 退出码为 `0`，输出中没有配置或模块解析错误。

- [ ] **Step 5: 提交测试工具链**

```bash
git add package.json package-lock.json vitest.config.ts tests/setup.ts
git commit -m "test: add inquiry form test tooling"
```

### Task 2: 实现询价输入校验

**Files:**
- Create: `lib/inquiries/types.ts`
- Create: `lib/inquiries/validation.ts`
- Create: `lib/inquiries/validation.test.ts`

- [ ] **Step 1: 编写失败的校验测试**

Create `lib/inquiries/validation.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { parseInquiry } from "@/lib/inquiries/validation";

const validInput = {
  name: "  Ada Lovelace  ",
  email: "  ada@example.com  ",
  phone: " +44 20 0000 0000 ",
  company: " Analytical Engines ",
  country: " United Kingdom ",
  message: "  Please quote the ST-9980A+ Pro system.  ",
  context: " ST-9980A+ Pro ",
  privacyAccepted: true,
  website: "",
};

describe("parseInquiry", () => {
  it("normalizes a valid inquiry", () => {
    expect(parseInquiry(validInput)).toEqual({
      ok: true,
      isBot: false,
      value: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "+44 20 0000 0000",
        company: "Analytical Engines",
        country: "United Kingdom",
        message: "Please quote the ST-9980A+ Pro system.",
        context: "ST-9980A+ Pro",
        privacyAccepted: true,
      },
    });
  });

  it("returns field errors for invalid required fields", () => {
    const result = parseInquiry({
      ...validInput,
      name: "A",
      email: "not-an-email",
      message: "short",
      privacyAccepted: false,
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.fieldErrors).toMatchObject({
        name: expect.any(String),
        email: expect.any(String),
        message: expect.any(String),
        privacyAccepted: expect.any(String),
      });
    }
  });

  it("marks a populated honeypot as a bot before validating other fields", () => {
    expect(parseInquiry({ website: "https://spam.test" })).toEqual({ ok: true, isBot: true });
  });

  it("rejects non-object input and oversized fields", () => {
    expect(parseInquiry(null).ok).toBe(false);
    const result = parseInquiry({ ...validInput, message: "x".repeat(5001) });
    expect(result.ok).toBe(false);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- lib/inquiries/validation.test.ts`

Expected: FAIL，错误指出 `@/lib/inquiries/validation` 不存在。

- [ ] **Step 3: 定义类型**

Create `lib/inquiries/types.ts`:

```ts
export type InquiryField =
  | "name"
  | "email"
  | "phone"
  | "company"
  | "country"
  | "message"
  | "context"
  | "privacyAccepted"
  | "website";

export type InquirySubmission = {
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  message: string;
  context: string;
  privacyAccepted: true;
};

export type InquiryFieldErrors = Partial<Record<InquiryField | "form", string>>;

export type InquiryParseResult =
  | { ok: true; isBot: true }
  | { ok: true; isBot: false; value: InquirySubmission }
  | { ok: false; fieldErrors: InquiryFieldErrors };

export type InquiryApiResponse =
  | { ok: true; message: string }
  | {
      ok: false;
      code: "INVALID_REQUEST" | "VALIDATION_ERROR" | "EMAIL_NOT_CONFIGURED" | "EMAIL_DELIVERY_FAILED";
      message: string;
      fieldErrors?: InquiryFieldErrors;
    };
```

- [ ] **Step 4: 实现最小校验逻辑**

Create `lib/inquiries/validation.ts`:

```ts
import type { InquiryFieldErrors, InquiryParseResult } from "@/lib/inquiries/types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function recordOf(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseInquiry(input: unknown): InquiryParseResult {
  if (!recordOf(input)) {
    return { ok: false, fieldErrors: { form: "Enter your inquiry details." } };
  }

  const name = text(input.name);
  const email = text(input.email);
  const phone = text(input.phone);
  const company = text(input.company);
  const country = text(input.country);
  const message = text(input.message);
  const context = text(input.context);
  const website = text(input.website);
  const privacyAccepted = input.privacyAccepted === true;
  const fieldErrors: InquiryFieldErrors = {};

  if (website) return { ok: true, isBot: true };

  if (name.length < 2 || name.length > 100) fieldErrors.name = "Enter a name between 2 and 100 characters.";
  if (email.length > 254 || !EMAIL_PATTERN.test(email)) fieldErrors.email = "Enter a valid email address.";
  if (phone.length > 50) fieldErrors.phone = "Phone or WhatsApp number must be 50 characters or fewer.";
  if (company.length > 120) fieldErrors.company = "Company must be 120 characters or fewer.";
  if (country.length > 100) fieldErrors.country = "Country must be 100 characters or fewer.";
  if (message.length < 10 || message.length > 5000) fieldErrors.message = "Enter a message between 10 and 5,000 characters.";
  if (!context || context.length > 120) fieldErrors.context = "Inquiry context is missing or too long.";
  if (!privacyAccepted) fieldErrors.privacyAccepted = "Confirm the privacy policy before sending.";
  if (typeof input.website !== "string" || website.length > 200) fieldErrors.website = "Invalid submission.";

  if (Object.keys(fieldErrors).length > 0) return { ok: false, fieldErrors };

  return {
    ok: true,
    isBot: false,
    value: { name, email, phone, company, country, message, context, privacyAccepted: true },
  };
}
```

- [ ] **Step 5: 运行校验测试确认通过**

Run: `npm test -- lib/inquiries/validation.test.ts`

Expected: 4 tests PASS。

- [ ] **Step 6: 提交校验模块**

```bash
git add lib/inquiries/types.ts lib/inquiries/validation.ts lib/inquiries/validation.test.ts
git commit -m "feat: validate inquiry submissions"
```

### Task 3: 安全构建邮件内容

**Files:**
- Create: `lib/inquiries/email.ts`
- Create: `lib/inquiries/email.test.ts`

- [ ] **Step 1: 编写失败的邮件格式测试**

Create `lib/inquiries/email.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { buildInquiryEmail } from "@/lib/inquiries/email";
import type { InquirySubmission } from "@/lib/inquiries/types";

const inquiry: InquirySubmission = {
  name: "Ada <Admin>",
  email: "ada@example.com",
  phone: "+44 20 0000 0000",
  company: "A & B",
  country: "United Kingdom",
  message: "Need <script>alert('x')</script> pricing.",
  context: "ST-9980A+ Pro\nInjected",
  privacyAccepted: true,
};

describe("buildInquiryEmail", () => {
  it("builds plain-text and escaped HTML bodies", () => {
    const result = buildInquiryEmail(inquiry, new Date("2026-08-20T02:00:00.000Z"));
    expect(result.subject).toBe("Website inquiry: ST-9980A+ Pro Injected - Ada <Admin>");
    expect(result.text).toContain("Need <script>alert('x')</script> pricing.");
    expect(result.html).toContain("Ada &lt;Admin&gt;");
    expect(result.html).toContain("A &amp; B");
    expect(result.html).not.toContain("<script>");
    expect(result.text).toContain("2026-08-20T02:00:00.000Z");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- lib/inquiries/email.test.ts`

Expected: FAIL，错误指出 `@/lib/inquiries/email` 不存在。

- [ ] **Step 3: 实现邮件构建器**

Create `lib/inquiries/email.ts`:

```ts
import type { InquirySubmission } from "@/lib/inquiries/types";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function subjectText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function buildInquiryEmail(inquiry: InquirySubmission, submittedAt = new Date()) {
  const fields = [
    ["Context", inquiry.context],
    ["Submitted", submittedAt.toISOString()],
    ["Name", inquiry.name],
    ["Email", inquiry.email],
    ["Phone / WhatsApp", inquiry.phone || "Not provided"],
    ["Company", inquiry.company || "Not provided"],
    ["Country", inquiry.country || "Not provided"],
    ["Project requirements", inquiry.message],
  ] as const;

  const textBody = fields.map(([label, value]) => `${label}: ${value}`).join("\n\n");
  const htmlRows = fields
    .map(
      ([label, value]) =>
        `<tr><th style="padding:8px;text-align:left;vertical-align:top">${escapeHtml(label)}</th><td style="padding:8px;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("");

  return {
    subject: `Website inquiry: ${subjectText(inquiry.context)} - ${subjectText(inquiry.name)}`,
    text: textBody,
    html: `<h1>New website inquiry</h1><table style="border-collapse:collapse">${htmlRows}</table>`,
  };
}
```

- [ ] **Step 4: 运行邮件测试确认通过**

Run: `npm test -- lib/inquiries/email.test.ts`

Expected: 1 test PASS。

- [ ] **Step 5: 提交邮件构建器**

```bash
git add lib/inquiries/email.ts lib/inquiries/email.test.ts
git commit -m "feat: build safe inquiry emails"
```

### Task 4: 实现 Resend 适配器和 API 路由

**Files:**
- Create: `lib/inquiries/delivery.ts`
- Create: `lib/inquiries/delivery.test.ts`
- Create: `app/api/inquiries/route.ts`
- Create: `app/api/inquiries/route.test.ts`

- [ ] **Step 1: 编写失败的发送适配器测试**

Create `lib/inquiries/delivery.test.ts`:

```ts
import { describe, expect, it, vi } from "vitest";
import { deliverInquiry } from "@/lib/inquiries/delivery";
import type { InquirySubmission } from "@/lib/inquiries/types";

const inquiry: InquirySubmission = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "",
  company: "Analytical Engines",
  country: "United Kingdom",
  message: "Please send pricing and lead time.",
  context: "General inquiry",
  privacyAccepted: true,
};

describe("deliverInquiry", () => {
  it("returns a configuration error without required environment values", async () => {
    await expect(deliverInquiry(inquiry, {}, vi.fn())).resolves.toEqual({
      ok: false,
      code: "EMAIL_NOT_CONFIGURED",
    });
  });

  it("sends to the configured recipient with visitor reply-to", async () => {
    const send = vi.fn().mockResolvedValue({ data: { id: "email_123" }, error: null, headers: null });
    const factory = vi.fn(() => ({ send }));
    const result = await deliverInquiry(
      inquiry,
      {
        RESEND_API_KEY: "test_key",
        INQUIRY_FROM_EMAIL: "APEX Website <inquiries@example.com>",
        INQUIRY_TO_EMAIL: "sales@example.com",
      },
      factory,
    );

    expect(result).toEqual({ ok: true, id: "email_123" });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({
      from: "APEX Website <inquiries@example.com>",
      to: ["sales@example.com"],
      replyTo: "ada@example.com",
    }));
  });

  it("maps provider errors and thrown errors to delivery failure", async () => {
    const providerFailure = vi.fn(() => ({
      send: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "rejected", name: "application_error", statusCode: 500 },
        headers: null,
      }),
    }));
    await expect(deliverInquiry(inquiry, {
      RESEND_API_KEY: "test_key",
      INQUIRY_FROM_EMAIL: "inquiries@example.com",
    }, providerFailure)).resolves.toEqual({ ok: false, code: "EMAIL_DELIVERY_FAILED" });

    const thrownFailure = vi.fn(() => ({ send: vi.fn().mockRejectedValue(new Error("network")) }));
    await expect(deliverInquiry(inquiry, {
      RESEND_API_KEY: "test_key",
      INQUIRY_FROM_EMAIL: "inquiries@example.com",
    }, thrownFailure)).resolves.toEqual({ ok: false, code: "EMAIL_DELIVERY_FAILED" });
  });
});
```

- [ ] **Step 2: 运行适配器测试确认失败**

Run: `npm test -- lib/inquiries/delivery.test.ts`

Expected: FAIL，错误指出 `@/lib/inquiries/delivery` 不存在。

- [ ] **Step 3: 实现 Resend 发送适配器**

Create `lib/inquiries/delivery.ts`:

```ts
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend";
import { buildInquiryEmail } from "@/lib/inquiries/email";
import type { InquirySubmission } from "@/lib/inquiries/types";

type DeliveryEnvironment = Partial<Record<"RESEND_API_KEY" | "INQUIRY_FROM_EMAIL" | "INQUIRY_TO_EMAIL", string>>;
type SendResult = { data: { id: string } | null; error: unknown };
type EmailSender = { send: (message: CreateEmailOptions) => Promise<SendResult> };
type SenderFactory = (apiKey: string) => EmailSender;

const defaultFactory: SenderFactory = (apiKey) => new Resend(apiKey).emails;

export async function deliverInquiry(
  inquiry: InquirySubmission,
  environment: DeliveryEnvironment = process.env,
  senderFactory: SenderFactory = defaultFactory,
) {
  const apiKey = environment.RESEND_API_KEY?.trim();
  const from = environment.INQUIRY_FROM_EMAIL?.trim();
  const to = environment.INQUIRY_TO_EMAIL?.trim() || "gu@apexps-nj.com";

  if (!apiKey || !from) return { ok: false as const, code: "EMAIL_NOT_CONFIGURED" as const };

  const content = buildInquiryEmail(inquiry);
  try {
    const { data, error } = await senderFactory(apiKey).send({
      from,
      to: [to],
      replyTo: inquiry.email,
      subject: content.subject,
      text: content.text,
      html: content.html,
    });
    if (error || !data?.id) return { ok: false as const, code: "EMAIL_DELIVERY_FAILED" as const };
    return { ok: true as const, id: data.id };
  } catch {
    return { ok: false as const, code: "EMAIL_DELIVERY_FAILED" as const };
  }
}
```

- [ ] **Step 4: 运行适配器测试确认通过**

Run: `npm test -- lib/inquiries/delivery.test.ts`

Expected: 3 tests PASS。

- [ ] **Step 5: 编写失败的 API 路由测试**

Create `app/api/inquiries/route.test.ts`:

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/inquiries/route";
import { deliverInquiry } from "@/lib/inquiries/delivery";

vi.mock("@/lib/inquiries/delivery", () => ({ deliverInquiry: vi.fn() }));
const deliver = vi.mocked(deliverInquiry);
const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  phone: "",
  company: "Analytical Engines",
  country: "United Kingdom",
  message: "Please send pricing and lead time.",
  context: "General inquiry",
  privacyAccepted: true,
  website: "",
};

function request(body: unknown, contentType = "application/json") {
  return new Request("http://localhost/api/inquiries", {
    method: "POST",
    headers: { "content-type": contentType },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

describe("POST /api/inquiries", () => {
  beforeEach(() => {
    deliver.mockReset();
    vi.spyOn(console, "info").mockImplementation(() => undefined);
  });
  afterEach(() => vi.restoreAllMocks());

  it("rejects wrong content types, malformed JSON, and invalid fields", async () => {
    expect((await POST(request(valid, "text/plain"))).status).toBe(400);
    expect((await POST(request("{"))).status).toBe(400);
    expect((await POST(request({ ...valid, email: "bad" }))).status).toBe(400);
    expect((await POST(request({ ...valid, ignored: "x".repeat(17_000) }))).status).toBe(400);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without delivery", async () => {
    const response = await POST(request({ ...valid, website: "spam" }));
    expect(response.status).toBe(200);
    expect(deliver).not.toHaveBeenCalled();
  });

  it("returns success after delivery", async () => {
    deliver.mockResolvedValue({ ok: true, id: "email_123" });
    const response = await POST(request(valid));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true, message: "Your inquiry has been sent." });
  });

  it("logs only the outcome and duration", async () => {
    const log = vi.mocked(console.info);
    await POST(request({ ...valid, email: "bad" }));
    expect(log).toHaveBeenLastCalledWith("Inquiry request", {
      result: "VALIDATION_ERROR",
      durationMs: expect.any(Number),
    });
    expect(JSON.stringify(log.mock.calls)).not.toContain(valid.message);
    expect(JSON.stringify(log.mock.calls)).not.toContain(valid.email);
  });

  it.each([
    ["EMAIL_NOT_CONFIGURED", 503],
    ["EMAIL_DELIVERY_FAILED", 502],
  ] as const)("maps %s to HTTP %i", async (code, status) => {
    deliver.mockResolvedValue({ ok: false, code });
    const response = await POST(request(valid));
    expect(response.status).toBe(status);
    expect((await response.json()).code).toBe(code);
  });
});
```

- [ ] **Step 6: 运行路由测试确认失败**

Run: `npm test -- app/api/inquiries/route.test.ts`

Expected: FAIL，错误指出 `@/app/api/inquiries/route` 不存在。

- [ ] **Step 7: 实现 API 路由**

Create `app/api/inquiries/route.ts`:

```ts
import { NextResponse } from "next/server";
import { deliverInquiry } from "@/lib/inquiries/delivery";
import type { InquiryApiResponse } from "@/lib/inquiries/types";
import { parseInquiry } from "@/lib/inquiries/validation";

const MAX_REQUEST_BYTES = 16_384;

function json(body: InquiryApiResponse, status: number, startedAt: number, result: string) {
  console.info("Inquiry request", {
    result,
    durationMs: Math.round(performance.now() - startedAt),
  });
  return NextResponse.json(body, { status });
}

async function readLimitedBody(request: Request): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const decoder = new TextDecoder();
  let size = 0;
  let body = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > MAX_REQUEST_BYTES) {
      await reader.cancel();
      return null;
    }
    body += decoder.decode(value, { stream: true });
  }

  return body + decoder.decode();
}

export async function POST(request: Request) {
  const startedAt = performance.now();
  const mediaType = request.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (mediaType !== "application/json") {
    return json({ ok: false, code: "INVALID_REQUEST", message: "Send the inquiry as JSON." }, 400, startedAt, "INVALID_REQUEST");
  }

  let rawBody: string | null;
  try {
    rawBody = await readLimitedBody(request);
  } catch {
    return json({ ok: false, code: "INVALID_REQUEST", message: "The inquiry request is invalid." }, 400, startedAt, "INVALID_REQUEST");
  }

  if (rawBody === null) {
    return json({ ok: false, code: "INVALID_REQUEST", message: "The inquiry request is too large." }, 400, startedAt, "INVALID_REQUEST");
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return json({ ok: false, code: "INVALID_REQUEST", message: "The inquiry request is invalid." }, 400, startedAt, "INVALID_REQUEST");
  }

  const parsed = parseInquiry(input);
  if (!parsed.ok) {
    return json({
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Please correct the highlighted fields.",
      fieldErrors: parsed.fieldErrors,
    }, 400, startedAt, "VALIDATION_ERROR");
  }

  if (parsed.isBot) return json({ ok: true, message: "Your inquiry has been sent." }, 200, startedAt, "BOT_IGNORED");

  const delivery = await deliverInquiry(parsed.value);
  if (!delivery.ok && delivery.code === "EMAIL_NOT_CONFIGURED") {
    return json({ ok: false, code: delivery.code, message: "Email delivery is not configured yet." }, 503, startedAt, delivery.code);
  }
  if (!delivery.ok) {
    return json({ ok: false, code: delivery.code, message: "We could not send your inquiry. Please try again." }, 502, startedAt, delivery.code);
  }
  return json({ ok: true, message: "Your inquiry has been sent." }, 200, startedAt, "SUCCESS");
}
```

- [ ] **Step 8: 运行适配器和路由测试**

Run: `npm test -- lib/inquiries/delivery.test.ts app/api/inquiries/route.test.ts`

Expected: 9 tests PASS。

- [ ] **Step 9: 提交服务端邮件接口**

```bash
git add lib/inquiries/delivery.ts lib/inquiries/delivery.test.ts app/api/inquiries/route.ts app/api/inquiries/route.test.ts
git commit -m "feat: send inquiries through Resend"
```

### Task 5: 实现表单交互和无障碍反馈

**Files:**
- Modify: `components/InquiryForm.tsx`
- Create: `components/InquiryForm.test.tsx`
- Modify: `app/contact/page.tsx`
- Modify: `app/products/[slug]/page.tsx`

- [ ] **Step 1: 编写失败的表单交互测试**

Create `components/InquiryForm.test.tsx`:

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { InquiryForm } from "@/components/InquiryForm";

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Name"), "Ada Lovelace");
  await user.type(screen.getByLabelText("Work Email"), "ada@example.com");
  await user.type(screen.getByLabelText("Project Requirements"), "Please send pricing and lead time.");
  await user.click(screen.getByLabelText(/privacy policy/i));
}

describe("InquiryForm", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("submits the page context and clears fields after success", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: "Your inquiry has been sent." }),
    });
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<InquiryForm context="ST-9980A+ Pro" />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [, options] = fetchMock.mock.calls[0];
    expect(JSON.parse(String(options.body))).toMatchObject({ context: "ST-9980A+ Pro" });
    expect(await screen.findByText("Your inquiry has been sent.")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("");
  });

  it("shows client validation errors without sending", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<InquiryForm context="General inquiry" />);
    await user.click(screen.getByRole("button", { name: "Submit Inquiry" }));
    expect(await screen.findByText(/name between 2 and 100/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByLabelText("Name")).toHaveFocus());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("disables submission and ignores duplicate clicks while delivery is pending", async () => {
    let resolveFetch!: (response: {
      ok: boolean;
      json: () => Promise<{ ok: true; message: string }>;
    }) => void;
    const fetchMock = vi.fn().mockReturnValue(new Promise((resolve) => { resolveFetch = resolve; }));
    vi.stubGlobal("fetch", fetchMock);
    const user = userEvent.setup();
    render(<InquiryForm context="General inquiry" />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit Inquiry" }));

    const pendingButton = await screen.findByRole("button", { name: "Sending..." });
    expect(pendingButton).toBeDisabled();
    await user.click(pendingButton);
    expect(fetchMock).toHaveBeenCalledOnce();

    resolveFetch({
      ok: true,
      json: async () => ({ ok: true, message: "Your inquiry has been sent." }),
    });
    expect(await screen.findByText("Your inquiry has been sent.")).toBeInTheDocument();
  });

  it("preserves values and shows a retryable delivery error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ ok: false, code: "EMAIL_DELIVERY_FAILED", message: "We could not send your inquiry. Please try again." }),
    }));
    const user = userEvent.setup();
    render(<InquiryForm context="General inquiry" />);
    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: "Submit Inquiry" }));
    expect(await screen.findByText(/could not send/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace");
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npm test -- components/InquiryForm.test.tsx`

Expected: FAIL，因为现有组件不接收 `context`，也没有提交和状态逻辑。

- [ ] **Step 3: 实现表单组件**

Replace `components/InquiryForm.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import type { InquiryApiResponse, InquiryField, InquiryFieldErrors } from "@/lib/inquiries/types";
import { parseInquiry } from "@/lib/inquiries/validation";

type InquiryFormProps = { compact?: boolean; context: string };
type SubmitState = "idle" | "pending" | "success" | "error";

function focusFirstError(form: HTMLFormElement, fieldErrors: InquiryFieldErrors) {
  const first = Object.keys(fieldErrors).find((field) => field !== "form");
  if (!first) return;
  requestAnimationFrame(() => {
    (form.elements.namedItem(first) as HTMLElement | null)?.focus();
  });
}

export function InquiryForm({ compact = false, context }: InquiryFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<SubmitState>("idle");
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<InquiryFieldErrors>({});

  function errorFor(field: InquiryField) {
    const message = errors[field];
    return message ? <span id={`${field}-error`} className="text-sm font-medium text-red-700">{message}</span> : null;
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "pending") return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const payload = {
      name: values.get("name"),
      email: values.get("email"),
      phone: values.get("phone"),
      company: values.get("company"),
      country: values.get("country"),
      message: values.get("message"),
      website: values.get("website"),
      privacyAccepted: values.get("privacyAccepted") === "on",
      context,
    };
    const parsed = parseInquiry(payload);
    if (!parsed.ok) {
      setErrors(parsed.fieldErrors);
      setState("error");
      setNotice("Please correct the highlighted fields.");
      focusFirstError(form, parsed.fieldErrors);
      return;
    }
    if (parsed.isBot) {
      formRef.current?.reset();
      setErrors({});
      setState("success");
      setNotice("Your inquiry has been sent.");
      return;
    }

    setErrors({});
    setState("pending");
    setNotice("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...parsed.value, website: String(payload.website ?? "") }),
      });
      const body = (await response.json()) as InquiryApiResponse;
      if (!response.ok || !body.ok) {
        if (!body.ok && body.fieldErrors) {
          setErrors(body.fieldErrors);
          focusFirstError(form, body.fieldErrors);
        }
        setState("error");
        setNotice(body.message || "We could not send your inquiry. Please try again.");
        return;
      }
      formRef.current?.reset();
      setState("success");
      setNotice(body.message);
    } catch {
      setState("error");
      setNotice("We could not send your inquiry. Please try again.");
    }
  }

  const describedBy = (field: InquiryField) => errors[field] ? `${field}-error` : undefined;

  return (
    <form ref={formRef} noValidate onSubmit={submit} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className={compact ? "grid gap-4" : "grid gap-4 md:grid-cols-2"}>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Name
          <input name="name" autoComplete="name" aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" />
          {errorFor("name")}
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Work Email
          <input type="email" name="email" autoComplete="email" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" />
          {errorFor("email")}
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Phone or WhatsApp
          <input name="phone" autoComplete="tel" aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" />
          {errorFor("phone")}
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Company
          <input name="company" autoComplete="organization" aria-invalid={Boolean(errors.company)} aria-describedby={describedBy("company")} className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" />
          {errorFor("company")}
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">Country
          <input name="country" autoComplete="country-name" aria-invalid={Boolean(errors.country)} aria-describedby={describedBy("country")} className="rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" />
          {errorFor("country")}
        </label>
      </div>
      <label className="grid gap-2 text-sm font-bold text-slate-700">Project Requirements
        <textarea name="message" aria-invalid={Boolean(errors.message)} aria-describedby={describedBy("message")} className="min-h-32 rounded-md border border-slate-300 px-3 py-3 font-normal outline-none focus:border-apex-blue" />
        {errorFor("message")}
      </label>
      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600">
        <input type="checkbox" name="privacyAccepted" className="mt-1 h-4 w-4 shrink-0" aria-invalid={Boolean(errors.privacyAccepted)} aria-describedby={describedBy("privacyAccepted")} />
        <span>I agree that APEX may use these details to respond to my inquiry under the <Link href="/privacy-policy" className="font-semibold text-apex-blue underline">privacy policy</Link>.</span>
      </label>
      {errorFor("privacyAccepted")}
      <button disabled={state === "pending"} className="rounded-md bg-apex-blue px-5 py-3 font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-wait disabled:opacity-70" type="submit">
        {state === "pending" ? "Sending..." : "Submit Inquiry"}
      </button>
      <p aria-live="polite" className={state === "success" ? "text-sm font-semibold text-green-700" : state === "error" ? "text-sm font-semibold text-red-700" : "sr-only"}>{notice}</p>
    </form>
  );
}
```

- [ ] **Step 4: 传入页面上下文**

在 `app/contact/page.tsx` 中替换调用：

```tsx
<InquiryForm context="General inquiry" />
```

在 `app/products/[slug]/page.tsx` 中替换调用：

```tsx
<InquiryForm context={product.model} />
```

- [ ] **Step 5: 运行表单测试和类型检查确认通过**

Run:

```bash
npm test -- components/InquiryForm.test.tsx
npm run typecheck
```

Expected: 4 tests PASS；类型检查退出码为 `0`。

- [ ] **Step 6: 提交表单界面**

```bash
git add components/InquiryForm.tsx components/InquiryForm.test.tsx app/contact/page.tsx 'app/products/[slug]/page.tsx'
git commit -m "feat: submit inquiries from website forms"
```

### Task 6: 记录环境配置

**Files:**
- Modify: `.gitignore`
- Create: `.env.example`
- Modify: `README.md`

- [ ] **Step 1: 允许提交环境变量模板**

在 `.gitignore` 的 `.env*` 后增加例外：

```gitignore
.env*
!.env.example
```

- [ ] **Step 2: 创建环境变量模板**

Create `.env.example`:

```dotenv
RESEND_API_KEY=
INQUIRY_FROM_EMAIL="APEX Website <inquiries@apexpowersystems.com>"
INQUIRY_TO_EMAIL=gu@apexps-nj.com
```

- [ ] **Step 3: 在 README 中增加配置说明**

Append to `README.md`:

```markdown
## Inquiry email configuration

The website sends contact and product inquiries through Resend. Copy `.env.example` to `.env.local` for local development and set:

- `RESEND_API_KEY`: a server-side Resend API key.
- `INQUIRY_FROM_EMAIL`: a sender on a domain verified in Resend.
- `INQUIRY_TO_EMAIL`: the recipient; defaults to `gu@apexps-nj.com`.

Add the same values to the Vercel Production environment before enabling the live form. Never commit `.env.local` or a real API key.
```

- [ ] **Step 4: 运行类型检查和完整测试**

Run:

```bash
npm run typecheck
npm test
```

Expected: 两条命令退出码均为 `0`，全部测试 PASS。

- [ ] **Step 5: 提交配置文档**

```bash
git add .gitignore .env.example README.md
git commit -m "docs: configure inquiry email delivery"
```

### Task 7: 完整验证和真实邮件检查点

**Files:**
- Verify only; do not change production code unless a failing test identifies a defect.

- [ ] **Step 1: 运行完整自动化验证**

Run:

```bash
npm test
npm run typecheck
npm run build
```

Expected: 所有测试 PASS；类型检查退出码为 `0`；Next.js 生产构建完成且 `/api/inquiries` 出现在路由输出中。

- [ ] **Step 2: 在未配置邮件服务时验证真实 API 行为**

以不包含 Resend 环境变量的方式启动生产构建，然后执行：

```bash
curl -i -X POST http://127.0.0.1:3000/api/inquiries \
  -H 'content-type: application/json' \
  --data '{"name":"QA User","email":"qa@example.com","phone":"","company":"APEX QA","country":"China","message":"Synthetic inquiry for configuration verification.","context":"General inquiry","privacyAccepted":true,"website":""}'
```

Expected: HTTP `503`，响应代码为 `EMAIL_NOT_CONFIGURED`，不得返回成功。

- [ ] **Step 3: 验证桌面和移动端状态**

启动本地站点，使用 Chrome DevTools 设备仿真分别检查 `/contact` 和一个产品详情页：

- Desktop: `1440 x 1000`。
- Mobile: `390 x 844`。
- 校验空提交、无效邮箱、提交中、模拟成功和模拟失败状态。
- 确认 `document.documentElement.scrollWidth === window.innerWidth`。
- 确认状态提示可由 `aria-live` 读取，隐私链接可打开，提交中按钮不可重复点击。

Expected: 没有文字重叠、横向溢出、布局跳动或控制台异常。

- [ ] **Step 4: 配置 Resend 后执行一次真实发送**

仅在 APEX 控制的 Resend 账号、已验证发件域名和 Vercel 环境变量均配置完成后，提交以下合成测试数据：

```text
Name: APEX Website QA
Email: a monitored APEX reply-test mailbox
Phone or WhatsApp: leave empty
Company: APEX Internal Test
Country: China
Project Requirements: Synthetic production inquiry. No customer data.
```

Expected: 页面显示成功；`gu@apexps-nj.com` 收到且只收到一封格式正确的邮件；点击回复时收件人为测试填写的邮箱。若 DNS 或 Resend 尚未配置，则明确记录此步骤未执行，不得报告邮件功能已上线。

- [ ] **Step 5: 检查工作区和提交历史**

Run:

```bash
git status --short
git log --oneline -7
```

Expected: 工作区干净；Task 1-6 的提交按顺序存在；没有 `.env.local`、API 密钥或测试截图进入 Git。
