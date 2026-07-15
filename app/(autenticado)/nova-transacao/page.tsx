import type { Metadata } from 'next';
import NovaTransacaoClient from './client';

export const metadata: Metadata = {
  title: 'Nova Transação — Alecrim Wallet',
  description: 'Registre uma nova transação financeira com validação avançada, sugestões de categoria e upload de comprovantes.',
};

export default function PaginaNovaTransacao() {
  return <NovaTransacaoClient />;
}

