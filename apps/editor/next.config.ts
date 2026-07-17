import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ntnu-guide/shared"],
  // Dev server is accessed over the VM's LAN IP, not localhost — without this Next.js
  // blocks cross-origin requests for HMR/dev assets, which breaks hydration entirely.
  allowedDevOrigins: ["192.168.1.211"],
};

export default nextConfig;
