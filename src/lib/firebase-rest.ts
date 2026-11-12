import { getFirebaseConfig } from "./firebase";

export type FirestoreValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { nullValue: null }
  | { timestampValue: string }
  | { arrayValue: { values?: FirestoreValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreValue> } };

const TIMESTAMP_KEYS = new Set(["createdAt", "updatedAt", "timestamp", "lastLogin"]);
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;

export function toFirestoreValue(val: unknown, key?: string): FirestoreValue {
  if (val === null || val === undefined) {
    return { nullValue: null };
  }
  if (typeof val === "boolean") {
    return { booleanValue: val };
  }
  if (typeof val === "number") {
    if (Number.isInteger(val)) {
      return { integerValue: String(val) };
    }
    return { doubleValue: val };
  }
  if (typeof val === "string") {
    if (key && TIMESTAMP_KEYS.has(key) && ISO_DATE_REGEX.test(val)) {
      return { timestampValue: val };
    }
    return { stringValue: val };
  }
  if (Array.isArray(val)) {
    return {
      arrayValue: {
        values: val.map((item) => toFirestoreValue(item)),
      },
    };
  }
  if (typeof val === "object") {
    const fields: Record<string, FirestoreValue> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v !== undefined) {
        fields[k] = toFirestoreValue(v, k);
      }
    }
    return { mapValue: { fields } };
  }
  return { stringValue: String(val) };
}

export function fromFirestoreValue(val: any): any {
  if (!val || typeof val !== "object") return val;
  if ("stringValue" in val) return val.stringValue;
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("booleanValue" in val) return Boolean(val.booleanValue);
  if ("nullValue" in val) return null;
  if ("timestampValue" in val) return val.timestampValue;
  if ("arrayValue" in val) {
    const values = val.arrayValue?.values || [];
    return values.map(fromFirestoreValue);
  }
  if ("mapValue" in val) {
    return fromFirestoreFields(val.mapValue?.fields || {});
  }
  return val;
}

export function toFirestoreFields(obj: Record<string, unknown>): Record<string, FirestoreValue> {
  const fields: Record<string, FirestoreValue> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      fields[key] = toFirestoreValue(value, key);
    }
  }
  return fields;
}

export function fromFirestoreFields(fields: Record<string, any> = {}): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = fromFirestoreValue(value);
  }
  return result;
}

export interface FirestoreDoc<T = Record<string, any>> {
  id: string;
  data: T;
  createTime?: string;
  updateTime?: string;
}

function getBaseUrl(): { baseUrl: string; apiKey: string } | null {
  const config = getFirebaseConfig();
  if (!config || !config.projectId) return null;
  return {
    baseUrl: `https://firestore.googleapis.com/v1/projects/${config.projectId}/databases/(default)/documents`,
    apiKey: config.apiKey || "",
  };
}

function buildHeaders(authToken?: string): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }
  return headers;
}

/**
 * List documents in a Firestore collection. Handles pagination up to 500 docs.
 */
export async function listCollection<T = Record<string, any>>(
  collection: string,
  authToken?: string,
  pageSize = 300
): Promise<{ docs: FirestoreDoc<T>[]; error?: string }> {
  const cfg = getBaseUrl();
  if (!cfg) return { docs: [], error: "Firebase not configured" };

  try {
    const queryParams = new URLSearchParams({ pageSize: String(pageSize) });
    if (!authToken && cfg.apiKey) {
      queryParams.set("key", cfg.apiKey);
    } else if (cfg.apiKey) {
      queryParams.set("key", cfg.apiKey);
    }

    const res = await fetch(`${cfg.baseUrl}/${collection}?${queryParams.toString()}`, {
      method: "GET",
      headers: buildHeaders(authToken),
      cache: "no-store",
    });

    if (!res.ok) {
      const errText = await res.text();
      return { docs: [], error: `Firestore GET ${collection} error (${res.status}): ${errText}` };
    }

    const json = await res.json();
    const rawDocs = json.documents || [];
    const docs: FirestoreDoc<T>[] = rawDocs.map((d: any) => {
      const id = (d.name || "").split("/").pop() || "";
      return {
        id,
        data: { id, ...fromFirestoreFields(d.fields) } as T,
        createTime: d.createTime,
        updateTime: d.updateTime,
      };
    });

    return { docs };
  } catch (err: any) {
    return { docs: [], error: err?.message || "Firestore list exception" };
  }
}

/**
 * Get a single document by ID from a Firestore collection.
 */
export async function getDocument<T = Record<string, any>>(
  collection: string,
  docId: string,
  authToken?: string
): Promise<{ doc: FirestoreDoc<T> | null; error?: string; status?: number }> {
  const cfg = getBaseUrl();
  if (!cfg) return { doc: null, error: "Firebase not configured" };

  try {
    const keyParam = cfg.apiKey ? `?key=${cfg.apiKey}` : "";
    const res = await fetch(`${cfg.baseUrl}/${collection}/${encodeURIComponent(docId)}${keyParam}`, {
      method: "GET",
      headers: buildHeaders(authToken),
      cache: "no-store",
    });

    if (res.status === 404) {
      return { doc: null, status: 404 };
    }

    if (!res.ok) {
      const errText = await res.text();
      return { doc: null, status: res.status, error: errText };
    }

    const d = await res.json();
    const id = (d.name || "").split("/").pop() || docId;
    return {
      doc: {
        id,
        data: { id, ...fromFirestoreFields(d.fields) } as T,
        createTime: d.createTime,
        updateTime: d.updateTime,
      },
      status: 200,
    };
  } catch (err: any) {
    return { doc: null, error: err?.message || "Firestore get exception" };
  }
}

/**
 * Create or overwrite a document (with optional specific docId).
 */
export async function setDocument<T = Record<string, any>>(
  collection: string,
  data: Record<string, unknown>,
  docId?: string,
  authToken?: string
): Promise<{ success: boolean; id?: string; data?: T; error?: string }> {
  const cfg = getBaseUrl();
  if (!cfg) return { success: false, error: "Firebase not configured" };

  try {
    const now = new Date().toISOString();
    const payload = {
      createdAt: data.createdAt || now,
      updatedAt: now,
      ...data,
    };

    const keyParam = cfg.apiKey ? `?key=${cfg.apiKey}` : "";
    let url = `${cfg.baseUrl}/${collection}${keyParam}`;
    let method = "POST";

    if (docId) {
      // PATCH creates or updates a document with a specific ID
      url = `${cfg.baseUrl}/${collection}/${encodeURIComponent(docId)}${keyParam}`;
      method = "PATCH";
    }

    const res = await fetch(url, {
      method,
      headers: buildHeaders(authToken),
      body: JSON.stringify({
        fields: toFirestoreFields(payload),
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Firestore write error (${res.status}): ${errText}` };
    }

    const d = await res.json();
    const createdId = (d.name || "").split("/").pop() || docId || "";
    return {
      success: true,
      id: createdId,
      data: { id: createdId, ...fromFirestoreFields(d.fields) } as T,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Firestore write exception" };
  }
}

/**
 * Partially update specific fields of an existing document using updateMask.
 */
export async function updateDocument<T = Record<string, any>>(
  collection: string,
  docId: string,
  updates: Record<string, unknown>,
  authToken?: string
): Promise<{ success: boolean; data?: T; error?: string }> {
  const cfg = getBaseUrl();
  if (!cfg) return { success: false, error: "Firebase not configured" };

  try {
    const payload = {
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const params = new URLSearchParams();
    if (cfg.apiKey) params.set("key", cfg.apiKey);
    for (const key of Object.keys(payload)) {
      if (payload[key as keyof typeof payload] !== undefined) {
        params.append("updateMask.fieldPaths", key);
      }
    }

    const res = await fetch(
      `${cfg.baseUrl}/${collection}/${encodeURIComponent(docId)}?${params.toString()}`,
      {
        method: "PATCH",
        headers: buildHeaders(authToken),
        body: JSON.stringify({
          fields: toFirestoreFields(payload),
        }),
      }
    );

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Firestore update error (${res.status}): ${errText}` };
    }

    const d = await res.json();
    const id = (d.name || "").split("/").pop() || docId;
    return {
      success: true,
      data: { id, ...fromFirestoreFields(d.fields) } as T,
    };
  } catch (err: any) {
    return { success: false, error: err?.message || "Firestore update exception" };
  }
}

/**
 * Delete a document from Firestore.
 */
export async function deleteDocument(
  collection: string,
  docId: string,
  authToken?: string
): Promise<{ success: boolean; error?: string }> {
  const cfg = getBaseUrl();
  if (!cfg) return { success: false, error: "Firebase not configured" };

  try {
    const keyParam = cfg.apiKey ? `?key=${cfg.apiKey}` : "";
    const res = await fetch(`${cfg.baseUrl}/${collection}/${encodeURIComponent(docId)}${keyParam}`, {
      method: "DELETE",
      headers: buildHeaders(authToken),
    });

    if (!res.ok) {
      const errText = await res.text();
      return { success: false, error: `Firestore delete error (${res.status}): ${errText}` };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Firestore delete exception" };
  }
}
