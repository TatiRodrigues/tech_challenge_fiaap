import type { Metadata } from 'next';
import ResumoTransacaoClient from './client';

export const metadata: Metadata = {
  title: 'Dashboard — Alecrim Wallet',
  description: 'Resumo financeiro detalhado das suas transações: receitas, despesas e análise de desempenho.',
};

export default function PaginaResumoTransacao() {
  return <ResumoTransacaoClient />;
}

