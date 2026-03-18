/**
 * 本地历史记录读写（mbti-history-storage 规范）
 */

const HISTORY_KEY = "mbti-test-history";
const MAX_HISTORY = 10;

export interface HistoryRecord {
  timestamp: number;
  type: string;
  dimensionStrength: Record<string, number>;
  version?: string;
}

export function readHistory(): HistoryRecord[] {
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

export function saveRecord(record: HistoryRecord): void {
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

function isValidRecord(r: unknown): r is HistoryRecord {
  return !!r && typeof r === "object" && typeof (r as Record<string, unknown>).timestamp === "number" && typeof (r as Record<string, unknown>).type === "string";
}
