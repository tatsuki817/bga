import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // OGP 画像生成で fs から読むフォントを、サーバーレス関数のバンドルに含める
  outputFileTracingIncludes: {
    "/**": ["./src/assets/fonts/*.ttf"],
  },
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
