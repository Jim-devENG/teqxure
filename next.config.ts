import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Same deployment is served under several custom domains
      // (www/admin/app.teqxure.xyz) — Next.js's built-in Server Action CSRF
      // check compares the request Origin against the host it was served
      // from, so every domain that can submit a form needs to be listed.
      allowedOrigins: ["teqxure.xyz", "*.teqxure.xyz", "*.vercel.app"],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
      {
        // admin.teqxure.xyz serves the same /admin pages under clean,
        // unprefixed paths (rewritten internally by middleware), so the
        // path-based rule above no longer matches requests made directly
        // against that host — match on the host instead.
        source: "/:path*",
        has: [{ type: "host", value: "admin.teqxure.xyz" }],
        headers: [{ key: "X-Frame-Options", value: "DENY" }],
      },
    ];
  },
};

export default nextConfig;
