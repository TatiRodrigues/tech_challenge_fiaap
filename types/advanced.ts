/**
 * Tipos TypeScript Avançados - Genéricos, Utilidades e Patterns
 * Inclui: Genéricos, Conditionals, Mapped Types, Utility Types
 */

// ============ GENÉRICOS UTILITÁRIOS ============

/**
 * Tipo genérico para API Response com paginação
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Tipo genérico para Async Request State
 */
export interface AsyncState<T, E = string> {
  data: T | null;
  isLoading: boolean;
  error: E | null;
  lastUpdated: Date | null;
}

/**
 * Tipo genérico para Entity com timestamps
 */
export type TimestampedEntity<T extends Record<string, any>> = T & {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};

/**
 * Tipo genérico para versioned data
 */
export interface Versioned<T> {
  current: T;
  previous: T[];
  version: number;
}

// ============ UTILITY TYPES ============

/**
 * Extrai values de um tipo
 */
export type ValueOf<T> = T[keyof T];

/**
 * Torna todas as propriedades readonly recursivamente
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? DeepReadonly<T[P]>
    : T[P];
};

/**
 * Torna todas as propriedades opcionais recursivamente
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};

/**
 * Extrai apenas as chaves que têm um tipo específico
 */
export type KeysOfType<T, U> = {
  [P in keyof T]: T[P] extends U ? P : never;
}[keyof T];

/**
 * Cria um tipo onde algumas chaves são obrigatórias
 */
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Cria um tipo onde algumas chaves são opcionais
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Tipo para função com efeitos colaterais
 */
export type Effect = () => void | (() => void);

// ============ ENUM TYPES ============

export enum TransactionType {
  INCOME = 'deposito',
  EXPENSE = 'saque',
  TRANSFER = 'transferencia',
}

export enum TransactionStatus {
  PENDING = 'pendente',
  COMPLETED = 'completa',
  CANCELLED = 'cancelada',
  FAILED = 'falha',
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

// ============ DISCRIMINATED UNIONS ============

/**
 * Padrão Discriminated Union para resultados
 */
export type Result<T, E = Error> =
  | { success: true; value: T }
  | { success: false; error: E };

/**
 * Discriminated Union para estados assíncronos
 */
export type AsyncResult<T, E = string> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };

/**
 * Discriminated Union para notificações
 */
export type Notification =
  | { type: 'success'; message: string; id?: string }
  | { type: 'error'; message: string; id?: string }
  | { type: 'warning'; message: string; id?: string }
  | { type: 'info'; message: string; id?: string };

// ============ HANDLER TYPES ============

/**
 * Tipos para handlers de eventos customizados
 */
export type EventHandler<T = any> = (event: T) => void | Promise<void>;

export type AsyncEventHandler<T = any> = (event: T) => Promise<void>;

export type ValidationHandler<T> = (value: T) => boolean | string | Promise<boolean | string>;

/**
 * Tipo para middleware Redux
 */
export type ReduxMiddleware<T = any> = (
  store: any
) => (next: any) => (action: T) => any;

// ============ FORM TYPES ============

/**
 * Tipo genérico para Form State
 */
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

/**
 * Tipo genérico para Form Field
 */
export interface FormField<T> {
  name: keyof T;
  value: any;
  error?: string;
  touched: boolean;
  isDirty: boolean;
}

/**
 * Validador genérico
 */
export interface Validator<T> {
  (value: T): boolean | string;
}

// ============ HOOK TYPES ============

/**
 * Tipo para hook de estado com persistência
 */
export interface PersistentState<T> {
  value: T;
  save: (value: T) => Promise<void>;
  load: () => Promise<T>;
  clear: () => Promise<void>;
}

/**
 * Tipo para hook de cache
 */
export interface CacheOptions {
  ttl?: number; // Time to live em ms
  key: string;
}

// ============ COMPONENT TYPES ============

/**
 * Props base para todos os componentes
 */
export interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  'data-testid'?: string;
  'aria-label'?: string;
}

/**
 * Props com estado controlado
 */
export interface ControlledComponentProps<T> extends BaseComponentProps {
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

/**
 * Props de um componente com renderização customizável
 */
export interface RenderableComponentProps<T> extends BaseComponentProps {
  render?: (item: T) => React.ReactNode;
  children?: (item: T) => React.ReactNode;
}

// ============ CONDITIONAL TYPES ============

/**
 * Tipo condicional para extrair T de Promise<T>
 */
export type Awaited<T> = T extends Promise<infer U>
  ? U
  : T extends PromiseLike<infer U>
  ? U
  : T;

/**
 * Tipo condicional para extrair T de Array<T>
 */
export type Flatten<T> = T extends Array<infer U> ? U : T;

/**
 * Tipo condicional para função
 */
export type IsFunction<T> = T extends Function ? true : false;

// ============ ADVANCED PATTERNS ============

/**
 * Builder Pattern Type
 */
export interface Builder<T> {
  build(): T;
}

/**
 * Observable Pattern Type
 */
export interface Observable<T> {
  subscribe(observer: Observer<T>): Unsubscribable;
}

export interface Observer<T> {
  next(value: T): void;
  error(error: Error): void;
  complete(): void;
}

export interface Unsubscribable {
  unsubscribe(): void;
}

/**
 * Adapter Pattern Type
 */
export interface Adapter<T, U> {
  adapt(item: T): U;
  unadapt(item: U): T;
}

/**
 * Strategy Pattern Type
 */
export type Strategy<T, R> = (input: T) => R;

// ============ DECORATORS (Experimental) ============

/**
 * Type para função decoradora
 */
export type Decorator<T extends Function> = (target: T) => T;

/**
 * Type para property decorator
 */
export type PropertyDecorator = (
  target: any,
  propertyKey: string | symbol
) => void;

export type MethodDecorator = (
  target: any,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
) => PropertyDescriptor | void;
