import { resolveCosmicResult } from "./score";
import type { CosmicDimension } from "./types";

function repeat(d: CosmicDimension, n: number): CosmicDimension[] {
  return Array.from({ length: n }, () => d);
}

describe("resolveCosmicResult", () => {
  it("8× EF → 恒星爆发红", () => {
    expect(resolveCosmicResult(repeat("EF", 8))).toBe("solar-flare-red");
  });

  it("8× IT → 坍缩暗物质", () => {
    expect(resolveCosmicResult(repeat("IT", 8))).toBe("collapsed-dark-matter");
  });

  it("8× N → 极光幽浮绿", () => {
    expect(resolveCosmicResult(repeat("N", 8))).toBe("aurora-ufo-green");
  });

  it("E/F 与 I/T 并列最高 → 超新星珍珠白", () => {
    const dims: CosmicDimension[] = [
      ...repeat("EF", 4),
      ...repeat("IT", 4),
    ];
    expect(resolveCosmicResult(dims)).toBe("supernova-pearl");
  });

  it("E/F 与 N 并列最高 → 深空玫瑰金", () => {
    const dims: CosmicDimension[] = [
      ...repeat("EF", 4),
      ...repeat("N", 4),
    ];
    expect(resolveCosmicResult(dims)).toBe("deep-space-rose");
  });

  it("I/T 与 N 并列最高 → 中子星亮紫", () => {
    const dims: CosmicDimension[] = [
      ...repeat("IT", 4),
      ...repeat("N", 4),
    ];
    expect(resolveCosmicResult(dims)).toBe("neutron-bright-purple");
  });

  it("5 EF / 2 IT / 1 N → 唯一胜者 EF", () => {
    const dims: CosmicDimension[] = [
      ...repeat("EF", 5),
      ...repeat("IT", 2),
      "N",
    ];
    expect(resolveCosmicResult(dims)).toBe("solar-flare-red");
  });
});
