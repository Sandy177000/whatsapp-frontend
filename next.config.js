/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    NEXT_PUBLIC_ZEGO_APP_ID: 367410720
    ,
    NEXT_PUBLIC_ZEGO_SERVER_ID : "0c34b960eb0aa205ac584d0421d7ffe3"
  },
  images: {
    domains: [
      "localhost" // CHANGE IT ON DEPLOYMENT
    ],
  },
};

module.exports = nextConfig;
