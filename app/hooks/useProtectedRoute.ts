'use client';

import { useAuth } from '@/app/provedores/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useProtectedRoute() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Se o usuário é null, não está autenticado
    if (user === null) {
      // Aguarda um pouco para garantir que a hidratação foi completa
      const checkTimer = setTimeout(() => {
        router.push('/login');
      }, 100);
      return () => clearTimeout(checkTimer);
    } else {
      // Usuário autenticado
      setIsAuthorized(true);
    }
  }, [user, router]);

  return { isAuthorized, user };
}
