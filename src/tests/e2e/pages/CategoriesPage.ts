import type { Page } from '@playwright/test';

export class CategoriesPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByRole('button', { name: /add/i }).first();
  }

  get typeFilter() {
    return this.page.getByLabel(/type|filter/i);
  }

  get tableBody() {
    return this.page.locator('table tbody');
  }

  /** Open Add Category (new). */
  async openAdd(): Promise<void> {
    await this.addButton.click();
  }

  /** Get Edit button for a row by category name. */
  editButton(name: string) {
    return this.page
      .getByRole('row', { name: new RegExp(name, 'i') })
      .getByRole('button', { name: /edit/i });
  }

  /** Get Delete button for a row by category name. */
  deleteButton(name: string) {
    return this.page
      .getByRole('row', { name: new RegExp(name, 'i') })
      .getByRole('button', { name: /delete/i });
  }

  async fillCategoryName(name: string): Promise<void> {
    await this.page.getByLabel(/name/i).fill(name);
  }

  async submitForm(): Promise<void> {
    await this.page
      .getByRole('button', { name: /save|create|submit/i })
      .click();
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /delete|confirm/i }).click();
  }
}
