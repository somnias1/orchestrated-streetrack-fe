import type { Page } from '@playwright/test';

export class SubcategoriesPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByTestId('subcategories-add-button');
  }

  async openAdd(): Promise<void> {
    await this.addButton.click();
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByTestId('subcategory-form-name').fill(name);
  }

  async selectCategory(categoryName: string): Promise<void> {
    await this.page.getByTestId('subcategory-form-category').click();
    await this.page
      .getByRole('option', { name: new RegExp(categoryName, 'i') })
      .first()
      .click();
  }

  async submitForm(): Promise<void> {
    await this.page
      .getByRole('button', { name: /save|create|submit/i })
      .click();
  }

  /** Locator for a subcategory row by name. */
  row(name: string) {
    return this.page
      .locator('[data-testid^="subcategory-row-"]')
      .filter({ hasText: name })
      .first();
  }

  /** Delete button for a row by subcategory name (aria-label="Delete ${name}"). */
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
