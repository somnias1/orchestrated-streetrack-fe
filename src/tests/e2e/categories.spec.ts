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

    await categories.openAdd();
    const name = `E2E Category ${Date.now()}`;
    await categories.fillCategoryName(name);
    await categories.submitForm();
    await expect(page.getByText('Category created')).toBeVisible({
      timeout: 5000,
    });

    await expect(
      page.getByRole('row', { name: new RegExp(name, 'i') }),
    ).toBeVisible();
    await categories.deleteButton(name).click();
    await categories.confirmDelete();
    await expect(page.getByText('Category deleted')).toBeVisible({
      timeout: 5000,
    });
  });
});
