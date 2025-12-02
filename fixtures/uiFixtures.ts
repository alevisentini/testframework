import { test as baseTest, expect, APIRequestContext } from '@playwright/test';

export type UIFixtures = {
  authRequest: APIRequestContext;
  getAuthToken(): Promise<string>;
};

export const test = baseTest.extend<UIFixtures>({
  authRequest: async ({ request }, use) => {
    await use(request);
  },

  getAuthToken: async ({ request }, use) => {
    const tokenGetter = async () => {
      const response = await request.post(`${process.env.API_URL}/login`, {
        data: {
          username: "test@example.com",
          password: "123456"
        }
      });

      const body = await response.json();
      return body.token;
    };

    await use(tokenGetter);
  },
});

export { expect };
