import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: process.env.CI ? 1 : 1,
  timeout: 30000,

  reporter: [
    ['html', { 
      open: 'never',
      outputFolder: 'playwright-report'
    }],
    ['./src/testlink-reporter.ts']
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    screenshot: 'only-on-failure',
    video: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
    ignoreHTTPSErrors: true,
    navigationTimeout: 30000,
    actionTimeout: 10000,
    launchOptions: {
      slowMo: 0,
    }
  },
  
  projects: [
    {
      name: "setup",
      testDir: "./",
      testMatch: "global-setup.ts",
    },
    {
      name: 'tiporegimen',
      testMatch: [
        'tests/tiporegimen/altaTipoRegimen.test.ts',
        'tests/tiporegimen/busquedaTipoRegimen.test.ts',
        'tests/tiporegimen/modificacionTipoRegimen.test.ts'
      ],
      use: { 
        ...devices['Desktop Chrome'],
        storageState: "./LoginAuth.json", 
        ignoreHTTPSErrors: true,
        navigationTimeout: 30000,
        actionTimeout: 10000,
        headless: process.env.CI ? true : true,
      },
    },
    {
      name: 'excepcion',
      testMatch: [
        'tests/excepcion/altaCalendarioExcepcion.test.ts',
        'tests/excepcion/busquedaCalendarioExcepcion.test.ts',
        'tests/excepcion/modificacionCalendarioExcepcion.test.ts'
      ],
      use: { 
        ...devices['Desktop Chrome'],
        storageState: "./LoginAuth.json", 
        ignoreHTTPSErrors: true,
        navigationTimeout: 30000,
        actionTimeout: 10000,
        headless: process.env.CI ? true : true,
      },
    },
    {
      name: 'cabecera',
      testMatch: [
        'tests/cabecera/altaCabeceraCalendario.test.ts',
        'tests/cabecera/busquedaCabeceraCalendario.test.ts',
        'tests/cabecera/eliminacionCabeceraCalendario.test.ts',
        'tests/cabecera/modificacionCabeceraCalendario.test.ts'
      ],
      use: { 
        ...devices['Desktop Chrome'],
        storageState: "./LoginAuth.json", 
        ignoreHTTPSErrors: true,
        navigationTimeout: 30000,
        actionTimeout: 10000,
        headless: process.env.CI ? true : true,
      },
    },
    {
      name: 'calendario',
      testMatch: [
        'tests/calendario/altaCalendario.test.ts',
        'tests/calendario/busquedaCalendario.test.ts',
        'tests/calendario/modificacionCalendario.test.ts'
      ],
      use: { 
        ...devices['Desktop Chrome'],
        storageState: "./LoginAuth.json", 
        ignoreHTTPSErrors: true,
        navigationTimeout: 30000,
        actionTimeout: 10000,
        headless: process.env.CI ? true : true,
      },
    },
  ],

  outputDir: 'test-results/',
});
