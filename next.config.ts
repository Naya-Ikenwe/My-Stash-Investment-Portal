import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.51.158.23/:path*",
      },
    ];
  },
};

export default nextConfig;
