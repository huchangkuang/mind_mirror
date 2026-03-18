import type { CityMatchHistoryRecord, DimensionScores } from "./types";
import { fetchHistory, saveHistory, clearAllHistory } from "@/lib/api/history";

/**
 * 读取历史记录 (API Based)
 */
export async function readHistory(): Promise<CityMatchHistoryRecord[]> {
  try {
    const records = await fetchHistory("city-match");
    return records.map((record) => ({
      timestamp: new Date(record.created_at).getTime(),
      topCity: (record.result as { topCity?: string })?.topCity || "",
      dimensionScores: (record.result as { dimensionScores?: DimensionScores })?.dimensionScores || ({} as DimensionScores),
      version: (record.result as { version?: string })?.version,
    })).filter(isValidRecord);
  } catch {
    return [];
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
 * 清除所有历史记录 (API Based)
 */
export async function clearHistory(): Promise<void> {
  try {
    await clearAllHistory();
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
