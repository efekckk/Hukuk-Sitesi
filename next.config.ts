import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "aebhukuk.com" },
      { protocol: "https", hostname: "www.aebhukuk.com" },
      // Admin paneli için yüklenen görseller local /uploads/ üzerinden gelir
      // Harici CDN eklenirse buraya eklenecek
    ],
  },
};

export default withNextIntl(nextConfig);
