import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/seo/redirects";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/product-documents/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nosnippet" }],
      },
      {
        source: "/downloads/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nosnippet" },
          { key: "Content-Disposition", value: "attachment" },
        ],
      },
    ];
  },
  async redirects() {
    return [...legacyRedirects];
  },
};

export default nextConfig;
