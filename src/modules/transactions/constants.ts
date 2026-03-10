import type { TransactionsListParams } from '../../services/transactions/hooks';

export const defaultTransactionsListParams: TransactionsListParams = {
  skip: 0,
  limit: 50,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};
