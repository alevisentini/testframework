import { test, expect } from "../fixtures/apiClient.fixture";

test.describe.fixme("Users API", () => {
  test("GET /users returns 200", async ({ apiClient }) => {
    const response = await apiClient.get("/users?page=1");
    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("POST /users creates user", async ({ apiClient }) => {
    const response = await apiClient.post("/users", {
      name: "Alejandro",
      job: "tester"
    });

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.name).toBe("Alejandro");
  });

  test("PUT /users updates a user", async ({ apiClient }) => {
    test.fixme();
    const res = await apiClient.put("/users", {
      name: "Alejandro",
      job: "Senior QA"
    });

    expect(res.status()).toBe(200);
  });

  test("DELETE /users deletes a user", async ({ apiClient }) => {
    test.fixme();
    const res = await apiClient.delete("/users/2");
    expect(res.status()).toBe(204);
  });

});

