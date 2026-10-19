/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Disable disk pack cache to prevent EINVAL on Google Drive virtual filesystem
    config.cache = false;
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'illustrations.popsy.co',
      },
    ],
  },
};

export default nextConfig;
