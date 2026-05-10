/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ws-na.amazon-adsystem.com',
        pathname: '/widgets/q**',
      },
    ],
  },
  async redirects() {
    return [
      // ── www → non-www (permanent) ─────────────────────────────────────────
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.ai-desk.tech' }],
        destination: 'https://ai-desk.tech/:path*',
        permanent: true,
      },
      // ── Keyword cannibalization: blog "best of" → /best canonical pages ───
      // These blog posts target identical queries as /best pages — 301 consolidates signals
      {
        source: '/blog/best-gpu-for-local-llm-2026',
        destination: '/best/gpu-for-local-llm',
        permanent: true,
      },
      {
        source: '/blog/best-mini-pc-for-ollama-2026',
        destination: '/best/mini-pc-for-ollama',
        permanent: true,
      },
      {
        source: '/blog/best-gpu-stable-diffusion-flux-2026',
        destination: '/best/gpu-for-stable-diffusion',
        permanent: true,
      },
      {
        source: '/blog/best-local-ai-hardware-under-500',
        destination: '/best/budget-ai-hardware',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
