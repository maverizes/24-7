import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Loyiha ildizini aniq belgilaymiz — yuqoridagi papkadagi begona
  // package-lock.json Turbopack'ni chalg'itmasligi uchun.
  turbopack: { root: import.meta.dirname },

  // TZ 26 — rasm optimizatsiyasi: zamonaviy formatlar va mos o'lchamlar.
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 414, 640, 828, 1080, 1280, 1920],
  },

  // TZ 36 — asosiy xavfsizlik sarlavhalari.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
