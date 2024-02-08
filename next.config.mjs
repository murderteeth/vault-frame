/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'assets.smold.app',
      pathname: '/**/*',
    }, {
      protocol: 'https',
      hostname: 'raw.githubusercontent.com',
      pathname: '/**/*',
    }]
  },
  env: {
    SMOL_ASSETS_URL: process.env.SMOL_ASSETS_URL,
  }
}

export default nextConfig
