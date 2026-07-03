/**
 * History API Client
 * Provides functions to interact with the history API endpoints
 * Replaces localStorage-based storage with MySQL-backed API
 */

import {
  ApiRequestError,
  apiFetch,
  getApiErrorMessage,
  readJsonBody,
} from "@/lib/api/client";

export { ApiRequestError };

export interface HistoryRecord {
  id: number;
  test_id: string;
  title: string;
  href: string | null;
  result: unknown;
  result_summary: string;
  created_at: string;
}

export interface CreateHistoryData {
  test_id: string;
  result: unknown;
  result_summary?: string;
}

type RawHistoryRecord = {
  id?: number;
  test_id?: string;
  testId?: string;
  title?: string;
  href?: string | null;
  test?: {
    title?: string;
    href?: string | null;
  } | null;
  result?: unknown;
  result_summary?: string | null;
  resultSummary?: string | null;
  created_at?: string;
  createdAt?: string;
};

function normalizeHistoryRecord(input: RawHistoryRecord): HistoryRecord | null {
  const id = typeof input.id === "number" ? input.id : NaN;
  const testId =
    (typeof input.test_id === "string" && input.test_id) ||
    (typeof input.testId === "string" && input.testId) ||
    "";
  if (!Number.isFinite(id) || !testId) {
    return null;
  }

  const title = input.title ?? input.test?.title ?? testId;
  const href = input.href ?? input.test?.href ?? null;
  const resultSummary = input.result_summary ?? input.resultSummary ?? "";
  const createdAt = input.created_at ?? input.createdAt ?? new Date().toISOString();

  return {
    id,
    test_id: testId,
    title,
    href,
    result: input.result ?? null,
    result_summary: resultSummary,
    created_at: createdAt,
  };
}

function extractHistoryList(payload: unknown): RawHistoryRecord[] {
  if (!payload || typeof payload !== "object") return [];
  const root = payload as Record<string, unknown>;
  const data = (root.data && typeof root.data === "object"
    ? root.data
    : root) as Record<string, unknown>;
  const list = data.history;
  if (!Array.isArray(list)) return [];
  return list as RawHistoryRecord[];
}

function extractSingleRecord(payload: unknown): RawHistoryRecord | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  const data = (root.data && typeof root.data === "object"
    ? root.data
    : root) as Record<string, unknown>;
  const record = data.record;
  if (!record || typeof record !== "object") return null;
  return record as RawHistoryRecord;
}

/**
 * Fetch all history records (optionally filtered by test_id)
 */
export async function fetchHistory(testId?: string): Promise<HistoryRecord[]> {
  const url = testId
    ? `/api/history?test_id=${encodeURIComponent(testId)}`
    : "/api/history";

  const response = await apiFetch(url);

  if (!response.ok) {
    const body = await readJsonBody(response);
    throw new ApiRequestError(
      getApiErrorMessage(body, "Failed to fetch history"),
      response.status
    );
  }

  const payload = await readJsonBody(response);
  const list = extractHistoryList(payload)
    .map((item) => normalizeHistoryRecord(item))
    .filter((item): item is HistoryRecord => item !== null);
  return list;
}

/**
 * Save a new history record
 */
export async function saveHistory(data: CreateHistoryData): Promise<HistoryRecord> {
  const response = await apiFetch("/api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      testId: data.test_id,
      result: data.result,
      resultSummary: data.result_summary,
    }),
  });

  if (!response.ok) {
    const body = await readJsonBody(response);
    throw new ApiRequestError(
      getApiErrorMessage(body, "Failed to save history"),
      response.status
    );
  }

  const payload = await readJsonBody(response);
  const rawRecord = extractSingleRecord(payload);
  const normalized = rawRecord ? normalizeHistoryRecord(rawRecord) : null;
  if (!normalized) {
    throw new ApiRequestError("History record missing in response", response.status);
  }
  return normalized;
}

/**
 * Delete a specific history record by id
 */
export async function deleteHistoryItem(id: number): Promise<void> {
  const response = await apiFetch(`/api/history?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const body = await readJsonBody(response);
    throw new ApiRequestError(
      getApiErrorMessage(body, "Failed to delete history"),
      response.status
    );
  }
}

/**
 * Clear all history records
 */
export async function clearAllHistory(): Promise<{ deletedCount: number }> {
  const response = await apiFetch("/api/history", {
    method: "DELETE",
  });

  if (!response.ok) {
    const body = await readJsonBody(response);
    throw new ApiRequestError(
      getApiErrorMessage(body, "Failed to clear history"),
      response.status
    );
  }

  const payload = await readJsonBody(response);
  if (!payload || typeof payload !== "object") return { deletedCount: 0 };
  const root = payload as Record<string, unknown>;
  const data = (root.data && typeof root.data === "object"
    ? root.data
    : root) as Record<string, unknown>;
  const deletedCount = typeof data.deletedCount === "number" ? data.deletedCount : 0;
  return { deletedCount };
}
