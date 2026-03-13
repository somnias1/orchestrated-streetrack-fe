/**
 * Playwright E2E config. Loads .env so VITE_APP_URL and E2E credentials are available.
 * Run: npx playwright test (or npm run test:e2e).
 * Requires: .env with VITE_APP_URL, VITE_E2E_USER_EMAIL, VITE_E2E_USER_PASSWORD.
 */
import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

const baseURL = process.env.VITE_APP_URL ?? 'http://localhost:8080';

export default defineConfig({
  testDir: './src/tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'no-auth', testMatch: /auth\.spec\.ts$/ },
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    {
      name: 'chromium',
      testMatch: /\.spec\.ts$/,
      testIgnore: /auth\.spec\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        storageState: 'playwright/.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
  timeout: 120000,
  expect: { timeout: 10000 },
});
