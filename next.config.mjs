/** @type {import('next').NextConfig} */
const nextConfig = {
  // have Next.js transpile monaco-vim to fix Turbopack compilation errors
  transpilePackages: ["monaco-vim"],
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

export default nextConfig;
