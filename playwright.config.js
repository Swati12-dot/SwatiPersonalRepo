const { defineConfig, devices } = require('@playwright/test');
require('dotenv').config();

for (const name of ['HR_ADMIN_USERNAME', 'HR_ADMIN_PASSWORD', 'HR_INVALID_PASSWORD']) {
  if (!process.env[name]) {
    throw new Error(
      `Missing required env var ${name}. Copy .env.example to .env and fill it in, ` +
      'or export it in CI from the secret store.'
    );
  }
}

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com',
    viewport: { width: 1280, height: 720 },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
