// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  // No need to exclude bcryptjs - it's pure JavaScript, no native dependencies
  // Exclude problematic native modules from webpack processing
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude native modules from server-side bundling
      config.externals = config.externals || [];
      config.externals.push({
        'bcrypt': 'commonjs bcrypt',
        '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
      });
      
      // Ignore HTML and other non-JS files in node_modules
      config.module = config.module || {};
      config.module.rules = config.module.rules || [];
      config.module.rules.push({
        test: /\.(html|md|txt)$/,
        include: /node_modules/,
        type: 'asset/resource',
      });
    }
    return config;
  },
  // NOTE: App Router does not support `i18n` in next.config.ts.
  // Do NOT add `i18n` here. Use route segments (app/[locale]/...) or a library like next-intl / next-i18next (App Router setup).
};

export default nextConfig;
