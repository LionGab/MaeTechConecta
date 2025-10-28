/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    domains: [
      'placehold.co',
      'storage.googleapis.com',
      'i.imgur.com'
    ],
  },
  allowedDevOrigins: ["https://*.cloudworkstations.dev"],
};

module.exports = nextConfig;
