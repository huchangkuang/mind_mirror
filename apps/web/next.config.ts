import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    transpilePackages: ["@mind-mirror/shared"],
    images: {
        unoptimized: true,
    },
};

export default nextConfig;
