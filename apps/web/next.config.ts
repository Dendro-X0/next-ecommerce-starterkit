import path from "path"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/ui", "@repo/auth", "@repo/db", "@repo/api", "@repo/mail"],
  images: {
    remotePatterns: [{ protocol: "https", hostname: "picsum.photos" }],
  },
  webpack(config) {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.resolve(__dirname, "src"),
      "~": path.resolve(__dirname, "."),
      "@components": path.resolve(__dirname, "src/components"),
      "@lib": path.resolve(__dirname, "src/lib"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
      "@styles": path.resolve(__dirname, "src/styles"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@config": path.resolve(__dirname, "src/config"),
      "@types": path.resolve(__dirname, "src/types"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@features": path.resolve(__dirname, "src/features"),
      "@services": path.resolve(__dirname, "src/services"),
      "@context": path.resolve(__dirname, "src/context"),
      "@store": path.resolve(__dirname, "src/store"),
      "@api": path.resolve(__dirname, "src/api"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@tests": path.resolve(__dirname, "src/tests"),
    }
    return config
  },
}

export default nextConfig
