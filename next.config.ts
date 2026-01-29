import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          "https://jewellery-provision-heart-debate.trycloudflare.com/:path*",
      },
    ];
  },
};

export default nextConfig;
