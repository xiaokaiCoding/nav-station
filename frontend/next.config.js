/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // 开发环境：代理到本地 Express
    const apiTarget = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    return [
      {
        source: '/api/:path*',
        destination: `${apiTarget}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
