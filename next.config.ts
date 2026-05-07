import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://backend:3301/api/:path*",
      },
      {
        source: "/bulk-order",
        destination: "http://backend:3301/bulk-order",
      },
    ];
  },
};

export default nextConfig;
