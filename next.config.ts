import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "douglasj.zenoti.com",
      },
      {
        protocol: "https",
        hostname: "files.zenoti.com",
      },
    ],
  },
};

export default nextConfig;
