import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // disables ESLint blocking on Vercel
  },
   typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
