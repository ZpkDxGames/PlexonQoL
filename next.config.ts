import type { NextConfig } from "next";

const config: NextConfig = {
  // Every tool is static HTML plus browser-side state. No runtime API is needed.
  output: "export",
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
};

export default config;
