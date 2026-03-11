import type { TransactionImportRow } from '../../../services/transactionManager/types';

/**
 * Parses pasted text into import rows. Supports tab- or comma-separated.
 * Columns: Category, Subcategory, Value, Description, Date [, HangoutId].
 */
export function parsePastedRows(text: string): TransactionImportRow[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const rows: TransactionImportRow[] = [];
  for (const line of lines) {
    const delimiter = line.includes('\t') ? '\t' : ',';
    const cells = line.split(delimiter).map((c) => c.trim());
    if (cells.length < 5) continue;
    const [
      category_name,
      subcategory_name,
      valueStr,
      description,
      date,
      hangout_id,
    ] = cells;
    const value = Number(valueStr);
    rows.push({
      category_name: category_name ?? '',
      subcategory_name: subcategory_name ?? '',
      value: Number.isNaN(value) ? 0 : value,
      description: description ?? '',
      date: date ?? '',
      hangout_id: hangout_id?.trim() ? hangout_id.trim() : null,
    });
  }
  return rows;
}
