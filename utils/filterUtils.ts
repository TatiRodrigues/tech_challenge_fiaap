/**
 * Utilities for advanced filtering and searching transactions
 */

export interface ITransaction {
  id: string;
  tipo: "receita" | "despesa";
  valor: number;
  descricao: string;
  categoria: string;
  data: string;
  status: "pendente" | "concluida" | "cancelada";
  usuarioId: string;
  dataCriacao: string;
  anexos?: IAnexo[];
}

export interface IAnexo {
  id: string;
  nome: string;
  url: string;
  tipo: string;
  tamanho: number;
  dataCriacao: string;
}

export interface IFilterOptions {
  tipo?: "receita" | "despesa";
  categoria?: string;
  dataInicio?: string;
  dataFim?: string;
  status?: "pendente" | "concluida" | "cancelada";
  valorMinimo?: number;
  valorMaximo?: number;
  searchTerm?: string;
}

export interface IPaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Filter transactions based on provided filter options
 */
export const filterTransactions = (
  transactions: ITransaction[],
  filters: IFilterOptions
): ITransaction[] => {
  let filtered = [...transactions];

  // Filtro por tipo
  if (filters.tipo) {
    filtered = filtered.filter((t) => t.tipo === filters.tipo);
  }

  // Filtro por categoria
  if (filters.categoria) {
    filtered = filtered.filter((t) => t.categoria === filters.categoria);
  }

  // Filtro por status
  if (filters.status) {
    filtered = filtered.filter((t) => t.status === filters.status);
  }

  // Filtro por data inicial
  if (filters.dataInicio) {
    const startDate = new Date(filters.dataInicio);
    startDate.setHours(0, 0, 0, 0);
    filtered = filtered.filter((t) => new Date(t.data) >= startDate);
  }

  // Filtro por data final
  if (filters.dataFim) {
    const endDate = new Date(filters.dataFim);
    endDate.setHours(23, 59, 59, 999);
    filtered = filtered.filter((t) => new Date(t.data) <= endDate);
  }

  // Filtro por valor mínimo
  if (filters.valorMinimo !== undefined) {
    filtered = filtered.filter((t) => t.valor >= filters.valorMinimo!);
  }

  // Filtro por valor máximo
  if (filters.valorMaximo !== undefined) {
    filtered = filtered.filter((t) => t.valor <= filters.valorMaximo!);
  }

  // Busca por termo
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        t.descricao.toLowerCase().includes(searchLower) ||
        t.categoria.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

/**
 * Sort transactions by specified field
 */
export const sortTransactions = (
  transactions: ITransaction[],
  sortBy: "data" | "valor" | "descricao",
  order: "asc" | "desc" = "desc"
): ITransaction[] => {
  const sorted = [...transactions];

  sorted.sort((a, b) => {
    let aVal: any = a[sortBy as keyof ITransaction];
    let bVal: any = b[sortBy as keyof ITransaction];

    if (sortBy === "data") {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    } else if (sortBy === "valor") {
      aVal = parseFloat(String(aVal));
      bVal = parseFloat(String(bVal));
    }

    if (order === "asc") {
      return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
    } else {
      return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
    }
  });

  return sorted;
};

/**
 * Paginate transactions
 */
export const paginateTransactions = (
  transactions: ITransaction[],
  page: number,
  pageSize: number
): { items: ITransaction[]; pagination: IPaginationState } => {
  const totalItems = transactions.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const items = transactions.slice(startIndex, endIndex);

  return {
    items,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
    },
  };
};

/**
 * Get pagination info for current state
 */
export const getPaginationInfo = (
  currentPage: number,
  pageSize: number,
  totalItems: number
): { start: number; end: number; totalPages: number; hasNext: boolean; hasPrev: boolean } => {
  const totalPages = Math.ceil(totalItems / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  return {
    start,
    end,
    totalPages,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
  };
};
