/** @type {import('next').NextConfig} */

const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['@ilbru/dossier-ui']);

const basePath = '/loandossier';

module.exports = withPlugins([withTM], {
  basePath,
  assetPrefix: basePath,
  env: {
    API_PATH: basePath + '/api',
    BASE_URL: process.env['apps.loandossier.ws'],
  },
  trailingSlash: false,
  images: {
    domains: ['broker.avclick.ru', 'localhost', '127.0.0.1', 'bb.avclick.ru'],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});
