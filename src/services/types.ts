/**
 * Shared API types. Resource-specific types live in src/services/<resource>/types.ts.
 */

export type { HTTPValidationError, ValidationError } from './validation';

export type DefaultParams = {
  skip?: number;
  limit?: number;
};
