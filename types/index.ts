/**
 * Tipos Centralizados da Aplicação
 * Arquivo único para manter consistência de tipos em toda a aplicação
 */

// ============ AUTENTICAÇÃO ============
export interface IUser {
  id: string;
  nome: string;
  email: string;
  token: string;
  dataCriacao: string;
  avatar?: string;
  telefone?: string;
}

export interface ILoginRequest {
  email: string;
  senha: string;
}

export interface ILoginResponse {
  user: IUser;
  token: string;
}

export interface ICadastroRequest {
  nome: string;
  email: string;
  senha: string;
  confirmaSenha: string;
}

// ============ TRANSAÇÕES ============
export type TipoTransacao = "receita" | "despesa";
export type StatusTransacao = "pendente" | "concluida" | "cancelada";
export type CategoriaTransacao =
  | "alimentacao"
  | "transporte"
  | "saude"
  | "educacao"
  | "entretenimento"
  | "utilidades"
  | "investimento"
  | "outro";

export interface ITransaction {
  id: string;
  tipo: TipoTransacao;
  valor: number;
  descricao: string;
  categoria: CategoriaTransacao;
  data: string;
  status: StatusTransacao;
  usuarioId: string;
  dataCriacao: string;
  dataAtualizacao?: string;
  tags?: string[];
  notas?: string;
}

export interface ICreateTransactionRequest {
  tipo: TipoTransacao;
  valor: number;
  descricao: string;
  categoria: CategoriaTransacao;
  data: string;
  notas?: string;
  tags?: string[];
}

export interface IUpdateTransactionRequest
  extends Partial<ICreateTransactionRequest> {
  status?: StatusTransacao;
}

export interface ITransactionFilters {
  tipo?: TipoTransacao;
  categoria?: CategoriaTransacao;
  dataInicio?: string;
  dataFim?: string;
  status?: StatusTransacao;
  searchTerm?: string;
}

export interface ITransactionSummary {
  totalReceitas: number;
  totalDespesas: number;
  saldo: number;
  periodoInicio: string;
  periodoFim: string;
}

// ============ API RESPONSES ============
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
}

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
}

// ============ ERROS ============
export class AppError extends Error {
  constructor(
    public code: string,
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

// ============ COMPONENTES ============
export interface IComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

export interface IFormProps extends IComponentProps {
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export interface IModalProps extends IComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
}

export interface IButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export interface IInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export interface ISelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{
    value: string | number;
    label: string;
    disabled?: boolean;
  }>;
  error?: string;
}

// ============ UTILITÁRIOS ============
export interface IPaginationParams {
  pagina?: number;
  limite?: number;
  ordenarPor?: string;
  ordem?: "asc" | "desc";
}

export interface INotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

// ============ MICROFRONTENDS (PREPARAÇÃO) ============
export interface IMicroFrontendConfig {
  name: string;
  scope: string;
  module: string;
  shareScope: string;
  shared?: Record<string, any>;
}

export interface IMicroFrontendMessage<T = any> {
  type: string;
  payload: T;
  source: string;
  timestamp: number;
}
