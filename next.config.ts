import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimização de imagens
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Proxy reverso server-side — o browser nunca resolve o host do backend diretamente.
  // Em produção (Vercel): defina API_BACKEND_URL=<url-do-railway> (sem NEXT_PUBLIC_).
  // Em dev local / Docker: usa NEXT_PUBLIC_API_URL como fallback.
  rewrites: async () => [
    {
      source: '/api/bff/:path*',
      destination: `${(process.env.API_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000').replace(/\s/g, '')}/:path*`,
    },
  ],

  // Headers de segurança e performance
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },

  // Variáveis públicas (compartilhadas entre host e remotes)
  env: {
    NEXT_PUBLIC_API_URL: (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000").trim(),
    NEXT_PUBLIC_MFE_TRANSACTIONS_URL: process.env.NEXT_PUBLIC_MFE_TRANSACTIONS_URL || "http://localhost:3001",
    NEXT_PUBLIC_MFE_AUTH_URL: process.env.NEXT_PUBLIC_MFE_AUTH_URL || "http://localhost:3002",
  },

  reactStrictMode: true,

  /**
   * MICROFRONTENDS — Module Federation via Webpack
   * Ativo apenas no build de produção (npm run build --webpack).
   * No dev usa Turbopack (padrão Next.js 16) — muito mais leve em memória.
   *
   * Para gerar o remoteEntry.js:  npm run build
   * Para dev normal:              npm run dev  (Turbopack)
   */
  turbopack: {},

};

export default nextConfig;
