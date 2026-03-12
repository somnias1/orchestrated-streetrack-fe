import type { Page } from '@playwright/test';

/**
 * Auth0-hosted login page (after redirect from app /login).
 * Selectors target common Auth0 Universal Login form.
 */
export class LoginPage {
  constructor(readonly page: Page) {}

  /**
   * Wait for Auth0 login form and fill credentials, then submit.
   * Call after navigating to app /login and waiting for redirect to Auth0.
   */
  async fillAndSubmit(email: string, password: string): Promise<void> {
    await this.page.waitForURL(/auth0\.com|\.auth0\.com/, { timeout: 15000 });
    const emailInput = this.page.getByRole('textbox', {
      name: /email|username|log in/i,
    });
    const passwordInput = this.page.getByLabel(/password/i);
    await emailInput.fill(email);
    await passwordInput.fill(password);
    await this.page
      .getByRole('button', { name: /continue|log in|sign in|submit/i })
      .click();
  }

  /** Wait until we are back on the app (post-callback). */
  async waitForAppRedirect(baseURL: string): Promise<void> {
    await this.page.waitForURL(
      (url) => url.origin === new URL(baseURL).origin,
      { timeout: 30000 },
    );
  }
}
