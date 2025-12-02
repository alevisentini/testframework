import { test, expect } from '../../fixtures/uiFixtures';

test('Signup API - Should register user successfully', async ({ request }) => {
  const res = await request.post(`${process.env.API_URL}/signup`, {
    data: {
      username: 'new@example.com',
      password: 'StrongPass123'
    }
  });

  expect(res.status()).toBe(201);

  const body = await res.json();
  expect(body.message).toBe('User created successfully');
});
