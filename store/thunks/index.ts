import { createAsyncThunk } from "@reduxjs/toolkit";
import { bankingApi } from "@/app/servicos/banking-api";
import {
  ILoginRequest,
  IRegisterRequest,
  ICreateTransactionRequest,
  IUpdateTransactionRequest,
} from "@/app/config/api-types";

// ============ AUTENTICAÇÃO ============

export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload: ILoginRequest, { rejectWithValue }) => {
    try {
      const response = await bankingApi.login(payload);
      const token = response.result.token;
      
      // User pode não estar na resposta, então criar um object básico
      let user = response.result.user;
      if (!user) {
        user = {
          id: 'temp-' + Date.now(),
          email: payload.email,
          username: payload.email.split('@')[0],
          password: '',
        };
      }
      
      console.log('[loginUser thunk] Storing user:', user);
      
      // Salvar user em localStorage
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      return {
        token,
        user,
      };
    } catch (error: any) {
      console.log('[loginUser thunk] Error:', error);
      return rejectWithValue(error.message || "Erro ao fazer login");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: IRegisterRequest, { rejectWithValue }) => {
    try {
      const response = await bankingApi.register(payload);
      const user = response.result;
      
      // Salvar user em localStorage
      if (typeof window !== 'undefined' && user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      return {
        token: null,
        user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao registrar");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await bankingApi.logout();
      return null;
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao fazer logout");
    }
  }
);

// ============ CONTAS ============

export const fetchAccount = createAsyncThunk(
  "account/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bankingApi.getAccount();
      return {
        accounts: response.result.account,
        transactions: response.result.transactions,
        cards: response.result.cards,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao carregar conta");
    }
  }
);

// ============ TRANSAÇÕES ============

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (payload: ICreateTransactionRequest, { rejectWithValue }) => {
    try {
      const response = await bankingApi.createTransaction(payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao criar transação");
    }
  }
);

export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async (
    {
      transactionId,
      payload,
    }: { transactionId: string; payload: IUpdateTransactionRequest },
    { rejectWithValue }
  ) => {
    try {
      const response = await bankingApi.updateTransaction(transactionId, payload);
      return response.result;
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao atualizar transação");
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (transactionId: string, { rejectWithValue }) => {
    try {
      await bankingApi.deleteTransaction(transactionId);
      return transactionId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao deletar transação");
    }
  }
);

export const fetchStatement = createAsyncThunk(
  "transactions/fetchStatement",
  async (accountId: string, { rejectWithValue }) => {
    try {
      const response = await bankingApi.getStatement(accountId);
      return response.result.transactions;
    } catch (error: any) {
      return rejectWithValue(error.message || "Erro ao carregar extrato");
    }
  }
);
