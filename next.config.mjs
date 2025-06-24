/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix for HTTP 431 - Request Header Fields Too Large
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
  // Increase header size limit
  experimental: {
    largePageDataBytes: 128 * 1000, // 128KB
  },
};

export default nextConfig;
