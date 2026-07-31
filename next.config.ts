import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.GITHUB_ACTIONS ? "/stallora-ai" : "",
  assetPrefix: process.env.GITHUB_ACTIONS ? "/stallora-ai/" : "",
};

export default nextConfig;
