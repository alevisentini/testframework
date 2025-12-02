import { test, expect } from "../fixtures/apiClient.fixture";
import { UserSchema, UsersListSchema } from "../schemas/user.schema";

test.describe("Users Business Flow", () => {

    test("Crear, actualizar, verificar y borrar un usuario", async ({ usersService }) => {
        test.fixme();

        // 1. Crear usuario
        const create = await usersService.createUser("Alejandro", "QA");
        expect(create.status()).toBe(201);
        const created = await create.json();

        const parsed = UserSchema.safeParse(created);
        expect(parsed.success).toBe(true);

        // 2. Actualizar usuario
        const update = await usersService.updateUser(created.id, "Alejandro", "Senior QA");
        expect(update.status()).toBe(200);

        // 3. Listar usuarios
        const list = await usersService.listUsers(1);
        expect(list.status()).toBe(200);

        // 4. Borrar usuario
        const del = await usersService.deleteUser(created.id);
        expect(del.status()).toBe(204);
    });

    test("Validar estructura completa de la lista de usuarios", async ({ usersService }) => {
        const response = await usersService.listUsers(1);
        expect(response.status()).toBe(200);

        const json = await response.json();

        const parsed = UsersListSchema.safeParse(json);

        expect(parsed.success).toBe(true);
    });

    test("Validar reglas de negocio por usuario individual", async ({ usersService }) => {
        // 1. Obtenemos la lista de usuarios
        const responseList = await usersService.listUsers();
        expect(responseList.status()).toBe(200);

        const users = await responseList.json();
        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);

        // 2. Elegimos un usuario específico (ID 1)
        const userId = users[0].id;

        const responseUser = await usersService.getUser(userId);
        expect(responseUser.status()).toBe(200);

        const userJson = await responseUser.json();

        // 3. Validación con Zod
        const parsed = UserSchema.safeParse(userJson);

        if (!parsed.success) {
            console.error("Zod validation errors:", parsed.error.format());
        }

        expect(parsed.success).toBe(true);

        // 4. Reglas de negocio adicionales
        expect(userJson.id).toBeGreaterThan(0);
        expect(userJson.name.length).toBeGreaterThan(2);
        expect(userJson.email).toContain("@");
        expect(userJson.username).not.toBe("");
    });

    test("Negativo: Obtener usuario inexistente devuelve 404", async ({ usersService }) => {
        const invalidId = 99999;

        const response = await usersService.getUser(invalidId);

        expect(response.status()).toBe(404);
    });

    test("Negativo: Crear usuario sin body devuelve error", async ({ usersService }) => {
        test.fixme();
        const response = await usersService.createUser("", "");

        // En una API real usarías 400 Bad Request
        expect([400, 422]).toContain(response.status());
    });

    test("Negativo: Actualizar usuario inexistente devuelve error", async ({ usersService }) => {
        const invalidId = 99999;

        const response = await usersService.updateUser(invalidId, "John", "Tester");
        //console.log(JSON.stringify(response, null, 2));
        // JSONPlaceholder devuelve 200 aunque no exista, pero dejamos el patrón correcto
        expect(response.status()).toBeGreaterThanOrEqual(400);
        expect(response.status()).toBeLessThan(500 + 1); // permite 500
    });
});
