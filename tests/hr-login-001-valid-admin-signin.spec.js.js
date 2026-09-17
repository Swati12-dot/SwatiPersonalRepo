const { test, expect } = require('@playwright/test');

/**
 * HR-LOGIN-001: Valid HR admin can sign in and reach the Dashboard
 *
 * ContextQA test case: 30257
 * Linear:              CON-4983
 * Verified run:        124521 (SUCCESS, run #1ec3e4, chromium)
 *
 * Acceptance criteria
 *   Given a valid HR admin test account
 *   When the user signs in
 *   Then the Dashboard is displayed
 *   And the authenticated navigation is available
 */

const LOGIN_PATH = '/web/index.php/auth/login';
const DASHBOARD_PATH = '/web/index.php/dashboard/index';

test.describe('HR-LOGIN-001 @smoke @login', () => {
  test('valid HR admin signs in and reaches the Dashboard (TC 30257)', async ({ page }) => {
    await test.step('Navigate to the login page', async () => {
      await page.goto(LOGIN_PATH);
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    await test.step('Sign in with valid credentials', async () => {
      await page.getByPlaceholder('Username').fill(process.env.HR_ADMIN_USERNAME);
      await page.getByPlaceholder('Password').fill(process.env.HR_ADMIN_PASSWORD);
      await page.getByRole('button', { name: /login/i }).click();
    });

    await test.step('Then the Dashboard is displayed', async () => {
      await expect(page).toHaveURL(new RegExp(`${DASHBOARD_PATH}$`));
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });

    await test.step('And the authenticated navigation is available', async () => {
      const sidebar = page.locator('.oxd-sidepanel');
      await expect(sidebar).toBeVisible();
      for (const module of ['Admin', 'PIM', 'Leave']) {
        await expect(sidebar.getByRole('link', { name: module })).toBeVisible();
      }
    });

    await test.step('And no login error is shown', async () => {
      await expect(page.getByText('Invalid credentials')).toHaveCount(0);
    });
  });
});
