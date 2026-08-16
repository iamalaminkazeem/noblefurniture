/** @type {import('next').NextConfig} */
const nextConfig = {
  // Tells Next.js not to bundle @react-pdf/renderer into the server build —
  // this is react-pdf's own documented fix for "Minified React error #31"
  // crashes in the Next.js App Router. Without this, the App Router's
  // bundling conflicts with react-pdf's internal renderer.
  serverExternalPackages: ["@react-pdf/renderer"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ik.imagekit.io" },
    ],
  },
};
module.exports = nextConfig;