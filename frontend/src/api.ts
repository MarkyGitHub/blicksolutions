import type { ShoppingItem } from "./types";

// URL zum Backend-API aus Umgebungsvariablen oder Standardwert
const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:4000";

// Request-Funktion für alle API-Aufrufe
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  // HTTP Code 204 (No Content) behandeln
  if (res.status === 204) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return undefined as T;
  }

  const text = await res.text();
  const data = text.length ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const message =
      typeof (data as { message?: unknown } | undefined)?.message === "string"
        ? (data as { message: string }).message
        : `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data as T;
}

// Alle Einträge abrufen
export function getItems() {
  return request<ShoppingItem[]>("/items");
}

// Neuen Eintrag erstellen
export function createItem(name: string) {
  return request<ShoppingItem>("/items", {
    method: "POST",
    body: JSON.stringify({ name })
  });
}

// Status eines Eintrags aktualisieren
export function updateBought(id: string, bought: boolean) {
  return request<ShoppingItem>(`/items/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ bought })
  });
}

// Eintrag löschen
export function deleteItem(id: string) {
  return request<void>(`/items/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}
