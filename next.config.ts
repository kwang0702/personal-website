import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 1080, 1920, 2560],
    imageSizes: [256, 384, 512, 768, 1024],
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85, 90, 95],
  },
};

export default nextConfig;
