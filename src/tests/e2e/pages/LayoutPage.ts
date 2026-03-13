import type { Page } from '@playwright/test';
import { routes } from '../../../routes';

export class LayoutPage {
  constructor(readonly page: Page) {}

  get navHome() {
    return this.page.getByRole('link', { name: /^home$/i });
  }

  get navCategories() {
    return this.page.getByRole('link', { name: /^categories$/i });
  }

  get navSubcategories() {
    return this.page.getByRole('link', { name: /^subcategories$/i });
  }

  get navTransactions() {
    return this.page.getByRole('link', { name: /^transactions$/i });
  }

  get navHangouts() {
    return this.page.getByRole('link', { name: /^hangouts$/i });
  }

  get logoutButton() {
    return this.page.getByRole('button', { name: /log out/i });
  }

  /** Ensure we are on a protected page (layout with nav). */
  async expectAppShell(): Promise<void> {
    await this.navHome.waitFor({ state: 'visible', timeout: 10000 });
  }

  async goToHome(): Promise<void> {
    await this.navHome.click();
  }

  async goToCategories(): Promise<void> {
    await this.navCategories.click();
  }

  async goToSubcategories(): Promise<void> {
    await this.navSubcategories.click();
  }

  async goToTransactions(): Promise<void> {
    await this.navTransactions.click();
  }

  async goToHangouts(): Promise<void> {
    await this.navHangouts.click();
  }

  getPath(pathKey: keyof typeof routes): string {
    const map: Record<string, string> = {
      home: routes.home,
      categories: routes.categories,
      subcategories: routes.subcategories,
      transactions: routes.transactions,
      hangouts: routes.hangouts,
      'auth.login': routes.auth.login,
      'auth.callback': routes.auth.callback,
    };
    return map[pathKey] ?? pathKey;
  }
}
