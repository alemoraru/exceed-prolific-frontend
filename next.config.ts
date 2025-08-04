import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    output: "standalone",
    reactStrictMode: false,
    allowedDevOrigins: ['127.0.0.1']
};

export default nextConfig;
