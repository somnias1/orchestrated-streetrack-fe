import type { Page } from '@playwright/test';

export class CategoriesPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByTestId('categories-add-button');
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

  /** Get Edit button for a row by category name (first match when duplicates exist). */
  editButton(name: string) {
    return this.page
      .getByRole('row', { name: new RegExp(name, 'i') })
      .first()
      .getByRole('button', { name: /edit/i });
  }

  /** Get Delete button for a row by category name (first match when duplicates exist). */
  deleteButton(name: string) {
    return this.page
      .getByRole('row', { name: new RegExp(name, 'i') })
      .first()
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

  /** Confirm delete in the open dialog (scoped to avoid matching row buttons). */
  async confirmDelete(): Promise<void> {
    await this.page
      .getByRole('dialog')
      .getByRole('button', { name: /delete|confirm/i })
      .click();
  }
}
