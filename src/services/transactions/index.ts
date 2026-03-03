import { callbackApi } from '../../utils/callbackApi';
import { transactionsPaths } from './constants';
import type {
  GetTransactionsResponse,
  TransactionCreate,
  TransactionRead,
  TransactionUpdate,
} from './types';

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

/**
 * Create a transaction. POST /transactions/; returns created TransactionRead (201).
 */
export async function createTransaction(
  body: TransactionCreate,
): Promise<TransactionRead> {
  const { data } = await callbackApi.post<TransactionRead>(
    transactionsPaths.list,
    body,
  );
  return data;
}

/**
 * Get a single transaction by id. GET /transactions/{id}.
 */
export async function getTransaction(id: string): Promise<TransactionRead> {
  const { data } = await callbackApi.get<TransactionRead>(
    transactionsPaths.get(id),
  );
  return data;
}

/**
 * Update a transaction. PATCH /transactions/{id}; returns updated TransactionRead (200).
 */
export async function updateTransaction(
  id: string,
  body: TransactionUpdate,
): Promise<TransactionRead> {
  const { data } = await callbackApi.patch<TransactionRead>(
    transactionsPaths.update(id),
    body,
  );
  return data;
}

/**
 * Delete a transaction. DELETE /transactions/{id}; 204 no content.
 */
export async function deleteTransaction(id: string): Promise<void> {
  await callbackApi.delete(transactionsPaths.delete(id));
}
