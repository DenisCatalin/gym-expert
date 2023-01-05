/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  images: {
    domains: [
      "res.cloudinary.com",
      "d205bpvrqc9yn1.cloudfront.net",
      "gamecritics.com",
      "prod-ne-cdn-media.puregym.com",
      "iso.500px.com",
      "deniscatalin.vercel.app",
    ],
  },
};
