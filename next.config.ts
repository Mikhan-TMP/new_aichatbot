import type { NextConfig } from "next";
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  output: 'export',               // ✅ required for static export
  images: {
    unoptimized: true             // ✅ required if using <Image />
  },
};

export default withFlowbiteReact(nextConfig);