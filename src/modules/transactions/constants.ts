import type { TransactionsListParams } from '../../services/transactions/types';

export const defaultTransactionsListParams: TransactionsListParams = {
  skip: 0,
  limit: 50,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};
