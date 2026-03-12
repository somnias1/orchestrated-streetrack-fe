import type { Page } from '@playwright/test';

export class HangoutsPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByRole('button', { name: /add/i }).first();
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

  deleteButton(name: string) {
    return this.page
      .getByRole('row', { name: new RegExp(name, 'i') })
      .getByRole('button', { name: /delete/i });
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /delete|confirm/i }).click();
  }
}
