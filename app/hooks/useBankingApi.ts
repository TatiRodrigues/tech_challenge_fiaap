/**
 * Hook customizado para integração com API Bancária
 */

import { useCallback, useState } from 'react';
import { bankingApi } from '@/app/servicos/banking-api';
import {
  ITransaction,
  ICreateTransactionRequest,
  IUpdateTransactionRequest,
  IAccount,
  ICard,
} from '@/app/config/api-types';

export interface IUseBankingApi {
  // Estado
  transactions: ITransaction[];
  accounts: IAccount[];
  cards: ICard[];
  isLoading: boolean;
  error: string | null;

  // Métodos
  loadAccount: () => Promise<void>;
  createTransaction: (payload: ICreateTransactionRequest) => Promise<ITransaction>;
  updateTransaction: (
    transactionId: string,
    payload: IUpdateTransactionRequest
  ) => Promise<ITransaction>;
  deleteTransaction: (transactionId: string) => Promise<void>;
  getStatement: (accountId: string) => Promise<ITransaction[]>;
  clearError: () => void;
}

export const useBankingApi = (): IUseBankingApi => {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [cards, setCards] = useState<ICard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadAccount = useCallback(async () => {
    if (!bankingApi.isAuthenticated()) {
      setError('Não autenticado');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await bankingApi.getAccount();
      setAccounts(response.result.account);
      setTransactions(response.result.transactions);
      setCards(response.result.cards);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar conta');
      console.error('Error loading account:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTransaction = useCallback(
    async (payload: ICreateTransactionRequest): Promise<ITransaction> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await bankingApi.createTransaction(payload);
        const newTransaction = response.result;
        setTransactions((prev) => [newTransaction, ...prev]);
        return newTransaction;
      } catch (err: any) {
        const message = err.message || 'Erro ao criar transação';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const updateTransaction = useCallback(
    async (transactionId: string, payload: IUpdateTransactionRequest): Promise<ITransaction> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await bankingApi.updateTransaction(transactionId, payload);
        const updatedTransaction = response.result;
        setTransactions((prev) =>
          prev.map((t) => (t.id === transactionId ? updatedTransaction : t))
        );
        return updatedTransaction;
      } catch (err: any) {
        const message = err.message || 'Erro ao atualizar transação';
        setError(message);
        throw new Error(message);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteTransaction = useCallback(async (transactionId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await bankingApi.deleteTransaction(transactionId);
      setTransactions((prev) => prev.filter((t) => t.id !== transactionId));
    } catch (err: any) {
      const message = err.message || 'Erro ao deletar transação';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStatement = useCallback(async (accountId: string): Promise<ITransaction[]> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await bankingApi.getStatement(accountId);
      return response.result.transactions;
    } catch (err: any) {
      const message = err.message || 'Erro ao obter extrato';
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    transactions,
    accounts,
    cards,
    isLoading,
    error,
    loadAccount,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    getStatement,
    clearError,
  };
};
