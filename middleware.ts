/**
 * Next.js Edge Middleware — Segurança e Proteção de Rotas
 *
 * Executado no Edge Runtime antes de qualquer requisição.
 * Responsável por:
 *  1. Proteção de rotas autenticadas (redireciona para /login)
 *  2. Proteção inversa (usuário logado não acessa /login ou /cadastro)
 *  3. Headers de segurança HTTP (CSP, HSTS, etc.)
 *  4. Rate limiting simples em endpoints de autenticação
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ── Rotas que exigem autenticação ─────────────────────────────────────────────
const PROTECTED = ['/resumo-transacao', '/listar-transacoes', '/nova-transacao'];

// ── Rotas públicas (redireciona para dashboard se já logado) ──────────────────
const PUBLIC_ONLY = ['/login', '/cadastro', '/esqueceu-senha'];

// ── Rate limiting simples (Edge — sem Redis, usa memória do runtime) ──────────
// Limita tentativas de login: 10 req/min por IP
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string, limit = 10, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // permitido
  }

  if (entry.count >= limit) return false; // bloqueado

  entry.count++;
  return true;
}

// ── Adiciona headers de segurança HTTP ────────────────────────────────────────
function addSecurityHeaders(response: NextResponse): NextResponse {
  const h = response.headers;

  // Impede clickjacking
  h.set('X-Frame-Options', 'DENY');

  // Impede sniffing de MIME type
  h.set('X-Content-Type-Options', 'nosniff');

  // Ativa proteção XSS do browser (legado, mas útil)
  h.set('X-XSS-Protection', '1; mode=block');

  // Controla o Referrer enviado nas requisições
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Desabilita features desnecessárias
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');

  // HSTS — força HTTPS em produção
  if (process.env.NODE_ENV === 'production') {
    h.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // Content Security Policy
  h.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-* necessário para Next.js/React
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self' data:",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  return response;
}

// ── Middleware principal ───────────────────────────────────────────────────────
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Redireciona raiz para /login
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Rate limiting para endpoint de autenticação
  if (pathname === '/api/bff/user/auth' && request.method === 'POST') {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? request.headers.get('x-real-ip')
      ?? '0.0.0.0';

    if (!checkRateLimit(ip, 10, 60_000)) {
      return new NextResponse(
        JSON.stringify({ message: 'Muitas tentativas. Aguarde 1 minuto.' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '60',
          },
        }
      );
    }
  }

  // Lê o token de autenticação do cookie (definido pelo cliente no login)
  const token = request.cookies.get('auth_token')?.value;
  const isAuthenticated = Boolean(token);

  // Rota protegida sem token → redireciona para login
  const isProtected = PROTECTED.some((r) => pathname.startsWith(r));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    const response = NextResponse.redirect(loginUrl);
    return addSecurityHeaders(response);
  }

  // Rota pública com token → redireciona para dashboard
  const isPublicOnly = PUBLIC_ONLY.some((r) => pathname.startsWith(r));
  if (isPublicOnly && isAuthenticated) {
    const response = NextResponse.redirect(new URL('/resumo-transacao', request.url));
    return addSecurityHeaders(response);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas exceto:
     * - _next/static  (arquivos estáticos)
     * - _next/image   (otimização de imagens)
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
