/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {},
  images: {
    remotePatterns: [{ protocol: "https", hostname: "res.cloudinary.com" }]
  },
  webpack: (config) => {
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      ignored: ["**/backend/**", "**/frontend/**", "**/.git/**", "**/node_modules/**"]
    };
    return config;
  }
};

export default nextConfig;

