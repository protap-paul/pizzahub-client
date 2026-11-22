import type { NextConfig } from "next";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },

  // Keep auth requests first-party. Proxying Better Auth through this origin
  // lets the session cookie be stored on the app's domain instead of the API
  // domain, so browsers that block third-party cookies still keep the session.
  async rewrites() {
    if (!apiUrl) {
      return [];
    }

    return {
      beforeFiles: [
        {
          source: "/api/auth/:path*",
          destination: `${apiUrl}/api/auth/:path*`,
        },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
