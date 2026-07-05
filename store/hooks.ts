import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * Hooks do Redux com tipagem correta
 * Use esses ao invés de useDispatch e useSelector diretamente
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Hooks específicos para autenticação
 */
export const useAuth = () => {
  return useAppSelector((state) => state.auth);
};

export const useAuthUser = () => {
  return useAppSelector((state) => state.auth.user);
};

export const useIsAuthenticated = () => {
  return useAppSelector((state) => state.auth.isAuthenticated);
};

/**
 * Hooks específicos para transações
 */
export const useTransactions = () => {
  return useAppSelector((state) => state.transactions);
};

export const useTransactionsFiltered = () => {
  return useAppSelector((state) => state.transactions.filteredItems);
};

export const useTransactionTotals = () => {
  return useAppSelector((state) => ({
    receitas: state.transactions.totalReceitas,
    despesas: state.transactions.totalDespesas,
    saldo:
      state.transactions.totalReceitas - state.transactions.totalDespesas,
  }));
};

export const useSelectedTransaction = () => {
  return useAppSelector((state) => state.transactions.selectedTransaction);
};
