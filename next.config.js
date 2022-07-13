/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = {
  nextConfig,
  images: {
    domains: [
      "themealdb.com",
      "www.themealdb.com",
      "res.cloudinary.com",
      "d205bpvrqc9yn1.cloudfront.net",
    ],
  },
};
