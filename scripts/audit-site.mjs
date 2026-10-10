const baseUrl = new URL(process.env.SITE_AUDIT_URL || "https://www.link-jl.com");
const origin = baseUrl.origin;
const concurrency = 10;

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function stripTags(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());
}

function attribute(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return match ? decodeHtml(match[1] ?? match[2] ?? "") : undefined;
}

function canonicalUrl(value) {
  const url = new URL(value, origin);
  url.hash = "";
  url.search = "";
  if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
  return url.toString().replace(/\/$/, "");
}

function extractPage(html) {
  const title = stripTags(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || "");
  const descriptionTag = [...html.matchAll(/<meta\b[^>]*>/gi)].find((match) => attribute(match[0], "name")?.toLowerCase() === "description")?.[0];
  const canonicalTag = [...html.matchAll(/<link\b[^>]*>/gi)].find((match) => attribute(match[0], "rel")?.toLowerCase().split(/\s+/).includes("canonical"))?.[0];
  const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((match) => stripTags(match[1]));
  const links = [...html.matchAll(/<a\b[^>]*>/gi)].map((match) => attribute(match[0], "href")).filter(Boolean);
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map((match) => match[0]);
  return {
    title,
    description: descriptionTag ? attribute(descriptionTag, "content") || "" : "",
    canonical: canonicalTag ? attribute(canonicalTag, "href") : undefined,
    headings,
    links,
    imagesWithoutAlt: images.filter((tag) => attribute(tag, "alt") === undefined).length,
  };
}

async function fetchUrl(url) {
  const response = await fetch(url, { headers: { "user-agent": "APEX-site-audit/1.0" }, redirect: "follow" });
  return { url, response, body: await response.text() };
}

async function mapConcurrent(items, task) {
  const results = new Array(items.length);
  let nextIndex = 0;
  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await task(items[index]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, worker));
  return results;
}

const sitemapResponse = await fetch(new URL("/sitemap.xml", baseUrl), { headers: { "user-agent": "APEX-site-audit/1.0" } });
if (!sitemapResponse.ok) throw new Error(`Sitemap returned ${sitemapResponse.status}`);
const sitemapXml = await sitemapResponse.text();
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decodeHtml(match[1]));
const sitemapSet = new Set(sitemapUrls.map(canonicalUrl));
const pages = await mapConcurrent(sitemapUrls, fetchUrl);
const errors = [];
const titles = new Map();
const descriptions = new Map();
const inbound = new Map([...sitemapSet].map((url) => [url, 0]));
const internalTargets = new Set();

for (const { url, response, body } of pages) {
  const page = extractPage(body);
  const normalizedUrl = canonicalUrl(url);
  if (response.status !== 200) errors.push(`${url}: expected 200, received ${response.status}`);
  if (!page.title) errors.push(`${url}: missing title`);
  if (!page.description) errors.push(`${url}: missing meta description`);
  if (!page.canonical || canonicalUrl(page.canonical) !== normalizedUrl) errors.push(`${url}: canonical does not match the sitemap URL`);
  if (page.headings.length !== 1) errors.push(`${url}: expected one H1, found ${page.headings.length}`);
  if (page.imagesWithoutAlt) errors.push(`${url}: ${page.imagesWithoutAlt} image(s) have no alt attribute`);

  if (page.title) titles.set(page.title, [...(titles.get(page.title) || []), url]);
  if (page.description) descriptions.set(page.description, [...(descriptions.get(page.description) || []), url]);

  for (const href of page.links) {
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    const target = new URL(href, url);
    if (target.origin !== origin) continue;
    target.hash = "";
    internalTargets.add(target.toString());
    const normalizedTarget = canonicalUrl(target.toString());
    if (sitemapSet.has(normalizedTarget)) inbound.set(normalizedTarget, (inbound.get(normalizedTarget) || 0) + 1);
  }
}

for (const [title, urls] of titles) if (urls.length > 1) errors.push(`Duplicate title "${title}": ${urls.join(", ")}`);
for (const [description, urls] of descriptions) if (urls.length > 1) errors.push(`Duplicate description "${description}": ${urls.join(", ")}`);
for (const [url, count] of inbound) if (url !== canonicalUrl(origin) && count === 0) errors.push(`${url}: sitemap page has no internal links`);

const targetResults = await mapConcurrent([...internalTargets], fetchUrl);
let downloadCount = 0;
for (const { url, response } of targetResults) {
  if (!response.ok) errors.push(`${url}: internal link returned ${response.status}`);
  if (new URL(url).pathname.startsWith("/downloads/")) {
    downloadCount++;
    const robots = response.headers.get("x-robots-tag") || "";
    if (!robots.toLowerCase().includes("noindex")) errors.push(`${url}: download is missing X-Robots-Tag noindex`);
  }
}

console.log(`Audited ${pages.length} sitemap pages and ${targetResults.length} internal link targets.`);
console.log(`Confirmed ${downloadCount} linked download files use noindex.`);
if (errors.length) {
  console.error(`Found ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("No broken links, orphan sitemap pages, metadata duplicates or canonical/H1/alt errors found.");
}
