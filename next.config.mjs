/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/TuftForestGT' : '',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
