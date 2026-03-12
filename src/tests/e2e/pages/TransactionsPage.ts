import type { Page } from '@playwright/test';

export class TransactionsPage {
  constructor(readonly page: Page) {}

  /** Add menu button (Transaction | Bulk | Import). */
  get addMenuButton() {
    return this.page.getByRole('button', { name: /add/i }).first();
  }

  get exportCsvButton() {
    return this.page.getByRole('button', { name: /export|download csv|csv/i });
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
}
