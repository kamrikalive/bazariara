
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = {
  async redirects() {
    return [
      {
        source: '/product/:id',
        destination: '/products/uncategorized/:id', // Мы не знаем категорию, поэтому отправляем в общую
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:5001/bazariara/us-central1/api/:path*', // Прокси для Firebase Functions
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/bazariara.appspot.com/**',
      },
       {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
