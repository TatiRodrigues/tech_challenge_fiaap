'use client';

import { useProtectedRoute } from '@/app/hooks/useProtectedRoute';
import FormularioTransacao from '@/componentes/features/formulario-transacao/page';

export default function PaginaNovaTransacao() {
  const { isAuthorized, user } = useProtectedRoute();

  if (!isAuthorized || !user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return <FormularioTransacao />;
}
