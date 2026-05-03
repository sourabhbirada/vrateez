import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
