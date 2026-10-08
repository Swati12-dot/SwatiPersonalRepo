const { test, expect } = require('@playwright/test');

/**
 * HR-LOGIN-002: Invalid password is rejected and no authenticated page is accessible
 *
 * ContextQA test case : 31980  (tenant errorsquad, workspace "Swati Test" v161)
 * ContextQA plan      : 1210 "OrangeHRM Login – Chromium" (suite 2243, env QA-OrangeHRM 749)
 * Verified run        : 131433 (SUCCESS, 13/13 typed steps, chromium)
 *
 * Acceptance criteria
 *   Given an invalid password
 *   When the user attempts to sign in
 *   Then an "Invalid credentials" error is shown
 *   And no authenticated page is accessible
 *
 * The second clause is proved by navigating straight to the dashboard after the
 * failed attempt (steps 274266-274270). Checking only the error message would let
 * this pass even if the app leaked an authenticated session — the real risk.
 */

const LOGIN_PATH = '/web/index.php/auth/login';
const DASHBOARD_PATH = '/web/index.php/dashboard/index';

test.describe('HR-LOGIN-002 @smoke @login @negative', () => {
  test('invalid password is rejected and no authenticated page is reachable (TC 31980)', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'Login' });
    const onLoginPage = new RegExp(`${LOGIN_PATH}$`);

    await test.step('[274258] Navigate to the login page', async () => {
      await page.goto(LOGIN_PATH);
    });
    await test.step('[274259] Login button is visible', async () => {
      await expect(loginButton).toContainText('Login');
    });
    await test.step('[274260] Enter the admin username', async () => {
      await page.getByPlaceholder('Username').fill(process.env.HR_ADMIN_USERNAME);
    });
    await test.step('[274261] Enter an invalid password', async () => {
      await page.getByPlaceholder('Password').fill(process.env.HR_INVALID_PASSWORD);
    });
    await test.step('[274262] Click Login', async () => {
      await loginButton.click();
    });
    await test.step('[274263] "Invalid credentials" error is shown', async () => {
      await expect(page.getByText('Invalid credentials')).toBeVisible();
    });
    await test.step('[274264] Still on the login page', async () => {
      await expect(page).toHaveURL(onLoginPage);
    });
    await test.step('[274265] Dashboard is not displayed', async () => {
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
    });
    await test.step('[274266] Navigate directly to the dashboard', async () => {
      await page.goto(DASHBOARD_PATH);
    });
    await test.step('[274267] Redirected back to the login page', async () => {
      await expect(page).toHaveURL(onLoginPage);
    });
    await test.step('[274268] Username field is visible', async () => {
      await expect(page.getByPlaceholder('Username')).toBeVisible();
    });
    await test.step('[274269] Password field is visible', async () => {
      await expect(page.getByPlaceholder('Password')).toBeVisible();
    });
    await test.step('[274270] No authenticated navigation is rendered', async () => {
      await expect(page.locator('.oxd-sidepanel')).toHaveCount(0);
    });
  });
});
