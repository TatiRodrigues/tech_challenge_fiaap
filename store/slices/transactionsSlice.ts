import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Anexo {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  dataCriacao: string;
}

export interface Transaction {
  value: number;
  date: string | number | Date;
  type: string;
  id: string;
  tipo: "receita" | "despesa";
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
  status: "pendente" | "concluida" | "cancelada";
  usuarioId: string;
  dataCriacao: string;
  anexos?: Anexo[];
}

export interface TransactionFilters {
  tipo?: "receita" | "despesa";
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: "pendente" | "concluida" | "cancelada";
  valorMinimo?: number;
  valorMaximo?: number;
  searchTerm?: string;
}

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SortState {
  field: "data" | "valor" | "descricao";
  order: "asc" | "desc";
}

export interface TransactionsState {
  items: Transaction[];
  filteredItems: Transaction[];
  paginatedItems: Transaction[];
  isLoading: boolean;
  error: string | null;
  filters: TransactionFilters;
  pagination: PaginationState;
  sort: SortState;
  selectedTransaction: Transaction | null;
  totalReceitas: number;
  totalDespesas: number;
}

const initialState: TransactionsState = {
  items: [],
  filteredItems: [],
  paginatedItems: [],
  isLoading: false,
  error: null,
  filters: {},
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },
  sort: {
    field: "data",
    order: "desc",
  },
  selectedTransaction: null,
  totalReceitas: 0,
  totalDespesas: 0,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.items = action.payload;
      state.filteredItems = action.payload;
      state.isLoading = false;
      state.error = null;
      calculateTotals(state);
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload);
      state.filteredItems.unshift(action.payload);
      calculateTotals(state);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
        const filteredIndex = state.filteredItems.findIndex(
          (t) => t.id === action.payload.id
        );
        if (filteredIndex !== -1) {
          state.filteredItems[filteredIndex] = action.payload;
        }
        calculateTotals(state);
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
      state.filteredItems = state.filteredItems.filter(
        (t) => t.id !== action.payload
      );
      calculateTotals(state);
    },
    setFilters: (state, action: PayloadAction<TransactionFilters>) => {
      state.filters = action.payload;
      applyFilters(state);
    },
    clearFilters: (state) => {
      state.filters = {};
      state.filteredItems = state.items;
    },
    setSelectedTransaction: (state, action: PayloadAction<Transaction | null>) => {
      state.selectedTransaction = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
      updatePaginatedItems(state);
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1;
      updatePaginatedItems(state);
    },
    setSort: (state, action: PayloadAction<SortState>) => {
      state.sort = action.payload;
      applyFilters(state);
    },
    addAttachment: (state, action: PayloadAction<{ transactionId: string; attachment: Anexo }>) => {
      const transaction = state.items.find((t) => t.id === action.payload.transactionId);
      if (transaction) {
        if (!transaction.anexos) {
          transaction.anexos = [];
        }
        transaction.anexos.push(action.payload.attachment);
      }
    },
    removeAttachment: (state, action: PayloadAction<{ transactionId: string; attachmentId: string }>) => {
      const transaction = state.items.find((t) => t.id === action.payload.transactionId);
      if (transaction && transaction.anexos) {
        transaction.anexos = transaction.anexos.filter((a) => a.id !== action.payload.attachmentId);
      }
    },
  },
});

const calculateTotals = (state: TransactionsState) => {
  state.totalReceitas = state.filteredItems
    .filter((t) => t.tipo === "receita" && t.status === "concluida")
    .reduce((sum, t) => sum + t.valor, 0);

  state.totalDespesas = state.filteredItems
    .filter((t) => t.tipo === "despesa" && t.status === "concluida")
    .reduce((sum, t) => sum + t.valor, 0);
};

const applyFilters = (state: TransactionsState) => {
  let filtered = [...state.items];

  if (state.filters.tipo) {
    filtered = filtered.filter((t) => t.tipo === state.filters.tipo);
  }

  if (state.filters.categoria) {
    filtered = filtered.filter(
      (t) => t.categoria === state.filters.categoria
    );
  }

  if (state.filters.status) {
    filtered = filtered.filter(
      (t) => t.status === state.filters.status
    );
  }

  if (state.filters.dataInicio) {
    const startDate = new Date(state.filters.dataInicio);
    startDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter(
      (t) => new Date(t.data) >= startDate
    );
  }

  if (state.filters.dataFim) {
    const endDate = new Date(state.filters.dataFim);
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter(
      (t) => new Date(t.data) <= endDate
    );
  }

  if (state.filters.valorMinimo !== undefined) {
    filtered = filtered.filter((t) => t.valor >= state.filters.valorMinimo!);
  }

  if (state.filters.valorMaximo !== undefined) {
    filtered = filtered.filter((t) => t.valor <= state.filters.valorMaximo!);
  }

  if (state.filters.searchTerm && state.filters.searchTerm.trim()) {
    const searchLower = state.filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.descricao.toLowerCase().includes(searchLower) ||
        t.categoria.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (state.sort.field === "data") {
    filtered.sort((a, b) => {
      const aDate = new Date(a.data).getTime();
      const bDate = new Date(b.data).getTime();
      return state.sort.order === "asc" ? aDate - bDate : bDate - aDate;
    });
  } else if (state.sort.field === "valor") {
    filtered.sort((a, b) =>
      state.sort.order === "asc" ? a.valor - b.valor : b.valor - a.valor
    );
  } else if (state.sort.field === "descricao") {
    filtered.sort((a, b) => {
      const comparison = a.descricao.localeCompare(b.descricao);
      return state.sort.order === "asc" ? comparison : -comparison;
    });
  }

  state.filteredItems = filtered;
  state.pagination.totalItems = filtered.length;
  state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.pageSize);
  state.pagination.currentPage = 1;
  updatePaginatedItems(state);
  calculateTotals(state);
};

const updatePaginatedItems = (state: TransactionsState) => {
  const startIndex = (state.pagination.currentPage - 1) * state.pagination.pageSize;
  const endIndex = startIndex + state.pagination.pageSize;
  state.paginatedItems = state.filteredItems.slice(startIndex, endIndex);
};

export const {
  setLoading,
  setTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  clearFilters,
  setSelectedTransaction,
  setError,
  setPage,
  setPageSize,
  setSort,
  addAttachment,
  removeAttachment,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
