export enum TxType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

export interface TransactionDTO {
  id: string;
  userId: string;
  type: TxType;
  amount: number;
  category: string;
  tags: string[];
  occurredAt: string; // ISO string
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ListTransactionsResponse {
  data: TransactionDTO[];
  page: number;
  pageSize: number;
}

export type CreateTransactionBody = Omit<
  TransactionDTO,
  'id' | 'createdAt' | 'updatedAt' | 'userId'
>;
export type CreateTransactionResponse = TransactionDTO;
export type DeleteTransactionResponse = void;
