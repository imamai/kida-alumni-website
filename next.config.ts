import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Placeholder imagery only — swap for real uploads via the CMS media library (kida_media / Supabase Storage).
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      {
        protocol: "https",
        hostname: "sedsjjmjnikppfaecaya.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
