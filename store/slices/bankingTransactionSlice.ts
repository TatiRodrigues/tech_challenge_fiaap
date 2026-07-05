import { createSlice } from "@reduxjs/toolkit";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  fetchStatement,
  fetchAccount,
} from "@/store/thunks";
import { ITransaction, IAccount, ICard } from "@/app/config/api-types";

export interface TransactionState {
  transactions: any;
  items: ITransaction[];
  accounts: IAccount[];
  cards: ICard[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TransactionState = {
  transactions: null,
  items: [],
  accounts: [],
  cards: [],
  isLoading: false,
  error: null,
};

const bankingTransactionSlice = createSlice({
  name: "bankingTransactions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Account
    builder
      .addCase(fetchAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAccount.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.transactions;
        state.accounts = action.payload.accounts;
        state.cards = action.payload.cards;
      })
      .addCase(fetchAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Transaction
    builder
      .addCase(createTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Transaction
    builder
      .addCase(updateTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.items.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Transaction
    builder
      .addCase(deleteTransaction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((t) => t.id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Statement
    builder
      .addCase(fetchStatement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStatement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchStatement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = bankingTransactionSlice.actions;
export default bankingTransactionSlice.reducer;
