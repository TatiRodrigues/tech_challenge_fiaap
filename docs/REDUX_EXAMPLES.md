/**
 * Exemplo Prático: Usando Redux Avançado com Selectors
 * Demonstra padrões recomendados e best practices
 */

import React from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectTransactionStats,
  selectUserBalance,
  selectRecentTransactions,
  selectIsUserLoggedIn,
} from '@/store/selectors';

/**
 * Exemplo 1: Dashboard com Selectors Memoizados
 * 
 * ✅ Performance: Componente apenas re-renda se selectUserBalance mudar
 * ✅ Readabilidade: Nome do selector deixa claro o que está sendo selecionado
 * ✅ Manutenibilidade: Lógica centralizada em um lugar
 */
export function DashboardWithSelectors() {
  // ✅ BOM: Usar selector memoizado
  const userBalance = useAppSelector(selectUserBalance);
  const stats = useAppSelector(selectTransactionStats);
  const recentTransactions = useAppSelector(selectRecentTransactions);

  return (
    <div className="dashboard">
      <div className="card balance">
        <h2>Saldo Total</h2>
        <p className="amount">R$ {(userBalance / 100).toFixed(2)}</p>
      </div>

      <div className="card stats">
        <h3>Resumo</h3>
        <p>Receitas: R$ {(stats.totalIncome / 100).toFixed(2)}</p>
        <p>Despesas: R$ {(stats.totalExpense / 100).toFixed(2)}</p>
        <p>Transferências: R$ {(stats.totalTransfers / 100).toFixed(2)}</p>
      </div>

      <div className="card recent">
        <h3>Transações Recentes</h3>
        <ul>
          {recentTransactions.map((tx) => (
            <li key={tx.id}>
              {tx.description} - R$ {(tx.value / 100).toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * ❌ ANTI-PADRÃO: Não fazer assim
 * 
 * Problemas:
 * - Re-renda em TODA mudança de estado
 * - Lógica espalhada pelo componente
 * - Difícil de testar
 */
export function DashboardBadExample() {
  const state = useAppSelector((state) => state); // ❌ Re-renda em QUALQUER mudança

  // ❌ Lógica complexa dentro do componente
  const balance =
    state.transactions.items.reduce(
      (sum, tx) => sum + (tx.type === 'deposito' ? tx.value : -tx.value),
      0
    ) - state.transactions.items.reduce(
      (sum, tx) => sum + (tx.type === 'transferencia' ? tx.value : 0),
      0
    );

  return <div>Saldo: R$ {(balance / 100).toFixed(2)}</div>;
}

/**
 * Exemplo 2: Componente com Proteção de Rota usando Selectors
 */
export function ProtectedComponent() {
  const isLoggedIn = useAppSelector(selectIsUserLoggedIn);
  const currentUser = useAppSelector(selectCurrentUser);

  if (!isLoggedIn) {
    return <div>Por favor, faça login</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {currentUser?.name || 'Usuário'}!</h1>
      <p>Email: {currentUser?.email}</p>
    </div>
  );
}

/**
 * Exemplo 3: Filtrar Transações por Tipo usando Selector
 */
export function TransactionsByType() {
  const [type, setType] = React.useState<'deposito' | 'saque' | 'transferencia'>(
    'deposito'
  );

  // ✅ Selector recalcula apenas quando type muda
  const filteredTransactions = useAppSelector((state) =>
    state.transactions.items.filter((tx) => tx.type === type)
  );

  return (
    <div>
      <select value={type} onChange={(e) => setType(e.target.value as any)}>
        <option value="deposito">Depósitos</option>
        <option value="saque">Saques</option>
        <option value="transferencia">Transferências</option>
      </select>

      <ul>
        {filteredTransactions.map((tx) => (
          <li key={tx.id}>{tx.description}</li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Exemplo 4: Middleware Logger em Ação
 * 
 * Saída no console:
 * [Redux] auth/loginUser/fulfilled
 * Previous State: { auth: { isAuthenticated: false, user: null } }
 * Action: { type: 'auth/loginUser/fulfilled', payload: { user: {...} } }
 * Next State: { auth: { isAuthenticated: true, user: {...} } }
 */
export function MiddlewareExample() {
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    // Quando dispatch é chamado, o middleware logger registra tudo
    // Veja o console do browser para ver os logs
    // dispatch(loginUser({ email: 'user@test.com', password: 'pass' }));
  };

  return (
    <button onClick={handleLogin}>
      Login (verifique console para middleware logs)
    </button>
  );
}

/**
 * Exemplo 5: Usando Selectors em Custom Hooks
 */
export function useUserBalance() {
  const balance = useAppSelector(selectUserBalance);
  const isLoading = useAppSelector((state) => state.transactions.isLoading);

  return { balance, isLoading };
}

/**
 * Usando o custom hook
 */
export function BalanceDisplay() {
  const { balance, isLoading } = useUserBalance();

  if (isLoading) return <div>Carregando...</div>;

  return <div>Saldo: R$ {(balance / 100).toFixed(2)}</div>;
}

/**
 * Exemplo 6: Memoização com useMemo + Selectors
 * 
 * Caso de uso: Quando você precisa fazer cálculos adicionais
 * sobre dados do Redux
 */
export function AdvancedStatsComponent() {
  const stats = useAppSelector(selectTransactionStats);

  // ✅ Memoizar cálculos derivados
  const advancedStats = React.useMemo(
    () => ({
      ...stats,
      savingsRate: stats.totalIncome > 0
        ? ((stats.totalIncome - stats.totalExpense) / stats.totalIncome) * 100
        : 0,
      averageMonthlyBalance: stats.balance / 12,
    }),
    [stats]
  );

  return (
    <div>
      <p>Taxa de Economia: {advancedStats.savingsRate.toFixed(1)}%</p>
      <p>Média Mensal: R$ {(advancedStats.averageMonthlyBalance / 100).toFixed(2)}</p>
    </div>
  );
}

/**
 * Exemplo 7: Testando Selectors (Unit Test)
 * 
 * Exemplo com Jest:
 */
export const selectorTestExample = `
import { selectUserBalance, selectTransactionStats } from '@/store/selectors';

describe('Redux Selectors', () => {
  const mockState = {
    transactions: {
      items: [
        { id: '1', type: 'deposito', value: 10000 },
        { id: '2', type: 'saque', value: 5000 },
      ],
    },
  };

  it('should calculate user balance correctly', () => {
    const balance = selectUserBalance(mockState as any);
    expect(balance).toBe(5000); // 10000 - 5000
  });

  it('should calculate stats correctly', () => {
    const stats = selectTransactionStats(mockState as any);
    expect(stats.totalIncome).toBe(10000);
    expect(stats.totalExpense).toBe(5000);
  });
});
`;

/**
 * Exemplo 8: Performance Monitoring
 * 
 * Para monitorar quantas vezes um componente re-renda:
 */
export function PerformanceMonitor() {
  const renderCount = React.useRef(0);
  const stats = useAppSelector(selectTransactionStats);

  React.useEffect(() => {
    renderCount.current += 1;
    console.log(`DashboardWithSelectors re-renderizou ${renderCount.current} vezes`);
  });

  return (
    <div>
      <p>Render Count: {renderCount.current}</p>
      <p>Stats: {JSON.stringify(stats)}</p>
    </div>
  );
}

export default {
  DashboardWithSelectors,
  ProtectedComponent,
  TransactionsByType,
  BalanceDisplay,
  AdvancedStatsComponent,
};
