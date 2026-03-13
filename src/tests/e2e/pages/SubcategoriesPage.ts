import type { Page } from '@playwright/test';

export class SubcategoriesPage {
  constructor(readonly page: Page) {}

  get addButton() {
    return this.page.getByTestId('subcategories-add-button');
  }

  get tableBody() {
    return this.page.locator('table tbody');
  }

  async openAdd(): Promise<void> {
    await this.addButton.click();
  }

  async fillName(name: string): Promise<void> {
    await this.page.getByTestId('subcategory-form-name').fill(name);
  }

  async selectCategory(categoryName: string): Promise<void> {
    // Click the visible combobox (not the hidden native input with data-testid)
    await this.page.getByRole('combobox', { name: /category/i }).click();
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

  /** Get Delete button for a row by subcategory name (first match when duplicates exist). */
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
