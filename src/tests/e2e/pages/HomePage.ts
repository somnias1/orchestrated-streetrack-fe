import type { Page } from '@playwright/test';

export class HomePage {
  constructor(readonly page: Page) {}

  /** Balance / dashboard section headings or content. */
  get pageContent() {
    return this.page.getByRole('main');
  }

  async expectDashboardVisible(): Promise<void> {
    await this.pageContent.waitFor({ state: 'visible', timeout: 10000 });
  }
}
