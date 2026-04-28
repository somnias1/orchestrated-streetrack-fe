import type { Page } from '@playwright/test';

export class CategoriesPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByTestId('categories-add-button');
  }

  /** Open Add Category (new). */
  async openAdd(): Promise<void> {
    await this.addButton.click();
  }

  /** Locator for a category row by name. Tables are div-grids so we use the row testid. */
  row(name: string) {
    return this.page
      .locator('[data-testid^="category-row-"]')
      .filter({ hasText: name })
      .first();
  }

  /** Edit button for a row by category name (aria-label="Edit ${name}"). */
  editButton(name: string) {
    return this.page.getByRole('button', {
      name: new RegExp(`edit ${name}`, 'i'),
    });
  }

  /** Delete button for a row by category name (aria-label="Delete ${name}"). */
  deleteButton(name: string) {
    return this.page.getByRole('button', {
      name: new RegExp(`delete ${name}`, 'i'),
    });
  }

  async fillCategoryName(name: string): Promise<void> {
    await this.page.getByLabel(/category name/i).fill(name);
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
