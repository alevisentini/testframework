import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './src',
  timeout: 30_000,
  reporter: [['list'], ['html']],
  use: {
    baseURL: process.env.BASE_URL,
    headless: true,
  },
});
