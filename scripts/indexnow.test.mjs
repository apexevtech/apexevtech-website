import assert from "node:assert/strict";
import test from "node:test";
import { buildPayload } from "./indexnow.mjs";
test("buildPayload uses one host and canonical https URLs", () => {
  const payload = buildPayload("https://www.link-jl.com", "key", ["/", "/products"]);
  assert.equal(payload.host, "www.link-jl.com");
  assert.deepEqual(payload.urlList, ["https://www.link-jl.com/", "https://www.link-jl.com/products"]);
});
