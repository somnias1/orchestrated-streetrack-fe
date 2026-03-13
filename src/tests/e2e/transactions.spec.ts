import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { CategoriesPage } from './pages/CategoriesPage';
import { LayoutPage } from './pages/LayoutPage';
import { SubcategoriesPage } from './pages/SubcategoriesPage';
import { TransactionsPage } from './pages/TransactionsPage';

const IMPORT_CATEGORY_NAME = 'E2E Import Category';
const IMPORT_SUBCATEGORY_NAME = 'E2E Import Subcategory';

function loadImportFixture(): string {
  const path = join(process.cwd(), 'src/tests/e2e/fixtures/import-paste.txt');
  return readFileSync(path, 'utf-8').trim();
}

test.describe('Transactions', () => {
  test('list loads and Export CSV triggers download', async ({ page }) => {
    await page.goto(routes.transactions);
    const layout = new LayoutPage(page);
    await layout.expectAppShell();
    const transactions = new TransactionsPage(page);

    const downloadPromise = page.waitForEvent('download', { timeout: 15000 });
    await transactions.clickExportCsv();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.csv$/i);
  });

  test('Import flow: create category and subcategory, paste rows, preview, create, then cleanup', async ({
    page,
  }) => {
    await page.goto(routes.categories);
    const layout = new LayoutPage(page);
    await layout.expectAppShell();
    const categories = new CategoriesPage(page);

    await categories.openAdd();
    await categories.fillCategoryName(IMPORT_CATEGORY_NAME);
    await categories.submitForm();
    await expect(page.getByTestId('categories-snackbar')).toContainText(
      'Category created',
    );

    await layout.goToSubcategories();
    const subcategories = new SubcategoriesPage(page);
    await subcategories.openAdd();
    await subcategories.fillName(IMPORT_SUBCATEGORY_NAME);
    await subcategories.selectCategory(IMPORT_CATEGORY_NAME);
    await subcategories.submitForm();
    await expect(page.getByTestId('subcategories-snackbar')).toContainText(
      /created|saved/i,
    );

    await layout.goToTransactions();
    const transactions = new TransactionsPage(page);
    await transactions.clickImport();
    const pasteData = loadImportFixture();
    await transactions.importPasteArea.fill(pasteData);
    await transactions.importPreviewButton.click();
    await expect(page.getByText(/Valid:\s*8/)).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /create 8 transactions/i }).click();
    await expect(page.getByTestId('transactions-snackbar')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.getByTestId('transactions-snackbar')).toContainText(
      'bulk created',
    );

    // Delete all transactions under this subcategory so it can be deleted
    await page.goto(routes.transactions);
    await transactions.selectSubcategoryFilter(IMPORT_SUBCATEGORY_NAME);
    await page
      .locator('[data-testid^="transaction-row-"]')
      .first()
      .waitFor({ state: 'visible', timeout: 15000 })
      .catch(() => {});
    const maxDeletes = 50;
    for (let i = 0; i < maxDeletes; i++) {
      const rowCount = await page
        .locator('[data-testid^="transaction-row-"]')
        .count();
      if (rowCount === 0) break;
      await transactions.deleteFirstTransaction();
      await transactions.confirmDelete();
      await expect(page.getByTestId('transactions-snackbar')).toContainText(
        /deleted/i,
      );
      await expect(
        page.locator('[data-testid^="transaction-row-"]'),
      ).toHaveCount(rowCount - 1, { timeout: 10000 });
    }

    await layout.goToSubcategories();
    await subcategories.deleteButton(IMPORT_SUBCATEGORY_NAME).click();
    await subcategories.confirmDelete();
    await expect(page.getByTestId('subcategories-snackbar')).toContainText(
      /deleted/i,
    );

    await layout.goToCategories();
    await categories.deleteButton(IMPORT_CATEGORY_NAME).click();
    await categories.confirmDelete();
    await expect(page.getByTestId('categories-snackbar')).toContainText(
      'Category deleted',
    );
  });
});
