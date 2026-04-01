// import nextPWA from "next-pwa";

// const withPWA = nextPWA({
//   dest: "public",
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",
//   fallbacks: {
//     document: "/offline.html",
//   },
// });

// const nextConfig = {
//   reactStrictMode: true,
// };

// export default withPWA(nextConfig);

import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

export default withPWA({
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
});