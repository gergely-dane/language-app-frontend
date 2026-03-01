import type {
  AxiosInstance,
  AxiosRequestConfig,
  RawAxiosRequestHeaders,
} from "axios";
import axios from "axios";

import { supabaseClient } from "@/lib/supabase-client";

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;

  private constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
      timeout: 10000,
      headers: { "Content-Type": "application/json" },
    });
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }

    return ApiClient.instance;
  }

  private async getHeaders(): Promise<RawAxiosRequestHeaders> {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    return session?.access_token
      ? {
          Authorization: `Bearer ${session.access_token}`,
        }
      : {};
  }

  public async get<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.get<T>(url, {
      ...config,
      headers: { ...config?.headers, ...(await this.getHeaders()) },
    });
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    return this.client.post<T>(url, data, {
      ...config,
      headers: { ...config?.headers, ...(await this.getHeaders()) },
    });
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    return this.client.put<T>(url, data, {
      ...config,
      headers: { ...config?.headers, ...(await this.getHeaders()) },
    });
  }

  public async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ) {
    return this.client.patch<T>(url, data, {
      ...config,
      headers: { ...config?.headers, ...(await this.getHeaders()) },
    });
  }

  public async delete<T = any>(url: string, config?: AxiosRequestConfig) {
    return this.client.delete<T>(url, {
      ...config,
      headers: { ...config?.headers, ...(await this.getHeaders()) },
    });
  }
}

export const apiClient = ApiClient.getInstance();
