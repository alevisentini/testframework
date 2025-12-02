// src/ui/tests/login.spec.ts
import { test } from "../../fixtures/uiFixtures";
import { LoginPage } from './pages/loginpage';
import { DashboardPage } from './pages/dashboardpage';

test('UI Login test', async ({ page, baseURL }) => {
  const loginPage = new LoginPage(page);
  const dashboard = new DashboardPage(page);

  await loginPage.navigate(`${baseURL}/login`);
  await loginPage.login('testUser', 'testPass');

  await dashboard.validateWelcomeText('Welcome');
});
