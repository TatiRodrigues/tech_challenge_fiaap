/**
 * Exemplos Práticos: TypeScript Avançado
 * Demonstra genéricos, utility types e padrões avançados
 */

import { 
  AsyncState, 
  PaginatedResponse, 
  Result, 
  Versioned,
  DeepPartial,
  KeysOfType,
} from '@/types/advanced';

// ============ EXEMPLO 1: Genéricos com API ============

/**
 * Hook genérico para requisições HTTP
 * 
 * ✅ Type-safe: TypeScript garante que retorno é do tipo correto
 * ✅ Reutilizável: Funciona com qualquer tipo de dados
 * ✅ Claro: Fácil entender o que esperar
 */
export async function fetchData<T>(
  url: string,
  options?: RequestInit
): Promise<Result<T>> {
  try {
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = (await response.json()) as T;
    return { success: true, value: data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Unknown error'),
    };
  }
}

/**
 * Uso do genérico
 */
interface User {
  id: string;
  name: string;
  email: string;
}

async function loadUser(userId: string) {
  const result = await fetchData<User>(`/api/users/${userId}`);
  
  if (result.success) {
    console.log(result.value.name); // ✅ TypeScript sabe que é User
  } else {
    console.error(result.error.message);
  }
}

// ============ EXEMPLO 2: AsyncState com Estados Complexos ============

/**
 * Usar AsyncState<T> para gerenciar estados assíncronos
 */
interface TransactionAsyncState extends AsyncState<Transaction[]> {
  filters: {
    type?: string;
    dateRange?: [Date, Date];
  };
}

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
}

// ✅ Type-safe state
const transactionState: TransactionAsyncState = {
  data: [],
  isLoading: true,
  error: null,
  lastUpdated: null,
  filters: {
    type: 'deposito',
  },
};

// ============ EXEMPLO 3: Paginação Tipada ============

/**
 * API Response com paginação
 * 
 * Exemplo real do servidor:
 * {
 *   data: [{...}, {...}],
 *   total: 100,
 *   page: 1,
 *   pageSize: 10,
 *   totalPages: 10,
 *   hasNextPage: true,
 *   hasPreviousPage: false
 * }
 */
interface TransactionResponse extends PaginatedResponse<Transaction> {}

async function fetchTransactions(page: number = 1) {
  const result = await fetchData<TransactionResponse>(
    `/api/transactions?page=${page}`
  );

  if (result.success) {
    const { data, totalPages, hasNextPage } = result.value;
    
    console.log(`Página ${page} de ${totalPages}`);
    console.log(`Próxima página disponível: ${hasNextPage}`);
    
    data.forEach(tx => {
      console.log(`${tx.description}: R$ ${tx.amount}`);
    });
  }
}

// ============ EXEMPLO 4: DeepPartial para Atualizações Parciais ============

/**
 * Ao fazer PATCH request, você quer enviar apenas campos modificados
 */
interface CompleteUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
}

// ✅ Apenas os campos que você quer atualizar
type PartialUser = DeepPartial<CompleteUser>;

async function updateUser(userId: string, updates: PartialUser) {
  return fetch(`/api/users/${userId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: { 'Content-Type': 'application/json' },
  });
}

// ✅ Você pode fazer qualquer combinação dessas atualizações:
updateUser('user-1', {
  name: 'Novo Nome',
  address: { city: 'São Paulo' }, // Apenas city, sem street/country
});

// ============ EXEMPLO 5: KeysOfType para Type-Safe Access ============

/**
 * Acessar apenas campos de um tipo específico
 */
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  active: boolean;
}

// ✅ Obter apenas chaves numéricas
type NumericKeys = KeysOfType<Product, number>; // 'price' | 'stock'

// ✅ Obter apenas chaves string
type StringKeys = KeysOfType<Product, string>; // 'id' | 'name'

// ✅ Função type-safe para somar números
function sumFields<T, K extends KeysOfType<T, number>>(
  items: T[],
  field: K
): number {
  return items.reduce((sum, item) => sum + (item[field] as number), 0);
}

// ✅ Uso
const products: Product[] = [
  { id: '1', name: 'Produto A', price: 100, stock: 5, active: true },
  { id: '2', name: 'Produto B', price: 200, stock: 10, active: true },
];

const totalPrice = sumFields(products, 'price'); // ✅ Válido
const totalStock = sumFields(products, 'stock'); // ✅ Válido
// const totalName = sumFields(products, 'name'); // ❌ Erro! 'name' é string

// ============ EXEMPLO 6: Discriminated Union para Resultados ============

/**
 * Melhor que Result<T, E>, pois você pode fazer pattern matching
 */
type AsyncResult<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };

function handleResult<T>(result: AsyncResult<T>) {
  switch (result.status) {
    case 'idle':
      return <div>Aguardando...</div>;
    case 'loading':
      return <div>Carregando...</div>;
    case 'success':
      // ✅ TypeScript sabe que aqui existe 'data'
      return <div>{JSON.stringify(result.data)}</div>;
    case 'error':
      // ✅ TypeScript sabe que aqui existe 'error'
      return <div>Erro: {result.error}</div>;
  }
}

// ============ EXEMPLO 7: Versioning de Dados ============

/**
 * Rastrear histórico de mudanças
 */
type VersionedUser = Versioned<CompleteUser>;

const userHistory: VersionedUser = {
  current: {
    id: '1',
    name: 'João',
    email: 'joao@email.com',
    phone: '11999999999',
    address: { street: 'Rua A', city: 'SP', country: 'Brasil' },
  },
  previous: [
    {
      id: '1',
      name: 'João Silva',
      email: 'joaosilva@email.com',
      phone: '11988888888',
      address: { street: 'Rua B', city: 'Rio', country: 'Brasil' },
    },
  ],
  version: 2,
};

function rollbackToVersion(versionedData: VersionedUser, versionNumber: number) {
  if (versionNumber < 1 || versionNumber > versionedData.previous.length) {
    throw new Error('Versão inválida');
  }

  const previousVersion = versionedData.previous[versionNumber - 1];
  return previousVersion;
}

// ============ EXEMPLO 8: Builder Pattern Tipado ============

/**
 * Construir objetos complexos de forma type-safe
 */
class QueryBuilder<T> {
  private query: Partial<T> = {};

  addField<K extends keyof T>(field: K, value: T[K]): this {
    this.query[field] = value;
    return this;
  }

  build(): Partial<T> {
    return this.query;
  }
}

// ✅ Uso
const userQuery = new QueryBuilder<CompleteUser>()
  .addField('name', 'João')
  .addField('email', 'joao@email.com')
  // .addField('invalid', 'value'); // ❌ Erro! 'invalid' não existe em User
  .build();

// ============ EXEMPLO 9: Middleware Tipado ============

/**
 * Redux middleware completamente tipado
 */
type Middleware<S, A> = (state: S) => (action: A) => void;

interface AppState {
  auth: { isAuthenticated: boolean };
  transactions: { items: Transaction[] };
}

type AppAction = 
  | { type: 'LOGIN'; payload: { userId: string } }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'LOGOUT' };

// ✅ Type-safe middleware
const authMiddleware: Middleware<AppState, AppAction> = (state) => (action) => {
  if (action.type === 'LOGIN') {
    console.log(`User ${action.payload.userId} logged in`);
  } else if (action.type === 'ADD_TRANSACTION') {
    console.log(`Added transaction: ${action.payload.description}`);
  } else if (action.type === 'LOGOUT') {
    console.log('User logged out');
  }
};

// ============ EXEMPLO 10: Conditional Types ============

/**
 * Tipos que se comportam diferente baseado em condições
 */

// Extrair T de Promise<T>
type Awaited<T> = T extends Promise<infer U> ? U : T;

// ✅ Uso
type StringPromiseAwaited = Awaited<Promise<string>>; // string
type NumberAwaited = Awaited<number>; // number

// Extrair T de Array<T>
type Flatten<T> = T extends Array<infer U> ? U : T;

// ✅ Uso
type FlattenedNumbers = Flatten<number[]>; // number
type FlattenedSingle = Flatten<string>; // string

// ============ EXEMPLO 11: Mapped Types para DTOs ============

/**
 * Automaticamente criar tipos Readonly, Optional, etc
 */
interface UserForm {
  name: string;
  email: string;
  password: string;
}

// ✅ Torna tudo readonly
type ReadonlyUserForm = {
  readonly [K in keyof UserForm]: UserForm[K];
};

// ✅ Torna tudo opcional
type PartialUserForm = {
  [K in keyof UserForm]?: UserForm[K];
};

// ✅ Adiciona getters
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

type UserGetters = Getters<UserForm>;
// Resulta em:
// {
//   getName: () => string;
//   getEmail: () => string;
//   getPassword: () => string;
// }

// ============ EXEMPLO 12: Function Overloading ============

/**
 * Múltiplas assinaturas para uma função
 */
function formatValue(value: string): string;
function formatValue(value: number): string;
function formatValue(value: Date): string;

function formatValue(value: string | number | Date): string {
  if (value instanceof Date) {
    return value.toLocaleDateString('pt-BR');
  } else if (typeof value === 'number') {
    return `R$ ${(value / 100).toFixed(2)}`;
  } else {
    return value.toUpperCase();
  }
}

// ✅ TypeScript sabe o que retornar baseado no argumento
const dateStr = formatValue(new Date()); // string
const priceStr = formatValue(10000); // string
const textStr = formatValue('hello'); // string

export default {
  fetchData,
  loadUser,
  fetchTransactions,
  updateUser,
  handleResult,
  userHistory,
  rollbackToVersion,
  formatValue,
};
