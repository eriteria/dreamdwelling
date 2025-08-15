/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "localhost",
      "dreamdwelling.com",
      "images.unsplash.com",
      "picsum.photos",
    ],
  },
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
    GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  },
};

module.exports = nextConfig;
