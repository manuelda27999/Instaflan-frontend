import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imgs.search.brave.com" },
      { protocol: "https", hostname: "i.pinimg.com" },
      { protocol: "https", hostname: "www.mundoperro.net" },
      { protocol: "https", hostname: "media.licdn.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    qualities: [100, 90, 75, 50, 30],
  },
};

export default nextConfig;
