/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "dreamdwelling.com", "images.unsplash.com"],
  },
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    API_URL: process.env.API_URL || "http://localhost:8000/api",
  },
};

module.exports = nextConfig;
