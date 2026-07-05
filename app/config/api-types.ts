/**
 * Tipos e Interfaces da API Bancária
 * Correspondem à API tech-challenge-2
 */

// ============ AUTENTICAÇÃO ============
export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IRegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
}

export interface IAuthResponse {
  message: string;
  result: {
    token: string;
    user?: IUser;
  };
}

export interface IUserResponse {
  message: string;
  result: IUser;
}

// ============ CONTAS ============
export interface IAccount {
  id: string;
  type: 'Debit' | 'Credit';
  userId: string;
}

export interface ICard {
  id: string;
  accountId: string;
  type: 'Debit' | 'Credit';
  is_blocked: boolean;
  number: string;
  dueDate: string;
  functions: string;
  cvc: string;
  paymentDate: string | null;
  name: string;
}

// ============ TRANSAÇÕES ============
export interface ITransaction {
  id: string;
  accountId: string;
  type: 'Credit' | 'Debit';
  value: number;
  from?: string;
  to?: string;
  anexo?: string;
  date: string;
}

export interface ICreateTransactionRequest {
  accountId: string;
  type: 'Credit' | 'Debit';
  value: number;
  from?: string;
  to?: string;
  anexo?: string;
}

export interface IUpdateTransactionRequest {
  type?: 'Credit' | 'Debit';
  value?: number;
  from?: string;
  to?: string;
  anexo?: string;
}

// ============ RESPOSTAS ============
export interface IAccountResponse {
  message: string;
  result: {
    account: IAccount[];
    transactions: ITransaction[];
    cards: ICard[];
  };
}

export interface ITransactionResponse {
  message: string;
  result: ITransaction;
}

export interface IStatementResponse {
  message: string;
  result: {
    transactions: ITransaction[];
  };
}

export interface IApiError {
  message: string;
  status?: number;
  data?: any;
}
