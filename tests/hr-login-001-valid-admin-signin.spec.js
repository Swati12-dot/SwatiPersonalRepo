const { test, expect } = require('@playwright/test');

/**
 * HR-LOGIN-001: Valid HR admin can sign in and reach the Dashboard
 *
 * ContextQA test case : 31979  (tenant errorsquad, workspace "Swati Test" v161)
 * ContextQA plan      : 1210 "OrangeHRM Login – Chromium" (suite 2243, env QA-OrangeHRM 749)
 * Verified run        : 131431 (SUCCESS, 12/12 typed steps, chromium)
 *
 * Acceptance criteria
 *   Given a valid HR admin test account
 *   When the user signs in
 *   Then the Dashboard is displayed
 *   And the authenticated navigation is available
 *
 * Each test.step maps 1:1 to a typed ContextQA step (step id in brackets), so a
 * failure here and a failure in ContextQA point at the same named step.
 */

const LOGIN_PATH = '/web/index.php/auth/login';
const DASHBOARD_PATH = '/web/index.php/dashboard/index';

test.describe('HR-LOGIN-001 @smoke @login', () => {
  test('valid HR admin signs in and reaches the Dashboard (TC 31979)', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'Login' });
    const sidebar = page.locator('.oxd-sidepanel');

    await test.step('[274271] Navigate to the login page', async () => {
      await page.goto(LOGIN_PATH);
    });
    await test.step('[274272] Login button is visible', async () => {
      await expect(loginButton).toContainText('Login');
    });
    await test.step('[274273] Enter the admin username', async () => {
      await page.getByPlaceholder('Username').fill(process.env.HR_ADMIN_USERNAME);
    });
    await test.step('[274274] Enter the admin password', async () => {
      await page.getByPlaceholder('Password').fill(process.env.HR_ADMIN_PASSWORD);
    });
    await test.step('[274275] Click Login', async () => {
      await loginButton.click();
    });
    await test.step('[274276] URL is the dashboard', async () => {
      await expect(page).toHaveURL(new RegExp(`${DASHBOARD_PATH}$`));
    });
    await test.step('[274277] Dashboard heading is displayed', async () => {
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toContainText('Dashboard');
    });
    await test.step('[274278] Left navigation menu is visible', async () => {
      await expect(sidebar).toBeVisible();
    });
    for (const [stepId, module] of [['274279', 'Admin'], ['274280', 'PIM'], ['274281', 'Leave']]) {
      await test.step(`[${stepId}] Navigation link "${module}" is visible`, async () => {
        await expect(sidebar.getByRole('link', { name: module })).toBeVisible();
      });
    }
    await test.step('[274282] "Invalid credentials" is not displayed', async () => {
      await expect(page.getByText('Invalid credentials')).toHaveCount(0);
    });
  });
});
