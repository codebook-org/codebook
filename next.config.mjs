import { build } from "velite";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

let isBuilding = false;

export default async () => {
  if (!isBuilding) {
    isBuilding = true;
    await build({ watch: process.env.NODE_ENV === "development" });
  }
  return nextConfig;
};
