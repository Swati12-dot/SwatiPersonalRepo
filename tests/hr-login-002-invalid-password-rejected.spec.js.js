const { test, expect } = require('@playwright/test');

/**
 * HR-LOGIN-002: Invalid password is rejected and no authenticated page is accessible
 *
 * ContextQA test case: 30258
 * Linear:              CON-4984
 * Verified run:        124524 (SUCCESS, run #b4b71e, chromium)
 *
 * Acceptance criteria
 *   Given an invalid password
 *   When the user attempts to sign in
 *   Then an "Invalid credentials" error is shown
 *   And no authenticated page is accessible
 *
 * The second clause is asserted by navigating directly to the dashboard after the
 * failed attempt. Asserting only the error toast would let this test pass even if
 * the application leaked an authenticated session, which is the actual risk here.
 */

const LOGIN_PATH = '/web/index.php/auth/login';
const DASHBOARD_PATH = '/web/index.php/dashboard/index';

test.describe('HR-LOGIN-002 @smoke @login @negative', () => {
  test('invalid password is rejected and no authenticated page is reachable (TC 30258)', async ({ page }) => {
    await test.step('Navigate to the login page', async () => {
      await page.goto(LOGIN_PATH);
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });

    await test.step('Attempt to sign in with an invalid password', async () => {
      await page.getByPlaceholder('Username').fill(process.env.HR_ADMIN_USERNAME);
      await page.getByPlaceholder('Password').fill(process.env.HR_INVALID_PASSWORD);
      await page.getByRole('button', { name: /login/i }).click();
    });

    await test.step('Then an "Invalid credentials" error is shown', async () => {
      await expect(page.getByText('Invalid credentials')).toBeVisible();
      await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toHaveCount(0);
    });

    await test.step('And no authenticated page is accessible', async () => {
      await page.goto(DASHBOARD_PATH);
      await expect(page).toHaveURL(new RegExp(`${LOGIN_PATH}$`));
      await expect(page.getByPlaceholder('Username')).toBeVisible();
      await expect(page.getByPlaceholder('Password')).toBeVisible();
      await expect(page.locator('.oxd-sidepanel')).toHaveCount(0);
    });
  });
});
