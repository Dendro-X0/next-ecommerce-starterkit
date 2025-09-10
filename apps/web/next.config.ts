import path from "path"
import type { NextConfig } from "next"

// Enable bundle analyzer only when ANALYZE=true to avoid overhead in normal builds.
// Run: ANALYZE=true pnpm --filter web build
const withBundleAnalyzer = process.env.ANALYZE === "true"
  ? // eslint-disable-next-line @typescript-eslint/no-var-requires
    require("@next/bundle-analyzer")({ enabled: true })
  : (config: NextConfig) => config

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete even if there are ESLint warnings/errors.
    // We are running in a Safe Mode and will address lint issues separately.
    ignoreDuringBuilds: true,
  },
  transpilePackages: [
    "@repo/ui",
    "@repo/auth",
    "@repo/db",
    "@repo/api",
    "@repo/mail",
    "@repo/emails",
  ],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 768, 1024, 1280, 1536],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256],
    // Optional: allow disabling optimization on Hobby if needed
    // Set NEXT_UNOPTIMIZED_IMAGES=true at build time to bypass runtime image optimization
    unoptimized: process.env.NEXT_UNOPTIMIZED_IMAGES === "true",
  },
}

export default withBundleAnalyzer(nextConfig)
