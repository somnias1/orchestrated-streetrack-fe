import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { CategoriesPage } from './pages/CategoriesPage';
import { LayoutPage } from './pages/LayoutPage';
import { SubcategoriesPage } from './pages/SubcategoriesPage';
import { TransactionsPage } from './pages/TransactionsPage';

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

    const categoryName = `E2E ImpCat ${Date.now()}`;
    await categories.openAdd();
    await categories.fillCategoryName(categoryName);
    await categories.submitForm();
    await expect(page.getByText('Category created')).toBeVisible({
      timeout: 5000,
    });

    await layout.goToSubcategories();
    const subcategories = new SubcategoriesPage(page);
    await subcategories.openAdd();
    const subName = `E2E ImpSub ${Date.now()}`;
    await subcategories.fillName(subName);
    await subcategories.selectCategory(categoryName);
    await subcategories.submitForm();
    await expect(page.getByText(/created|saved/i)).toBeVisible({
      timeout: 5000,
    });

    await layout.goToTransactions();
    const transactions = new TransactionsPage(page);
    await transactions.clickImport();
    const pasteData = `07/03/2026\t$\t1000\t${categoryName}\t${subName}\tE2E import`;
    await transactions.importPasteArea.fill(pasteData);
    await transactions.importPreviewButton.click();
    await expect(page.getByText(/Valid:\s*1/)).toBeVisible({ timeout: 10000 });
    await page.getByRole('button', { name: /create 1 transaction/i }).click();
    await expect(page.getByText(/created|transaction/i)).toBeVisible({
      timeout: 10000,
    });

    await layout.goToSubcategories();
    await subcategories.deleteButton(subName).click();
    await subcategories.confirmDelete();
    await expect(page.getByText(/deleted/i)).toBeVisible({ timeout: 5000 });

    await layout.goToCategories();
    await categories.deleteButton(categoryName).click();
    await categories.confirmDelete();
    await expect(page.getByText('Category deleted')).toBeVisible({
      timeout: 5000,
    });
  });
});
