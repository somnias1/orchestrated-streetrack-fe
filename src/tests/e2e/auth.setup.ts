/**
 * Runs once before E2E tests. Performs real Auth0 login and saves storage state
 * so other tests reuse the session (no login per test).
 */
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { test as setup } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  mkdirSync(dirname(authFile), { recursive: true });
  const email = process.env.VITE_E2E_USER_EMAIL;
  const password = process.env.VITE_E2E_USER_PASSWORD;
  if (!email || !password) {
    throw new Error(
      'E2E credentials missing. Set VITE_E2E_USER_EMAIL and VITE_E2E_USER_PASSWORD in .env',
    );
  }

  const baseURL = process.env.VITE_APP_URL ?? 'http://localhost:8080';
  await page.goto(`${new URL(baseURL).origin}/login`);
  const loginPage = new LoginPage(page);
  await loginPage.fillAndSubmit(email, password);
  await loginPage.waitForAppRedirect(baseURL);
  await page.waitForURL(
    (url) => url.pathname === '/' || url.pathname === '/callback',
    { timeout: 15000 },
  );
  if (page.url().includes('/callback')) {
    await page.waitForURL((url) => url.pathname === '/', { timeout: 15000 });
  }
  await page.context().storageState({ path: authFile });
});
