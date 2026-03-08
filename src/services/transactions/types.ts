/**
 * Transactions API types (TECHSPEC §4.1). Match backend OpenAPI schemas.
 */

export type TransactionRead = {
  id: string;
  subcategory_id: string;
  subcategory_name: string;
  value: number;
  description: string;
  date: string;
  hangout_id: string | null;
  hangout_name: string | null;
  user_id: string | null;
};

export type TransactionCreate = {
  subcategory_id: string;
  value: number;
  description: string;
  date: string;
  hangout_id?: string | null;
};

export type TransactionUpdate = {
  subcategory_id?: string | null;
  value?: number | null;
  description?: string | null;
  date?: string | null;
  hangout_id?: string | null;
};

/** GET /transactions/ response */
export type GetTransactionsResponse = TransactionRead[];
