import { ApiRequestError, fetchHistory, saveHistory } from "@/lib/api/history";
import type { MbtiTestMode } from "./types";

export interface HistoryRecord {
  timestamp: number;
  type: string;
  dimensionStrength: Record<string, number>;
  version?: string;
  mode?: MbtiTestMode;
}

const LOCAL_STORAGE_KEY = "mbti-history-fallback";
const MAX_LOCAL_RECORDS = 50;

export async function readHistory(): Promise<HistoryRecord[]> {
  try {
    const records = await fetchHistory("mbti");
    const remote = records.map((record) => ({
      timestamp: new Date(record.created_at).getTime(),
      type: (record.result as { type?: string })?.type || "",
      dimensionStrength: (record.result as { dimensionStrength?: Record<string, number> })?.dimensionStrength || {},
      version: (record.result as { version?: string })?.version,
      mode: normalizeMode((record.result as { mode?: unknown })?.mode),
    })).filter(isValidRecord);
    return mergeRecords(remote, readLocalHistory());
  } catch {
    return readLocalHistory();
  }
}

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
  } catch (error) {
    // Guest users receive 401 and save to local fallback.
    if (error instanceof ApiRequestError && error.status === 401) {
      writeLocalRecord(record);
      return;
    }
    writeLocalRecord(record);
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

function readLocalHistory(): HistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidRecord).sort((a, b) => b.timestamp - a.timestamp);
  } catch {
    return [];
  }
}

function writeLocalRecord(record: HistoryRecord) {
  if (typeof window === "undefined") return;
  const current = readLocalHistory();
  const deduped = mergeRecords([record], current).slice(0, MAX_LOCAL_RECORDS);
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(deduped));
  } catch {
    // ignore local storage write errors
  }
}

function mergeRecords(primary: HistoryRecord[], secondary: HistoryRecord[]): HistoryRecord[] {
  const map = new Map<string, HistoryRecord>();
  const append = (record: HistoryRecord) => {
    const signature = [
      record.timestamp,
      record.type,
      record.mode ?? "quick",
      JSON.stringify(record.dimensionStrength),
    ].join("|");
    if (!map.has(signature)) map.set(signature, record);
  };
  primary.forEach(append);
  secondary.forEach(append);
  return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
}
