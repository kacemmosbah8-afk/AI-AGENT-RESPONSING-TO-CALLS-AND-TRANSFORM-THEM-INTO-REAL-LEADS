import "server-only";
import { serverEnv } from "../env";

/**
 * Thin Vapi REST client (https://docs.vapi.ai). Uses the server-side
 * VAPI_API_KEY as a Bearer token. Kept fetch-based (no SDK) to avoid deps.
 */
const VAPI_BASE = "https://api.vapi.ai";

export interface VapiResult<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

async function vapiFetch<T = any>(
  path: string,
  init: RequestInit = {},
): Promise<VapiResult<T>> {
  if (!serverEnv.vapiApiKey) {
    return { ok: false, status: 0, error: "VAPI_API_KEY is not set" };
  }
  try {
    const res = await fetch(`${VAPI_BASE}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${serverEnv.vapiApiKey}`,
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
      },
      cache: "no-store",
    });
    const text = await res.text();
    const data = text ? JSON.parse(text) : undefined;
    if (!res.ok) {
      return { ok: false, status: res.status, error: data?.message || text || `HTTP ${res.status}` };
    }
    return { ok: true, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, error: err instanceof Error ? err.message : "network error" };
  }
}

export function createAssistant(payload: unknown) {
  return vapiFetch<{ id: string }>("/assistant", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateAssistant(id: string, payload: unknown) {
  return vapiFetch<{ id: string }>(`/assistant/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function getAssistant(id: string) {
  return vapiFetch<{ id: string }>(`/assistant/${id}`, { method: "GET" });
}
