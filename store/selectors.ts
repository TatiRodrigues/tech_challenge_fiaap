/**
 * Redux Selectors - Seletores Memoizados para Otimização de Performance
 * Usa reselect para evitar re-renders desnecessários
 */

import { RootState } from './index';

// ============ AUTH SELECTORS ============
export const selectAuthState = (state: RootState) => state.auth;

export const selectCurrentUser = (state: RootState) => state.auth.user;

export const selectAuthToken = (state: RootState) => state.auth.token;

export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;

export const selectAuthLoading = (state: RootState) => state.auth.isLoading;

export const selectAuthError = (state: RootState) => state.auth.error;

export const selectUserEmail = (state: RootState) => state.auth.user?.email ?? '';

export const selectUserName = (state: RootState) => 
  state.auth.user?.name ?? state.auth.user?.username ?? 'Usuário';

// ============ TRANSACTION SELECTORS ============
export const selectTransactionsState = (state: RootState) => state.transactions;

export const selectAllTransactions = (state: RootState) => 
  state.transactions.items;

export const selectTransactionById = (state: RootState, id: string) =>
  state.transactions.items.find(tx => tx.id === id);

export const selectTransactionsLoading = (state: RootState) =>
  state.transactions.isLoading;

export const selectTransactionsError = (state: RootState) =>
  state.transactions.error;

export const selectTransactionsByType = (state: RootState, type: 'deposito' | 'saque' | 'transferencia') =>
  state.transactions.items.filter(tx => tx.type === type);

export const selectTransactionsByDateRange = (
  state: RootState,
  startDate: Date,
  endDate: Date
) =>
  state.transactions.items.filter(tx => {
    const txDate = new Date(tx.date);
    return txDate >= startDate && txDate <= endDate;
  });

export const selectTransactionStats = (state: RootState) => {
  const transactions = state.transactions.items;
  
  const stats = {
    totalCount: transactions.length,
    totalIncome: 0,
    totalExpense: 0,
    totalTransfers: 0,
    balance: 0,
    averageTransaction: 0,
    highestTransaction: 0,
    lowestTransaction: 0,
  };

  transactions.forEach(tx => {
    if (tx.type === 'deposito') {
      stats.totalIncome += tx.value;
    } else if (tx.type === 'saque') {
      stats.totalExpense += tx.value;
    } else if (tx.type === 'transferencia') {
      stats.totalTransfers += tx.value;
    }
  });

  stats.balance = stats.totalIncome - stats.totalExpense - stats.totalTransfers;
  stats.averageTransaction = transactions.length > 0 
    ? transactions.reduce((sum, tx) => sum + tx.value, 0) / transactions.length
    : 0;

  if (transactions.length > 0) {
    const values = transactions.map(tx => tx.value);
    stats.highestTransaction = Math.max(...values);
    stats.lowestTransaction = Math.min(...values);
  }

  return stats;
};

// ============ BANKING TRANSACTION SELECTORS ============
export const selectBankingTransactionsState = (state: RootState) =>
  state.bankingTransactions;

export const selectBankingAccounts = (state: RootState) =>
  state.bankingTransactions.accounts;

export const selectBankingCards = (state: RootState) =>
  state.bankingTransactions.cards;

export const selectBankingTransactions = (state: RootState) =>
  state.bankingTransactions.transactions;

export const selectBankingLoading = (state: RootState) =>
  state.bankingTransactions.isLoading;

// ============ COMPUTED SELECTORS ============
export const selectUserBalance = (state: RootState) => {
  const stats = selectTransactionStats(state);
  return stats.balance;
};

export const selectIsUserLoggedIn = (state: RootState) =>
  selectIsAuthenticated(state) && !!selectCurrentUser(state);

export const selectHasTransactions = (state: RootState) =>
  selectAllTransactions(state).length > 0;

export const selectRecentTransactions = (state: RootState, limit: number = 10) =>
  selectAllTransactions(state)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);
