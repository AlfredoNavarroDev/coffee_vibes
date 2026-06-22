import axios, { AxiosError } from "axios";
import type { ApiError } from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const TOKEN_KEY = "cv_token";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

// Adjunta el token JWT a cada request si existe (solo en cliente).
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Normaliza el error del backend { success:false, error:{code,message} }
// a un mensaje legible que la UI puede mostrar directamente.
export class ApiRequestError extends Error {
  code: string;
  status?: number;
  details?: unknown;

  constructor(message: string, code: string, status?: number, details?: unknown) {
    super(message);
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export function getApiErrorMessage(err: unknown): string {
  if (err instanceof ApiRequestError) return err.message;
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiError | undefined;
    if (data?.error?.message) return data.error.message;
    if (err.message === "Network Error") {
      return "No se pudo conectar con el servidor. Verifica que el backend esté corriendo.";
    }
  }
  if (err instanceof Error) return err.message;
  return "Ocurrió un error inesperado.";
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const data = error.response?.data;
    const message = data?.error?.message || "Ocurrió un error inesperado.";
    const code = data?.error?.code || "UNKNOWN_ERROR";
    return Promise.reject(
      new ApiRequestError(message, code, error.response?.status, data?.error?.details)
    );
  }
);
