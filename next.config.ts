import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: "standalone",
    // 禁用图片优化（FC环境下可能有问题）
    images: {
        unoptimized: true,
    },
    // 确保 experimental 配置存在
    experimental: {
        serverMinification: true,
    },
};

export default nextConfig;
