'use client';

import ResumoTransacao from '@/componentes/features/resumo-transacao/page';
import { useAppSelector } from '@/store/hooks';

export default function ResumoTransacaoClient() {
  const { user } = useAppSelector((state) => state.auth);
  return <ResumoTransacao user={user} />;
}
