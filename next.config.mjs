/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ws-na.amazon-adsystem.com',
        pathname: '/widgets/q**',
      },
    ],
  },
};

export default nextConfig;
