import type { NextConfig } from "next";

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
        hostname: "xrlacnmgrlzodrwjrmvi.supabase.co",
      },
    ],
  },
};

export default nextConfig;
