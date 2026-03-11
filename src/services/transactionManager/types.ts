/**
 * Transaction manager API types (OpenAPI: transaction-manager import/export).
 */

import type { TransactionCreate } from '../transactions/types';

/** One pasted row: category/subcategory by name; resolved to IDs server-side. */
export type TransactionImportRow = {
  category_name: string;
  subcategory_name: string;
  value: number;
  description: string;
  date: string;
  hangout_id?: string | null;
};

/** POST /transaction-manager/import request body. */
export type TransactionImportRequest = {
  rows: TransactionImportRow[];
};

/** Validation feedback for a row that could not be resolved. */
export type TransactionImportInvalidRow = {
  row_index: number;
  message: string;
};

/** Import preview: payload for bulk create + invalid rows. */
export type TransactionImportPreview = {
  transactions: TransactionCreate[];
  invalid_rows: TransactionImportInvalidRow[];
};

/** GET /transaction-manager/export query params (same as transactions list filters). */
export type TransactionExportParams = {
  year?: number;
  month?: number;
  day?: number;
  subcategory_id?: string;
  hangout_id?: string;
};
