import { NextResponse, type NextRequest } from "next/server";
import { localizedPagePaths } from "@/lib/i18n/public-pages";
import { stripLanguagePrefix } from "@/lib/i18n/urls";

const publicPages = new Set([...localizedPagePaths, "/resources", "/library", "/engineering-cases", "/applications"]);
const pageNamespace = /^\/(?:zh|products|resources|applications|interfaces|project-cases)(?:\/|$)/;

function decodePagePath(path: string): string | null {
  try {
    const segments = path.split("/").map((segment) => decodeURIComponent(segment));
    if (segments.some((segment) => segment.includes("/") || segment.includes("\\"))) return null;
    return segments.join("/");
  } catch {
    return null;
  }
}

// Next's dynamic notFound recovery can return an empty no-JS document.
// Reject unknown public-page paths before that recovery, without touching APIs or files.
const notFoundDocument = `<!DOCTYPE html><html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, follow"><title>Page Not Found | APEX</title>
<link rel="icon" href="/assets/apex-logo.webp">
<style>body{margin:0;background:#fff;color:#12263a;font-family:Arial,"Microsoft YaHei",sans-serif}header{border-bottom:1px solid #e2e8f0;padding:20px}header div,main{max-width:1024px;margin:auto}header div{display:flex;align-items:center;gap:12px;font-weight:700}main{padding:64px 20px}h1{margin:0;font-size:48px}p{font-size:20px;font-weight:600;line-height:1.6}nav{display:flex;flex-wrap:wrap;gap:12px 32px;margin-top:32px}a{display:inline-flex;align-items:center;min-height:44px;color:#1268a8;font-weight:700;text-underline-offset:4px}a:focus-visible{outline:3px solid #1479c9;outline-offset:4px}</style>
</head><body><header><div><img src="/assets/apex-logo.webp" width="48" height="47" alt="APEX"><span>APEX Power Systems</span></div></header>
<main><h1>404</h1><p>This page could not be found.</p><p lang="zh-CN">未找到该页面。</p>
<nav aria-label="Website language"><a href="/" lang="en">English home</a><a href="/zh" lang="zh-CN">中文首页</a></nav></main></body></html>`;

export function proxy(request: NextRequest) {
  if (request.method !== "GET" && request.method !== "HEAD") return NextResponse.next();
  const path = request.nextUrl.pathname.replace(/\/$/, "") || "/";
  if (!pageNamespace.test(path)) return NextResponse.next();
  const decodedPath = decodePagePath(path);
  if (decodedPath !== null && publicPages.has(stripLanguagePrefix(decodedPath))) return NextResponse.next();
  return new NextResponse(request.method === "HEAD" ? null : notFoundDocument, {
    status: 404,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, follow",
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: ["/zh/:path*", "/products/:path*", "/resources/:path*", "/applications/:path*", "/interfaces/:path*", "/project-cases/:path*"],
};
