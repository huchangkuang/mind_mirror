import type { CityMatchHistoryRecord, DimensionScores } from "./types";
import { ApiRequestError, fetchHistory, saveHistory, clearAllHistory } from "@/lib/api/history";

const LOCAL_STORAGE_KEY = "city-match-history-fallback";
const MAX_LOCAL_RECORDS = 50;

/**
 * 读取历史记录 (API Based)
 */
export async function readHistory(): Promise<CityMatchHistoryRecord[]> {
  try {
    const records = await fetchHistory("city-match");
    const remote = records.map((record) => ({
      timestamp: new Date(record.created_at).getTime(),
      topCity: (record.result as { topCity?: string })?.topCity || "",
      dimensionScores: (record.result as { dimensionScores?: DimensionScores })?.dimensionScores || ({} as DimensionScores),
      version: (record.result as { version?: string })?.version,
    })).filter(isValidRecord);
    return mergeRecords(remote, readLocalHistory());
  } catch {
    return readLocalHistory();
  }
}

/**
 * 保存新的测试记录 (API Based)
 */
export async function saveRecord(record: CityMatchHistoryRecord): Promise<void> {
  try {
    await saveHistory({
      test_id: "city-match",
      result: {
        topCity: record.topCity,
        dimensionScores: record.dimensionScores,
        version: record.version,
      },
      result_summary: record.topCity,
    });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      writeLocalRecord(record);
      return;
    }
    writeLocalRecord(record);
  }
}

/**
 * 创建历史记录
 */
export function createHistoryRecord(
  dimensionScores: DimensionScores,
  topCity: string,
  version?: string
): CityMatchHistoryRecord {
  return {
    timestamp: Date.now(),
    dimensionScores,
    topCity,
    version,
  };
}

/**
 * 清除所有历史记录 (API Based)
 */
export async function clearHistory(): Promise<void> {
  try {
    await clearAllHistory();
  } catch (error) {
    if (error instanceof ApiRequestError && error.status !== 401) return;
  } finally {
    clearLocalHistory();
  }
}

/**
 * 验证记录格式
 */
function isValidRecord(r: unknown): r is CityMatchHistoryRecord {
  return (
    !!r &&
    typeof r === "object" &&
    typeof (r as Record<string, unknown>).timestamp === "number" &&
    typeof (r as Record<string, unknown>).topCity === "string" &&
    !!(r as Record<string, unknown>).dimensionScores &&
    typeof (r as Record<string, unknown>).dimensionScores === "object"
  );
}

function readLocalHistory(): CityMatchHistoryRecord[] {
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

function writeLocalRecord(record: CityMatchHistoryRecord) {
  if (typeof window === "undefined") return;
  const current = readLocalHistory();
  const merged = mergeRecords([record], current).slice(0, MAX_LOCAL_RECORDS);
  try {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // ignore
  }
}

function clearLocalHistory() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

function mergeRecords(
  primary: CityMatchHistoryRecord[],
  secondary: CityMatchHistoryRecord[]
): CityMatchHistoryRecord[] {
  const map = new Map<string, CityMatchHistoryRecord>();
  const append = (record: CityMatchHistoryRecord) => {
    const signature = [
      record.timestamp,
      record.topCity,
      JSON.stringify(record.dimensionScores),
    ].join("|");
    if (!map.has(signature)) map.set(signature, record);
  };
  primary.forEach(append);
  secondary.forEach(append);
  return Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
}
