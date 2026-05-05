'use client';

import { useMemo } from 'react';

interface Transaction {
  id: number;
  date: string;
  type: string;
  description: string;
  value: number;
  status: string;
}

interface CardsResumoProps {
  transactions: Transaction[];
}

export default function CardsResumo({ transactions }: CardsResumoProps) {
  const totals = useMemo(() => {
    const totalDeposits = transactions
      .filter(t => t.type === 'deposito' && t.status === 'Concluído')
      .reduce((sum, t) => sum + t.value, 0);
    
    const totalExpenses = transactions
      .filter(t => (t.type === 'saque' || t.type === 'transferencia') && t.status === 'Concluído')
      .reduce((sum, t) => sum + t.value, 0);
    
    const totalIncome = totalDeposits;
    const balance = totalDeposits - totalExpenses; // Saldo = ganhos - despesas
    
    return {
      totalIncome,
      totalExpenses,
      balance,
      transactionCount: transactions.length
    };
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="row g-3 mb-4">
      <div className="col-12 col-md-6 col-lg-3">
        <div className="app-card app-card-stat shadow-sm h-100">
          <div className="app-card-body p-3 p-lg-4">
            <h4 className="stats-type mb-1">Total de Ganhos</h4>
            <div className="stats-figure text-success">{formatCurrency(totals.totalIncome)}</div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="app-card app-card-stat shadow-sm h-100">
          <div className="app-card-body p-3 p-lg-4">
            <h4 className="stats-type mb-1">Total de Gastos</h4>
            <div className="stats-figure text-danger">{formatCurrency(totals.totalExpenses)}</div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="app-card app-card-stat shadow-sm h-100">
          <div className="app-card-body p-3 p-lg-4">
            <h4 className="stats-type mb-1">Saldo</h4>
            <div className={`stats-figure ${totals.balance >= 0 ? 'text-success' : 'text-danger'}`}>
              {formatCurrency(totals.balance)}
            </div>
          </div>
        </div>
      </div>

      <div className="col-12 col-md-6 col-lg-3">
        <div className="app-card app-card-stat shadow-sm h-100">
          <div className="app-card-body p-3 p-lg-4">
            <h4 className="stats-type mb-1">Transações</h4>
            <div className="stats-figure">{totals.transactionCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
