import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { buildPayload } from "./indexnow.mjs";

test("buildPayload uses one host and canonical https URLs", () => {
  const payload = buildPayload("https://www.link-jl.com", "key", ["/", "/products"]);
  assert.equal(payload.host, "www.link-jl.com");
  assert.deepEqual(payload.urlList, [
    "https://www.link-jl.com/",
    "https://www.link-jl.com/products",
  ]);
});

test("buildPayload rejects non-HTTPS sites and cross-host URLs", () => {
  assert.throws(() => buildPayload("http://www.link-jl.com", "key", ["/"]), /HTTPS/);
  assert.throws(
    () => buildPayload("https://www.link-jl.com", "key", ["https://example.com/"]),
    /site host/,
  );
});

test("running the CLI without configuration fails loudly", () => {
  const result = spawnSync(process.execPath, ["scripts/indexnow.mjs"], {
    cwd: process.cwd(),
    env: { ...process.env, NEXT_PUBLIC_SITE_URL: "", INDEXNOW_KEY: "" },
    encoding: "utf8",
  });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Set NEXT_PUBLIC_SITE_URL and INDEXNOW_KEY/);
});
