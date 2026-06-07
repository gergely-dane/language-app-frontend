import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {};

async function initCloudflareDev() {
  if (process.env.NODE_ENV !== "production") {
    try {
      const { initOpenNextCloudflareForDev } = await import(
        "@opennextjs/cloudflare"
      );
      void initOpenNextCloudflareForDev();
    } catch (e) {
      console.warn(
        "Cloudflare local dev environment could not be initialized:",
        e,
      );
    }
  }
}

void initCloudflareDev();

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
