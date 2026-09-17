import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.eduvibehub.com.ng",
          },
        ],
        destination: "https://eduvibehub.com.ng/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
