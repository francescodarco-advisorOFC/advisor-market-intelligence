/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [{ source: '/notizie', destination: '/notizie.html' }];
  },
};
module.exports = nextConfig
