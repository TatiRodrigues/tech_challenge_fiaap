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
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
    NEXT_PUBLIC_MFE_TRANSACTIONS_URL: process.env.NEXT_PUBLIC_MFE_TRANSACTIONS_URL || "http://localhost:3001",
    NEXT_PUBLIC_MFE_AUTH_URL: process.env.NEXT_PUBLIC_MFE_AUTH_URL || "http://localhost:3002",
  },

  reactStrictMode: true,

  /**
   * MICROFRONTENDS — Module Federation via Webpack
   *
   * Arquitetura de módulos:
   *   HOST  (porta 3001) — alecrim_wallet_host    → expõe Header, MenuLateral, tipos compartilhados
   *   MFE-1 (porta 3002) — alecrim_wallet_transactions → expõe telas e componentes de transações
   *   MFE-2 (porta 3003) — alecrim_wallet_auth    → expõe telas e lógica de autenticação
   *
   * Comunicação entre módulos: via MicrofrontendBus (config/microfrontend-advanced.ts)
   *   - Eventos tipados em MFEEvents namespace
   *   - Cross-tab communication via localStorage storage events
   *   - Request/Response pattern para operações síncronas
   */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
      config.plugins.push(
        new ModuleFederationPlugin({
          name: 'alecrim_wallet_host',
          filename: 'static/chunks/remoteEntry.js',
          remotes: {
            alecrim_wallet_transactions: `alecrim_wallet_transactions@${process.env.NEXT_PUBLIC_MFE_TRANSACTIONS_URL || 'http://localhost:3002'}/_next/static/chunks/remoteEntry.js`,
            alecrim_wallet_auth: `alecrim_wallet_auth@${process.env.NEXT_PUBLIC_MFE_AUTH_URL || 'http://localhost:3003'}/_next/static/chunks/remoteEntry.js`,
          },
          exposes: {
            './components/Header': './componentes/header/Header.tsx',
            './components/MenuLateral': './componentes/menu-lateral/MenuLateral.tsx',
            './store': './store/index.ts',
          },
          shared: {
            react: { singleton: true, eager: true, requiredVersion: '19.2.3' },
            'react-dom': { singleton: true, eager: true, requiredVersion: '19.2.3' },
            'react-redux': { singleton: true, requiredVersion: '^9.0.0' },
            '@reduxjs/toolkit': { singleton: true, requiredVersion: '^2.0.0' },
          },
          runtimePlugins: [],
        })
      );
    }
    return config;
  },

  // Turbopack desabilitado — usar webpack (necessário para Module Federation)

};

export default nextConfig;


