import { parsePastedRows } from './parsePaste';

describe('parsePastedRows', () => {
  it('returns empty array for empty input', () => {
    expect(parsePastedRows('')).toEqual([]);
    expect(parsePastedRows('   ')).toEqual([]);
  });

  it('skips lines with fewer than 5 tab-separated columns', () => {
    expect(parsePastedRows('07/03/2026\t$\t130.000,00\tExpenses')).toEqual([]);
  });

  it('parses a basic row with 5 columns', () => {
    const result = parsePastedRows('07/03/2026\t$\t130.000,00\tExpenses\tHangout');
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      category_name: 'Expenses',
      subcategory_name: 'Hangout',
      value: 130000,
      date: '2026-03-07',
      hangout_id: null,
    });
    expect(result[0].description).toBe('Hangout');
  });

  it('uses 6th column as description when provided', () => {
    const result = parsePastedRows('07/03/2026\t$\t50,00\tFood\tLunch\tTeam lunch');
    expect(result[0].description).toBe('Team lunch');
  });

  it('parses European value format correctly', () => {
    const result = parsePastedRows('01/01/2026\t$\t1.234.567,89\tX\tY');
    expect(result[0].value).toBe(1234568);
  });

  it('converts DD/MM/YYYY to YYYY-MM-DD', () => {
    const result = parsePastedRows('31/12/2025\t$\t100,00\tX\tY');
    expect(result[0].date).toBe('2025-12-31');
  });

  it('passes non-DD/MM/YYYY date strings through unchanged', () => {
    const result = parsePastedRows('2025-12-31\t$\t100,00\tX\tY');
    expect(result[0].date).toBe('2025-12-31');
  });

  it('parses multiple rows', () => {
    const text = '01/01/2026\t$\t100,00\tA\tB\n02/01/2026\t$\t200,00\tC\tD';
    const result = parsePastedRows(text);
    expect(result).toHaveLength(2);
    expect(result[0].category_name).toBe('A');
    expect(result[1].category_name).toBe('C');
  });

  it('ignores blank lines', () => {
    const text = '01/01/2026\t$\t100,00\tA\tB\n\n02/01/2026\t$\t200,00\tC\tD';
    expect(parsePastedRows(text)).toHaveLength(2);
  });

  it('handles windows line endings (CRLF)', () => {
    const text = '01/01/2026\t$\t100,00\tA\tB\r\n02/01/2026\t$\t200,00\tC\tD';
    expect(parsePastedRows(text)).toHaveLength(2);
  });
});
