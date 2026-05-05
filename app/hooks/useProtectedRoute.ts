'use client';

import { useAuth } from '@/app/provedores/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useProtectedRoute() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    console.log('DEBUG - useProtectedRoute: user =', user);
    
    // Se o usuário é null, não está autenticado
    if (user === null) {
      console.log('DEBUG - useProtectedRoute: user é null, redirecionando para login');
      // Aguarda um pouco para garantir que a hidratação foi completa
      const checkTimer = setTimeout(() => {
        router.push('/login');
      }, 100);
      return () => clearTimeout(checkTimer);
    } else {
      console.log('DEBUG - useProtectedRoute: usuário autenticado:', user);
      // Usuário autenticado
      setIsAuthorized(true);
    }
  }, [user, router]);

  return { isAuthorized, user };
}
