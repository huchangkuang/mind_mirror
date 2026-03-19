/**
 * MBTI History Storage - API Based
 * Replaces localStorage with MySQL-backed API
 */

import { fetchHistory, saveHistory } from "@/lib/api/history";
import type { MbtiTestMode } from "./types";

export interface HistoryRecord {
  timestamp: number;
  type: string;
  dimensionStrength: Record<string, number>;
  version?: string;
  mode?: MbtiTestMode;
}

/**
 * Read MBTI history records from API
 * Converts API format to local format for backward compatibility
 */
export async function readHistory(): Promise<HistoryRecord[]> {
  try {
    const records = await fetchHistory("mbti");
    return records.map((record) => ({
      timestamp: new Date(record.created_at).getTime(),
      type: (record.result as { type?: string })?.type || "",
      dimensionStrength: (record.result as { dimensionStrength?: Record<string, number> })?.dimensionStrength || {},
      version: (record.result as { version?: string })?.version,
      mode: normalizeMode((record.result as { mode?: unknown })?.mode),
    })).filter(isValidRecord);
  } catch {
    return [];
  }
}

/**
 * Save MBTI record to API
 */
export async function saveRecord(record: HistoryRecord): Promise<void> {
  try {
    await saveHistory({
      test_id: "mbti",
      result: {
        type: record.type,
        dimensionStrength: record.dimensionStrength,
        version: record.version,
        mode: normalizeMode(record.mode),
      },
      result_summary: record.type,
    });
  } catch {
    // ignore
  }
}

function normalizeMode(mode: unknown): MbtiTestMode {
  return mode === "deep" ? "deep" : "quick";
}

function isValidRecord(r: unknown): r is HistoryRecord {
  return (
    !!r &&
    typeof r === "object" &&
    typeof (r as Record<string, unknown>).timestamp === "number" &&
    typeof (r as Record<string, unknown>).type === "string"
  );
}
