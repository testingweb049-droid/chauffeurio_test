// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // NOTE: App Router does not support `i18n` in next.config.ts.
  // Do NOT add `i18n` here. Use route segments (app/[locale]/...) or a library like next-intl / next-i18next (App Router setup).
};

export default nextConfig;
