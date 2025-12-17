/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const backendBaseUrlRaw = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
    const backendBaseUrl = backendBaseUrlRaw.replace(/\/+$/, '')

    return [
      {
        source: '/api/:path*',
        destination: `${backendBaseUrl}/api/:path*`,
      },
    ]
  },
}

export default nextConfig