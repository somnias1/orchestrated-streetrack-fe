import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { CategoriesPage } from './pages/CategoriesPage';
import { LayoutPage } from './pages/LayoutPage';
import { SubcategoriesPage } from './pages/SubcategoriesPage';

test.describe('Subcategories', () => {
  test('list loads and CRUD smoke: create category, create subcategory, delete subcategory, delete category', async ({
    page,
  }) => {
    await page.goto(routes.categories);
    const layout = new LayoutPage(page);
    await layout.expectAppShell();
    const categories = new CategoriesPage(page);

    const categoryName = `E2E Cat ${Date.now()}`;
    await categories.openAdd();
    await categories.fillCategoryName(categoryName);
    await categories.submitForm();
    await expect(page.getByTestId('categories-snackbar')).toContainText(
      'Category created',
    );

    await layout.goToSubcategories();
    const subcategories = new SubcategoriesPage(page);
    await subcategories.openAdd();
    const subName = `E2E Sub ${Date.now()}`;
    await subcategories.fillName(subName);
    await subcategories.selectCategory(categoryName);
    await subcategories.submitForm();
    await expect(page.getByTestId('subcategories-snackbar')).toBeVisible({
      timeout: 5000,
    });
    await expect(page.getByTestId('subcategories-snackbar')).toContainText(
      /created|saved/i,
    );

    await expect(
      page.getByRole('row', { name: new RegExp(subName, 'i') }).first(),
    ).toBeVisible();
    await subcategories.deleteButton(subName).click();
    await subcategories.confirmDelete();
    await expect(page.getByTestId('subcategories-snackbar')).toContainText(
      /deleted/i,
    );

    await layout.goToCategories();
    await categories.deleteButton(categoryName).click();
    await categories.confirmDelete();
    await expect(page.getByTestId('categories-snackbar')).toContainText(
      'Category deleted',
    );
  });
});
