import { request, APIRequestContext, APIResponse } from "@playwright/test";

export class ApiClient {
  private context!: APIRequestContext;

  constructor(private baseUrl: string) {}

  async init() {
    this.context = await request.newContext({
      baseURL: this.baseUrl,
      proxy: {
        server: "http://10.4.7.240:3128",
      },
      ignoreHTTPSErrors: true,
    });
  }

  private ensureContext() {
    if (!this.context) {
      throw new Error("ApiClient not initialized. Did you forget to call init()?");
    }
  }

  async get(path: string): Promise<APIResponse> {
    this.ensureContext();
    return this.context.get(path);
  }

  async post(path: string, body: any): Promise<APIResponse> {
    this.ensureContext();
    return this.context.post(path, { data: body });
  }

  async put(path: string, body: any): Promise<APIResponse> {
    this.ensureContext();
    return this.context.put(path, { data: body });
  }

  async delete(path: string): Promise<APIResponse> {
    this.ensureContext();
    return this.context.delete(path);
  }

  async dispose() {
    if (this.context) {
      await this.context.dispose();
    }
  }
}
