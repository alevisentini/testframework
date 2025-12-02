import { test as base } from "@playwright/test";
import { ApiClient } from "../client";
import { UsersService } from "../services/users.service";

export const test = base.extend<{
  apiClient: ApiClient;
  usersService: UsersService;
}>({
  apiClient: async ({}, use) => {
    const client = new ApiClient("https://jsonplaceholder.typicode.com");
    await client.init();
    await use(client);
  },

  usersService: async ({ apiClient }, use) => {
    const service = new UsersService(apiClient);
    await use(service);
  },
});

export const expect = test.expect;
