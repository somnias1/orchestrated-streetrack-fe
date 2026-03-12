import type { Page } from '@playwright/test';

export class SubcategoriesPage {
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
    await this.page.getByLabel(/^name$/i).fill(name);
  }

  async selectCategory(categoryName: string): Promise<void> {
    await this.page.getByRole('combobox', { name: /category/i }).click();
    await this.page
      .getByRole('option', { name: new RegExp(categoryName, 'i') })
      .click();
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
