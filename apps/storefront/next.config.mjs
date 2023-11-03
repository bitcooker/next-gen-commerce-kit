import i18nConfig from "./next-i18next.config.js";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: i18nConfig.i18n,

  images: {
    /**
     * Allow external image sources to be processed by Next.js image optimization.
     *
     * @see https://nextjs.org/docs/api-reference/next/image#remote-patterns
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};
export default config;
