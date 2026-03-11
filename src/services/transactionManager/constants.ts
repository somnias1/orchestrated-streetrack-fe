/**
 * API path constants for transaction-manager (no leading slash; base URL from callbackApi).
 */

export const transactionManagerPath = 'transaction-manager/' as const;

export const transactionManagerPaths = {
  import: `${transactionManagerPath}import`,
  export: `${transactionManagerPath}export`,
} as const;
