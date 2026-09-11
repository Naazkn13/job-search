/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_LOCAL_API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
