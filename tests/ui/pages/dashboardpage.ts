// src/ui/pages/dashboard.page.ts
import { BasePage } from './basepage';
import { expect } from '@playwright/test';

export class DashboardPage extends BasePage {
  readonly welcomeMessage = this.page.locator('.welcome');

  async validateWelcomeText(text: string) {
    await expect(this.welcomeMessage).toContainText(text);
  }
}
