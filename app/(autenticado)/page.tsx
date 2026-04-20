'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaginaAutenticado() {
  const router = useRouter();

  useEffect(() => {
    // Redireciona para resumo-transacao
    router.push('/resumo-transacao');
  }, [router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Carregando...</span>
      </div>
    </div>
  );
}
