/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow Firebase Studio and other development origins to access the app
  // Using wildcard patterns to match any port from Firebase Studio
  allowedDevOrigins: [
    '*.cloudworkstations.dev',
  ],
};

export default nextConfig;
