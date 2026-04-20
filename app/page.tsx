'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    // Redirecionar para login ao acessar a página raiz
    router.push('/login');
  }, [router]);

  return null;
}