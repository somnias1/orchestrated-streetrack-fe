import { callbackApi } from '../../utils/callbackApi';
import { transactionsPaths } from './constants';
import type { GetTransactionsResponse, TransactionRead } from './types';

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 50;

/**
 * Fetch transactions list from the backend. Uses callbackApi (Bearer token attached by interceptor).
 * TECHSPEC §4.3: skip and limit optional; defaults 0, 50.
 */
export async function fetchTransactions(options?: {
  skip?: number;
  limit?: number;
}): Promise<TransactionRead[]> {
  const skip = options?.skip ?? DEFAULT_SKIP;
  const limit = options?.limit ?? DEFAULT_LIMIT;
  const { data } = await callbackApi.get<GetTransactionsResponse>(
    transactionsPaths.list,
    { params: { skip, limit } },
  );
  return data;
}
