'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

/**
 * Hook para proteção de rotas
 * Redireciona para login se não estiver autenticado
 */
export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      setIsAuthorized(true);
      return;
    }

    const timer = setTimeout(() => {
      router.push('/login');
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, user, router]);

  return { isAuthorized, user };
}
