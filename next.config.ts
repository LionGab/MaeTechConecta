/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    // Enable TypeScript checks during builds for production safety
    ignoreBuildErrors: false,
  },
  eslint: {
    // Enable ESLint checks during builds for code quality
    ignoreDuringBuilds: false,
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
