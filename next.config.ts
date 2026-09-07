import type { NextConfig } from "next";
import { legacyRedirects } from "./lib/seo/redirects";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [...legacyRedirects];
  },
};

export default nextConfig;
