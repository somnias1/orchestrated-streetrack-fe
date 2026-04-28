import { expect, test } from '@playwright/test';
import { routes } from '../../routes';
import { HangoutsPage } from './pages/HangoutsPage';
import { LayoutPage } from './pages/LayoutPage';

test.describe('Hangouts', () => {
  test('list loads and CRUD smoke: create then delete hangout', async ({
    page,
  }) => {
    await page.goto(routes.hangouts);
    const layout = new LayoutPage(page);
    await layout.expectAppShell();
    const hangouts = new HangoutsPage(page);

    const toast = page.locator('[data-sonner-toast]');

    await hangouts.openAdd();
    const name = `E2E Hangout ${Date.now()}`;
    await hangouts.fillName(name);
    await hangouts.fillDate('2026-03-15');
    await hangouts.submitForm();
    await expect(toast).toContainText(/created|saved/i, { timeout: 5000 });

    await expect(hangouts.row(name)).toBeVisible();
    await hangouts.deleteButton(name).click();
    await hangouts.confirmDelete();
    await expect(toast).toContainText(/deleted/i, { timeout: 5000 });
  });
});
