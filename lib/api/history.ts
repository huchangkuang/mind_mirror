/**
 * History API Client
 * Provides functions to interact with the history API endpoints
 * Replaces localStorage-based storage with MySQL-backed API
 */

import type { HistoryRecord as ApiHistoryRecord } from "@/app/api/history/route";

export interface HistoryRecord {
  id: number;
  test_id: string;
  title: string;
  result: unknown;
  result_summary: string;
  created_at: string;
}

export interface CreateHistoryData {
  test_id: string;
  result: unknown;
  result_summary?: string;
}

/**
 * Fetch all history records (optionally filtered by test_id)
 */
export async function fetchHistory(testId?: string): Promise<HistoryRecord[]> {
  const url = testId
    ? `/api/history?test_id=${encodeURIComponent(testId)}`
    : "/api/history";

  const response = await fetch(url);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch history");
  }

  const data = await response.json();
  return data.history || [];
}

/**
 * Save a new history record
 */
export async function saveHistory(data: CreateHistoryData): Promise<HistoryRecord> {
  const response = await fetch("/api/history", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to save history");
  }

  const result = await response.json();
  return result.record;
}

/**
 * Delete a specific history record by id
 */
export async function deleteHistoryItem(id: number): Promise<void> {
  const response = await fetch(`/api/history?id=${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to delete history");
  }
}

/**
 * Clear all history records
 */
export async function clearAllHistory(): Promise<{ deletedCount: number }> {
  const response = await fetch("/api/history", {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to clear history");
  }

  return await response.json();
}
