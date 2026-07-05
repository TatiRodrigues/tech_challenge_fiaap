/**
 * Guia de Performance e SSG/SSR
 * Otimizações para Alecrim Wallet
 */

// ============ NEXT.JS CONFIGURATION ============

/**
 * next.config.ts otimizado
 */
const config = {
  // Desabilitar source maps em produção
  productionBrowserSourceMaps: false,

  // Compressão de assets
  compress: true,

  // Remover header "X-Powered-By"
  poweredByHeader: false,

  // Otimizar fonts
  optimizeFonts: true,

  // Experimental: parallel build
  experimental: {
    optimizePackageImports: ['@reduxjs/toolkit', 'react-redux'],
  },

  // Headers de cache
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Rewrites
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/api/:path*',
          destination: 'http://localhost:3000/api/:path*',
        },
      ],
    };
  },
};

// ============ STATIC GENERATION (SSG) ============

/**
 * Exemplo de página com SSG
 * 
 * A página é pré-renderizada durante build time
 * e servida estaticamente em produção
 */

// app/transactions/page.tsx
export async function generateStaticParams() {
  // Gerar rotas estáticas para transações comuns
  const transactionTypes = ['deposito', 'saque', 'transferencia'];

  return transactionTypes.map((type) => ({
    type,
  }));
}

export async function generateMetadata({ params }: any) {
  return {
    title: `Transações - ${params.type}`,
    description: `Filtro de transações por tipo: ${params.type}`,
  };
}

export default function TransactionsPage({ params }: any) {
  return <div>Transações: {params.type}</div>;
}

// ============ INCREMENTAL STATIC REGENERATION (ISR) ============

/**
 * ISR: Regenerar página estaticamente em background
 * Útil para conteúdo que muda periodicamente
 */

export const revalidate = 3600; // Regenerar a cada 1 hora

export default function DashboardPage() {
  return <div>Dashboard atualizado a cada hora</div>;
}

// ============ ON-DEMAND REVALIDATION ============

/**
 * Revalidar página sob demanda (webhook, etc)
 */

// app/api/revalidate/route.ts
export async function POST(request: Request) {
  const secret = request.headers.get('x-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return new Response('Unauthorized', { status: 401 });
  }

  const path = new URL(request.url).searchParams.get('path');

  if (!path) {
    return new Response('Missing path parameter', { status: 400 });
  }

  try {
    await revalidatePath(path);
    return new Response(`Revalidated ${path}`, { status: 200 });
  } catch (error) {
    return new Response('Revalidation failed', { status: 500 });
  }
}

// ============ IMAGE OPTIMIZATION ============

/**
 * Otimizar imagens com Next.js Image component
 */

import Image from 'next/image';

export function OptimizedImage() {
  return (
    <Image
      src="/logo.png"
      alt="Alecrim Wallet Logo"
      width={200}
      height={100}
      priority // Preload imagem (apenas para above-the-fold)
      placeholder="blur" // Blur placeholder
      blurDataURL="data:image/jpeg,..." // Placeholder blur LQIP
    />
  );
}

// ============ FONT OPTIMIZATION ============

/**
 * Otimizar fonts com next/font
 */

import { Roboto, Inter } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap', // Usar font do sistema enquanto carrega
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
});

// ============ CODE SPLITTING ============

/**
 * Lazy load componentes pesados
 */

import dynamic from 'next/dynamic';

// Componente será carregado apenas quando necessário
const HeavyChart = dynamic(
  () => import('@/componentes/features/financial-charts/FinancialCharts'),
  {
    loading: () => <div>Carregando gráfico...</div>,
    ssr: false, // Não renderizar no servidor
  }
);

export function DashboardWithLazyChart() {
  return (
    <div>
      <h1>Dashboard</h1>
      <HeavyChart transactions={[]} />
    </div>
  );
}

// ============ BUNDLE ANALYSIS ============

/**
 * Analisar tamanho do bundle
 * 
 * Instalar: npm install --save-dev @next/bundle-analyzer
 * 
 * next.config.js:
 */
// const withBundleAnalyzer = require('@next/bundle-analyzer')({
//   enabled: process.env.ANALYZE === 'true',
// });
// module.exports = withBundleAnalyzer(config);

// Usar: ANALYZE=true npm run build

// ============ PERFORMANCE METRICS ============

/**
 * Rastrear Core Web Vitals
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function reportWebVitals(metric: any) {
  // Enviar para analytics
  if (typeof window !== 'undefined') {
    const body = JSON.stringify(metric);

    // Use sendBeacon para garantir que seja enviado
    navigator.sendBeacon('/api/analytics', body);
  }
}

// ============ CSS OPTIMIZATION ============

/**
 * Utilizar PurgeCSS para remover CSS não usado
 */

// next.config.js com Tailwind
// const withCSS = require('@next/css')({
//   purgeCSSOptions: {
//     content: [
//       './pages/**/*.{js,ts,jsx,tsx}',
//       './components/**/*.{js,ts,jsx,tsx}',
//     ],
//   },
// });

// ============ PREFETCH & PRELOAD ============

/**
 * Prefetch links importantes
 */

import Link from 'next/link';

export function Navigation() {
  return (
    <nav>
      <Link href="/dashboard" prefetch={true}>
        Dashboard
      </Link>
      <Link href="/transacoes" prefetch={true}>
        Transações
      </Link>
    </nav>
  );
}

// ============ DATABASE CACHING ============

/**
 * Usar Next.js fetch cache para requisições
 */

async function getTransactions() {
  const res = await fetch('http://localhost:3000/api/transactions', {
    // Cache por 1 hora
    next: { revalidate: 3600 },
    // Ou
    cache: 'force-cache',
    // Ou desabilitar cache
    // cache: 'no-store',
  });

  return res.json();
}

// ============ PERFORMANCE CHECKLIST ============

export const performanceChecklist = [
  // ✅ Images
  '✅ Usar next/image para todas as imagens',
  '✅ Providenciar width e height',
  '✅ Usar priority="true" para above-the-fold',
  '✅ Usar placeholder="blur"',

  // ✅ Fonts
  '✅ Usar next/font para Google Fonts',
  '✅ Display: swap para evitar FOUT',
  '✅ Preload apenas fontes usadas',

  // ✅ Code
  '✅ Code splitting com dynamic imports',
  '✅ Tree shaking de dependências',
  '✅ Remover console.log em produção',

  // ✅ Bundle
  '✅ Usar webpack bundle analyzer',
  '✅ Identificar chunks grandes',
  '✅ Lazy load componentes pesados',

  // ✅ Caching
  '✅ Cache HTTP headers corretos',
  '✅ ISR para conteúdo semi-estático',
  '✅ Service Workers para offline',

  // ✅ Monitoring
  '✅ Rastrear Core Web Vitals',
  '✅ Usar Lighthouse CI',
  '✅ Monitorar performance em produção',
];

// ============ MONITORING SCRIPT ============

/**
 * Monitorar performance em tempo real
 */

export function PerformanceMonitor() {
  if (typeof window === 'undefined') return null;

  React.useEffect(() => {
    // Observar Long Tasks (>50ms)
    if ('PerformanceObserver' in window) {
      try {
        const observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            console.warn('Long task detected:', entry);
          }
        });

        observer.observe({ entryTypes: ['longtask'] });

        return () => observer.disconnect();
      } catch (error) {
        // PerformanceObserver for 'longtask' not supported
      }
    }
  }, []);

  return null;
}

// ============ SEO OPTIMIZATION ============

/**
 * Metadata estruturada para SEO
 */

export const seoMetadata = {
  title: 'Alecrim Wallet - Gerenciador de Transações Inteligente',
  description:
    'Plataforma completa para gestão de transações financeiras com análises em tempo real, gráficos interativos e dashboard personalizado.',
  keywords: [
    'finanças',
    'transações',
    'dashboard',
    'análise financeira',
    'gerenciador de dinheiro',
  ],
  openGraph: {
    title: 'Alecrim Wallet',
    description: 'Seu gerenciador de transações inteligente',
    url: 'https://alecrim-wallet.com',
    type: 'website',
    images: [
      {
        url: 'https://alecrim-wallet.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Alecrim Wallet Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@alecrimblog',
    creator: '@seu_handle',
  },
};

// ============ SITEMAP GERAÇÃO ============

/**
 * app/sitemap.ts - Gerar sitemap dinamicamente
 */

export async function generateSitemap() {
  const routes = [
    { url: 'https://alecrim-wallet.com', lastmod: new Date().toISOString() },
    { url: 'https://alecrim-wallet.com/login', lastmod: new Date().toISOString() },
    { url: 'https://alecrim-wallet.com/dashboard', lastmod: new Date().toISOString() },
    { url: 'https://alecrim-wallet.com/transacoes', lastmod: new Date().toISOString() },
  ];

  return routes;
}

// ============ ROBOTS.TXT ============

/**
 * public/robots.txt
 */

export const robotsTxt = `
User-agent: *
Allow: /
Allow: /login
Allow: /dashboard
Allow: /transacoes

Disallow: /api/
Disallow: /admin/

Sitemap: https://alecrim-wallet.com/sitemap.xml
`;

// ============ PERFORMANCE TIPS ============

export const performanceTips = `
## 🚀 Dicas de Performance

### Next.js
1. Usar SSG/ISR quando possível
2. Code splitting automático
3. Image optimization
4. Font optimization
5. CSS-in-JS otimizado

### Redux
1. Usar selectors memoizados
2. Normalizar estado
3. Evitar re-renders desnecessários
4. Usar connect() em vez de hooks se performance crítica

### React
1. Lazy load componentes com React.lazy()
2. Use useMemo para cálculos pesados
3. Use useCallback para functions stable
4. Memoize componentes com React.memo()

### Networking
1. Compressão Gzip/Brotli
2. CDN para assets
3. Request deduplication
4. Prefetch/Preload recursos críticos

### Monitoring
1. Lighthouse CI
2. Core Web Vitals
3. Performance budget
4. Sentry/LogRocket para errors
`;

export default {
  performanceChecklist,
  performanceTips,
  seoMetadata,
  robotsTxt,
};
