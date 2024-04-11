/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { hostname: "res.cloudinary.com" },
      { hostname: "d205bpvrqc9yn1.cloudfront.net" },
      { hostname: "gamecritics.com" },
      { hostname: "prod-ne-cdn-media.puregym.com" },
      { hostname: "iso.500px.com" },
      { hostname: "deniscatalin.vercel.app" },
      { hostname: "www.vectorlogo.zone" },
      { hostname: "api.exercisedb.io" },
      { hostname: "v2.exercisedb.io" },
    ],
  },
};

export default nextConfig;
