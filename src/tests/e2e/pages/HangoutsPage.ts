import type { Page } from '@playwright/test';

export class HangoutsPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByTestId('hangouts-add-button');
  }

  async openAdd(): Promise<void> {
    await this.addButton.click();
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByLabel(/hangout name/i).fill(name);
  }

  async fillDate(date: string): Promise<void> {
    await this.page.getByLabel(/^date$/i).fill(date);
  }

  async submitForm(): Promise<void> {
    await this.page
      .getByRole('button', { name: /save|create|submit/i })
      .click();
  }

  /** Locator for a hangout row by name. */
  row(name: string) {
    return this.page
      .locator('[data-testid^="hangout-row-"]')
      .filter({ hasText: name })
      .first();
  }

  /** Delete button for a row by hangout name (aria-label="Delete ${name}"). */
  deleteButton(name: string) {
    return this.page.getByRole('button', {
      name: new RegExp(`delete ${name}`, 'i'),
    });
  }

  /** Confirm delete in the open dialog (scoped to avoid matching row buttons). */
  async confirmDelete(): Promise<void> {
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: /delete|confirm/i })
      .click();
  }
}
