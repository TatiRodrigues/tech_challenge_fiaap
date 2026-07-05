import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimização de imagens
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de segurança e performance
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },

  // Configuração para suportar microfrontends
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
  },

  // Strict mode para melhor detecção de bugs
  reactStrictMode: true,

  // Turbopack é o default no Next.js 16
  // Não precisa de configuração customizada - funciona out-of-the-box
  turbopack: {},
};

export default nextConfig;

