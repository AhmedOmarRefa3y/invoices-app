// /** @type {import('next').NextConfig} */
// const nextConfig = {}

// const withBundleAnalyzer = require('@next/bundle-analyzer')()

// module.exports =
//   process.env.ANALYZE === 'true' ? withBundleAnalyzer(nextConfig) : nextConfig

const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
};

module.exports = withNextIntl(nextConfig);
