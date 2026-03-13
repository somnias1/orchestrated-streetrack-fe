import type { Page } from '@playwright/test';

export class TransactionsPage {
  constructor(readonly page: Page) {}

  /** Add menu button (Transaction | Bulk | Import). */
  get addMenuButton() {
    return this.page.getByTestId('transactions-add-button');
  }

  get exportCsvButton() {
    return this.page.getByTestId('transactions-export-csv-button');
  }

  get tableBody() {
    return this.page.locator('table tbody');
  }

  async openAddMenu(): Promise<void> {
    await this.addMenuButton.click();
  }

  /** Click "Transaction" in the Add menu (single transaction dialog). */
  async clickAddTransaction(): Promise<void> {
    await this.openAddMenu();
    await this.page.getByRole('menuitem', { name: /^transaction$/i }).click();
  }

  /** Click "Bulk" in the Add menu. */
  async clickBulk(): Promise<void> {
    await this.openAddMenu();
    await this.page.getByRole('menuitem', { name: /bulk/i }).click();
  }

  /** Click "Import" in the Add menu. */
  async clickImport(): Promise<void> {
    await this.openAddMenu();
    await this.page.getByRole('menuitem', { name: /import/i }).click();
  }

  /** Import dialog: paste textarea. */
  get importPasteArea() {
    return this.page.getByRole('textbox', { name: /paste|rows/i });
  }

  /** Import dialog: Preview button. */
  get importPreviewButton() {
    return this.page.getByRole('button', { name: /preview/i });
  }

  /** Import dialog: Create N transactions button. */
  get importSubmitButton() {
    return this.page.getByRole('button', { name: /create \d+ transaction/i });
  }

  async clickExportCsv(): Promise<void> {
    await this.exportCsvButton.click();
  }

  /** Set the Subcategory filter by option label (first match if multiple). */
  async selectSubcategoryFilter(subcategoryName: string): Promise<void> {
    await this.page.getByRole('combobox', { name: /subcategory/i }).click();
    await this.page
      .getByRole('option', { name: new RegExp(subcategoryName, 'i') })
      .first()
      .click();
  }

  /** Click Delete on the first transaction row (e.g. after filtering). Uses data-testid so we never target the empty-state row. */
  async deleteFirstTransaction(): Promise<void> {
    await this.page
      .locator('[data-testid^="transaction-row-"]')
      .first()
      .getByRole('button', { name: /delete/i })
      .click();
  }

  /** Confirm delete in the open dialog. */
  async confirmDelete(): Promise<void> {
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: /delete|confirm/i })
      .click();
  }
}
