/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID: XXXXXXX
    ,
    NEXT_PUBLIC_ZEGO_SERVER_ID : "XXXXXXXXXXXXXXXXXXXX"
  },
  images: {
    domains: [
      "localhost" // CHANGE IT ON DEPLOYMENT
    ],
  },
};

module.exports = nextConfig;
