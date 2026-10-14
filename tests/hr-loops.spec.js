const { test, expect } = require('@playwright/test');

/**
 * HR-NAV-001: HR admin sees every main module, then logs out
 *
 * ContextQA test case: 32594 (workspace "Swati Test", env 749 "QA-OrangeHRM")
 * Verified on ContextQA: run 133177 (Chrome) and 133180 (Edge), both SUCCESS 5/5
 *
 * Self-contained: needs no other files. Credentials come from credentials.env.
 *
 * ContextQA structure → Playwright
 *   Step group 32593 (login)   → loginAsHrAdmin() function below
 *   FOR_LOOP over profile 1028 → for...of over MODULES below
 *   IF logged in / ELSE        → if (user menu visible) { log out } else { logout URL }
 */

const LOGIN_PATH = '/web/index.php/auth/login';
const DASHBOARD_PATH = '/web/index.php/dashboard/index';
const LOGOUT_PATH = '/web/index.php/auth/logout';

// Same rows as ContextQA test-data profile 1028 "OrangeHRM Main Modules"
const MODULES = ['Admin', 'PIM', 'Leave', 'Time', 'Recruitment', 'Directory'];

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing ${name}. Set it in credentials.env.`);
  }
  return value;
}

function endsWithPath(path) {
  return new RegExp(path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$');
}

// Step group: log in as HR admin
async function loginAsHrAdmin(page) {
  await page.goto(LOGIN_PATH);
  await page.getByPlaceholder('Username').fill(requireEnv('HR_ADMIN_USERNAME'));
  await page.getByPlaceholder('Password').fill(requireEnv('HR_ADMIN_PASSWORD'));
  await page.getByRole('button', { name: /login/i }).click();
}

test.describe('HR-NAV-001 @navigation @logout', () => {
  test('HR admin sees every main module, then logs out (TC 32594)', async ({ page }) => {
    await test.step('Step group: log in as HR admin', async () => {
      await loginAsHrAdmin(page);
    });

    await test.step('Login succeeded: the Dashboard is open', async () => {
      await expect(page).toHaveURL(endsWithPath(DASHBOARD_PATH));
    });

    const sidebar = page.locator('aside.oxd-sidepanel');
    for (const moduleName of MODULES) {
      await test.step(`Loop: side panel lists "${moduleName}"`, async () => {
        await expect(sidebar).toContainText(moduleName);
      });
    }

    await test.step('Condition: log out if still logged in', async () => {
      const userMenu = page.locator('span.oxd-userdropdown-tab');
      if (await userMenu.isVisible()) {
        // IF branch: log out through the user menu
        await userMenu.click();
        await page.locator("a[href='/web/index.php/auth/logout']").click();
      } else {
        // ELSE branch: open the logout address directly
        await page.goto(LOGOUT_PATH);
      }
    });

    await test.step('Either branch ends on the login page', async () => {
      await expect(page).toHaveURL(endsWithPath(LOGIN_PATH));
      await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
    });
  });
});