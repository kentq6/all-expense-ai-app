import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      // Allows images from Clerk's CDN to be loaded as images
      new URL('https://img.clerk.com/**'),
    ],
  },
};

export default nextConfig;