import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { CategoriesPage } from './pages/CategoriesPage';
import { LayoutPage } from './pages/LayoutPage';

test.describe('Categories', () => {
  test('list loads and CRUD smoke: create then delete category', async ({
    page,
  }) => {
    await page.goto(routes.categories);
    const layout = new LayoutPage(page);
    await layout.expectAppShell();
    const categories = new CategoriesPage(page);

    const toast = page.locator('[data-sonner-toast]');

    await categories.openAdd();
    const name = `E2E Category ${Date.now()}`;
    await categories.fillCategoryName(name);
    await categories.submitForm();
    await expect(toast).toContainText(/category created/i, { timeout: 5000 });

    await expect(categories.row(name)).toBeVisible();
    await categories.deleteButton(name).click();
    await categories.confirmDelete();
    await expect(toast).toContainText(/category deleted/i, { timeout: 5000 });
  });
});
