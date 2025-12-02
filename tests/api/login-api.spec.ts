import { test, expect } from '../../fixtures/uiFixtures';

test('Login API - Should authenticate successfully', async ({ request }) => {
  const res = await request.post(`${process.env.API_URL}/login`, {
    data: {
      username: 'user@example.com',
      password: '12345'
    }
  });

  expect(res.status()).toBe(200);

  const body = await res.json();
  expect(body.token).toBeDefined();
});
