import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 1080, 1920, 2560],
    imageSizes: [256, 384, 512, 768, 1024],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90, 95],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-41c1a9c640bf4a13820a7650a5f1a9f1.r2.dev",
      },
    ],
  },
};

export default nextConfig;
