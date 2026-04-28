import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { CategoriesPage } from './pages/CategoriesPage';
import { LayoutPage } from './pages/LayoutPage';
import { SubcategoriesPage } from './pages/SubcategoriesPage';
import { TransactionsPage } from './pages/TransactionsPage';

function buildImportPasteFixture(
  categoryName: string,
  subcategoryName: string,
): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const mm = String(m).padStart(2, '0');
  const d = (day: number) => `${String(day).padStart(2, '0')}/${mm}/${y}`;

  const line = (date: string, amount: string, note: string) =>
    `${date}\t$\t${amount}\t${categoryName}\t${subcategoryName}\t${note}`;

  return [
    line(d(7), '130.000,00', 'Gift'),
    line(d(8), '221.799,00', 'Outing'),
    line(d(9), '39.899,00', 'Phone plan'),
    line(d(9), '78.294,00', 'Gas'),
    line(d(9), '59.700,00', 'Water'),
    line(d(9), '81.650,00', 'Utilities'),
    line(d(9), '1.153.000,00', 'Credit card'),
    line(d(9), '340.000,00', 'Loan payment'),
  ].join('\n');
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

    const toastMatching = (pattern: RegExp) =>
      page.locator('[data-sonner-toast]').filter({ hasText: pattern });

    const suffix = Date.now();
    const importCategoryName = `E2E Import Category ${suffix}`;
    const importSubcategoryName = `E2E Import Subcategory ${suffix}`;

    await categories.openAdd();
    await categories.fillCategoryName(importCategoryName);
    await categories.submitForm();
    await expect(toastMatching(/^Category created$/i)).toBeVisible({
      timeout: 5000,
    });

    await layout.goToSubcategories();
    const subcategories = new SubcategoriesPage(page);
    await subcategories.openAdd();
    await subcategories.fillName(importSubcategoryName);
    await subcategories.selectCategory(importCategoryName);
    await subcategories.submitForm();
    await expect(toastMatching(/^Subcategory created$/i)).toBeVisible({
      timeout: 5000,
    });

    await layout.goToTransactions();
    const transactions = new TransactionsPage(page);
    await transactions.clickImport();
    const pasteData = buildImportPasteFixture(
      importCategoryName,
      importSubcategoryName,
    );
    await transactions.importPasteArea.fill(pasteData);
    await transactions.importPreviewButton.click();
    await expect(page.getByText(/Valid:\s*8/)).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /create 8 transactions/i }).click();
    await expect(toastMatching(/bulk created/i)).toBeVisible({
      timeout: 10000,
    });

    // Delete all transactions under this subcategory so it can be deleted
    await page.goto(routes.transactions);
    await transactions.selectSubcategoryFilter(importSubcategoryName);
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
      await expect(toastMatching(/transaction deleted/i).last()).toBeVisible({
        timeout: 5000,
      });
      await expect(
        page.locator('[data-testid^="transaction-row-"]'),
      ).toHaveCount(rowCount - 1, { timeout: 10000 });
    }

    await layout.goToSubcategories();
    await subcategories.deleteButton(importSubcategoryName).click();
    await subcategories.confirmDelete();
    await expect(toastMatching(/^Subcategory deleted$/i).last()).toBeVisible({
      timeout: 8000,
    });

    await layout.goToCategories();
    await categories.deleteButton(importCategoryName).click();
    await categories.confirmDelete();
    await expect(toastMatching(/^Category deleted$/i).last()).toBeVisible({
      timeout: 8000,
    });
  });
});
