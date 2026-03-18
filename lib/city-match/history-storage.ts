import type { CityMatchHistoryRecord, DimensionScores } from "./types";

const HISTORY_KEY = "city-match-test-history";
const MAX_HISTORY = 10;

/**
 * 读取历史记录
 */
export function readHistory(): CityMatchHistoryRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as unknown[];
    return Array.isArray(list) ? list.filter(isValidRecord) : [];
  } catch {
    return [];
  }
}

/**
 * 保存新的测试记录
 */
export function saveRecord(record: CityMatchHistoryRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = readHistory();
    list.unshift(record);
    const trimmed = list.slice(0, MAX_HISTORY);
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch {
    // ignore
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
 * 清除所有历史记录
 */
export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(HISTORY_KEY);
  } catch {
    // ignore
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
