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
    // Use environment variable for backend URL
    // In Docker: http://backend:3301
    // In local dev: http://localhost:3301
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3301/api";
    const backendBaseUrl = backendUrl.replace('/api', '');
    
    return [
      {
        source: "/api/:path*",
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
