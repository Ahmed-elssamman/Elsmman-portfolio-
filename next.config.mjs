/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    inlineCss: true,
    optimizePackageImports: ["framer-motion"],
  },
};

export default nextConfig;
