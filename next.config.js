/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // fixed sizes used by <Image width height> in the app
    imageSizes: [110, 240, 400, 600],
    deviceSizes: [384, 480, 640, 768, 828, 1080, 1200, 1920],
  },
};

module.exports = nextConfig;
