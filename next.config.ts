import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    images: {
        unoptimized: true,
    },
    // 绑定到所有网络接口，支持ECS部署
    serverRuntimeConfig: {
        hostname: "0.0.0.0",
    },
};

export default nextConfig;
