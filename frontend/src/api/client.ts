import axios from "axios";
import type { AxiosError, AxiosResponse } from "axios";

export const apiClient = axios.create({ baseURL: "/api" });

export type OnUnauthenticated = () => void;
let onUnauthenticatedInternal: OnUnauthenticated | undefined;

export function setOnUnauthenticated(cb: OnUnauthenticated | undefined) {
  onUnauthenticatedInternal = cb;
}

apiClient.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const isLogin = error.config?.url?.includes("/auth/login");
    if (error.response?.status === 401 && !isLogin) {
      if (onUnauthenticatedInternal) {
        onUnauthenticatedInternal();
      } else {
        sessionStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
