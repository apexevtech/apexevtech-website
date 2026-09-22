import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/seo/redirects";
import { securityHeaders } from "./lib/security/headers";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    minimumCacheTTL: 604800,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [...securityHeaders],
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }],
      },
      {
        source: "/downloads/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nosnippet" },
          { key: "Content-Disposition", value: "attachment" },
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },
  async redirects() {
    return [...legacyRedirects];
  },
};

export default nextConfig;
