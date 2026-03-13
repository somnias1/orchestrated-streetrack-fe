import { expect, test } from '@playwright/test';

test.describe('Auth', () => {
  test('redirects unauthenticated user to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(login|auth0\.com)/);
  });
});
