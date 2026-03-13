import type { Page } from '@playwright/test';

export class HangoutsPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByTestId('hangouts-add-button');
  }

  get tableBody() {
    return this.page.locator('table tbody');
  }

  async openAdd(): Promise<void> {
    await this.addButton.click();
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByLabel(/hangout name|^name$/i).fill(name);
  }

  async fillDate(date: string): Promise<void> {
    await this.page.getByLabel(/date/i).fill(date);
  }

  async submitForm(): Promise<void> {
    await this.page
      .getByRole('button', { name: /save|create|submit/i })
      .click();
  }

  /** Get Delete button for a row by hangout name (first match when duplicates exist). */
  deleteButton(name: string) {
    return this.page
      .getByRole('row', { name: new RegExp(name, 'i') })
      .first()
      .getByRole('button', { name: /delete/i });
  }

  /** Confirm delete in the open dialog (scoped to avoid matching row buttons). */
  async confirmDelete(): Promise<void> {
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: /delete|confirm/i })
      .click();
  }
}
