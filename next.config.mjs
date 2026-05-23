const { composePlugins, withNx } = require('@nx/next');

const repo = "YOUR_REPO_NAME";

const nextConfig = {
  output: 'export',
  basePath: '/cinema-seats-picker',
  assetPrefix: '/cinema-seats-picker',
  distDir: '/cinema-seats-picker'
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
];
module.exports = composePlugins(...plugins)(nextConfig);