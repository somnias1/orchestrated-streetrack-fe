import type { TransactionImportRow } from '../../../services/transactionManager/types';

/**
 * Parses European-style value: "78.294,00" → 78294 (dot = thousands, comma = decimal).
 */
function parseEuropeanValue(valueStr: string): number {
  const cleaned = valueStr.trim().replace(/\./g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : Math.round(n);
}

/**
 * Converts DD/MM/YYYY to YYYY-MM-DD for the API.
 */
function parseDateDDMMYYYY(dateStr: string): string {
  const trimmed = dateStr.trim();
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (!match) return trimmed;
  const [, day, month, year] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

/**
 * Parses pasted text into import rows.
 * Expected format (tab-separated): Date	$	Value	Category	Subcategory	[Description]
 * - Date: DD/MM/YYYY
 * - Value: European format (e.g. 78.294,00)
 * - Category / Subcategory: names (resolved by backend)
 * - Optional 6th column: transaction description. If omitted, description = subcategory.
 */
export function parsePastedRows(text: string): TransactionImportRow[] {
  const lines = text
    .trim()
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const rows: TransactionImportRow[] = [];
  for (const line of lines) {
    const cells = line.split('\t').map((c) => c.trim());
    // Need at least: date, $, value, category, subcategory (5 columns)
    if (cells.length < 5) continue;
    const [dateRaw, _currency, valueStr, category_name, subcategory_name] =
      cells;
    const descriptionColumn =
      cells.length >= 6 ? cells.slice(5).join(' ').trim() : '';
    const date = parseDateDDMMYYYY(dateRaw ?? '');
    const value = parseEuropeanValue(valueStr ?? '');
    const description =
      descriptionColumn ||
      subcategory_name?.trim() ||
      category_name?.trim() ||
      'Imported';
    rows.push({
      category_name: category_name ?? '',
      subcategory_name: subcategory_name ?? '',
      value,
      description,
      date,
      hangout_id: null,
    });
  }
  return rows;
}
