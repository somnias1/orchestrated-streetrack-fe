import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { HomePage } from './pages/HomePage';
import { LayoutPage } from './pages/LayoutPage';

test.describe('Home dashboard', () => {
  test('shows dashboard content after navigation', async ({ page }) => {
    await page.goto(routes.home);
    const layout = new LayoutPage(page);
    await layout.expectAppShell();
    const home = new HomePage(page);
    await home.expectDashboardVisible();
    await expect(page.getByRole('main')).toBeVisible();
  });
});
