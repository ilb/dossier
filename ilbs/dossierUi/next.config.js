// const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  trailingSlash: false,
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
  pageExtensions: ['js', 'jsx'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};
