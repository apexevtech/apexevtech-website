import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

export function buildPayload(siteUrl, key, paths) {
  const base = new URL(siteUrl);
  if (base.protocol !== "https:") throw new Error("IndexNow requires an HTTPS site URL");
  const urlList = [...new Set(paths.map((path) => new URL(path, base).toString()))];
  if (urlList.some((url) => new URL(url).host !== base.host)) throw new Error("All URLs must use the site host");
  return { host: base.host, key, keyLocation: `${base.origin}/${key}.txt`, urlList };
}

async function main() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const key = process.env.INDEXNOW_KEY;
  if (!siteUrl || !key) throw new Error("Set NEXT_PUBLIC_SITE_URL and INDEXNOW_KEY");
  const xml = await fetch(`${siteUrl}/sitemap.xml`).then(async (response) => { if (!response.ok) throw new Error(`Sitemap request failed: ${response.status}`); return response.text(); });
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const payload = buildPayload(siteUrl, key, paths);
  const response = await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "content-type": "application/json; charset=utf-8" }, body: JSON.stringify({ ...payload, urlList: payload.urlList.slice(0, 10000) }) });
  if (!response.ok) throw new Error(`IndexNow submission failed: ${response.status}`);
  console.info(`Submitted ${payload.urlList.length} URLs to IndexNow.`);
}
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main().catch((error) => { console.error(error.message); process.exitCode = 1; });
}
