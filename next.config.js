/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // API URL 접근 시 redirect 
  async redirects() {
    return [
      {
        source: '/api/users',
        destination: '/login',
        permanent: false,
      },
    ]
  }
}

module.exports = nextConfig
