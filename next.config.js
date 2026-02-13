/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // 👈 whitelist
  },
};

module.exports = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};


module.exports = nextConfig;
