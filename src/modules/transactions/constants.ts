import type { TransactionsListParams } from '../../services/transactions/types';

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export const defaultTransactionsListParams: TransactionsListParams = {
  skip: 0,
  limit: 50,
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
};

const YEAR_OPTIONS = [
  (defaultTransactionsListParams.year ?? 0) - 2,
  (defaultTransactionsListParams.year ?? 0) - 1,
  defaultTransactionsListParams.year ?? 0,
];

const DAY_OPTIONS = [...Array(31)].map((_, i) => i + 1);

function getDefaultYear(): string {
  const y = defaultTransactionsListParams.year;
  return String(y);
}
function getDefaultMonth(): string {
  const m = defaultTransactionsListParams.month;
  return String(m);
}

export { YEAR_OPTIONS, MONTHS, DAY_OPTIONS, getDefaultYear, getDefaultMonth };
