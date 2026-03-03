/**
 * API path constants for transactions (no leading slash; base URL from callbackApi).
 */
export const transactionsPaths = {
  list: 'transactions',
  get: (id: string) => `transactions/${id}`,
  update: (id: string) => `transactions/${id}`,
  delete: (id: string) => `transactions/${id}`,
} as const;
