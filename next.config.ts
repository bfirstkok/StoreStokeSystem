import type { NextConfig } from "next";

const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : "cfguemkkbsqkftonksbe.supabase.co";

const nextConfig: NextConfig = {
  // devIndicators:false,
  async redirects() {
    return [
      {
        source: "/sales",
        destination: "/inventory",
        permanent: false,
      },
      {
        source: "/customers",
        destination: "/inventory",
        permanent: false,
      },
      {
        source: "/reports",
        destination: "/dashboard",
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname,
      },
    ],
  },
};

export default nextConfig;
