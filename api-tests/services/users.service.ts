import { ApiClient } from "../client";
import { APIResponse } from "@playwright/test";

export class UsersService {
    constructor(private client: ApiClient) { }

    async listUsers(page = 1): Promise<APIResponse> {
        return this.client.get(`/users?page=${page}`);
    }

    async createUser(name: string, job: string): Promise<APIResponse> {
        return this.client.post("/users", {
            name,
            job,
        });
    }

    async getUser(id: number): Promise<APIResponse> {
        return this.client.get(`/users/${id}`);
    }


    async updateUser(id: number, name: string, job: string): Promise<APIResponse> {
        return this.client.put(`/users/${id}`, {
            name,
            job,
        });
    }

    async deleteUser(id: number): Promise<APIResponse> {
        return this.client.delete(`/users/${id}`);
    }
}
