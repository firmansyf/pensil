import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Gambar hasil upload Cloudinary.
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Izinkan URL gambar sampul dari host https mana pun (blog random).
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
