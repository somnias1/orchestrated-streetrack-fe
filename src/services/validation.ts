/**
 * Common error shapes from backend (TECHSPEC §4.1).
 */
export type ValidationError = {
  loc: (string | number)[];
  msg: string;
  type: string;
  input?: unknown;
  ctx?: Record<string, unknown>;
};

export type HTTPValidationError = {
  detail?: ValidationError[];
};
