import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { LayoutPage } from './pages/LayoutPage';

test.describe('Navigation', () => {
  test('shows app shell and can navigate to all main sections', async ({
    page,
  }) => {
    await page.goto(routes.home);
    const layout = new LayoutPage(page);
    await layout.expectAppShell();

    await layout.goToHome();
    await expect(page).toHaveURL(new RegExp(`${routes.home}$`));

    await layout.goToCategories();
    await expect(page).toHaveURL(new RegExp(routes.categories));

    await layout.goToSubcategories();
    await expect(page).toHaveURL(new RegExp(routes.subcategories));

    await layout.goToTransactions();
    await expect(page).toHaveURL(new RegExp(routes.transactions));

    await layout.goToHangouts();
    await expect(page).toHaveURL(new RegExp(routes.hangouts));
  });
});
