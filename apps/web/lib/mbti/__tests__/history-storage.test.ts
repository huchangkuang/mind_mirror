/**
 * 历史记录读写逻辑单元测试
 * Node 环境下 readHistory 返回 []，saveRecord 不写入；仅验证导出与调用不抛错。
 */
import { readHistory, saveRecord, type HistoryRecord } from "../history-storage";

describe("history-storage", () => {
  it("readHistory returns an array", async () => {
    const list = await readHistory();
    expect(Array.isArray(list)).toBe(true);
  });

  it("saveRecord does not throw", async () => {
    const record: HistoryRecord = {
      timestamp: Date.now(),
      type: "INFP",
      dimensionStrength: { EI: 30, SN: 50, TF: 40, JP: 60 },
      version: "1.0",
      mode: "quick",
    };
    await expect(saveRecord(record)).resolves.toBeUndefined();
  });
});
