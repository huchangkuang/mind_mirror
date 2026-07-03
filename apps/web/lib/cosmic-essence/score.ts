import type { CosmicDimension, CosmicResultId } from "./types";

/**
 * 按 `openspec/changes/cosmic-essence-color-test/design.md` 的映射解析结果。
 */
export function resolveCosmicResult(dimensions: CosmicDimension[]): CosmicResultId {
  let ef = 0;
  let it = 0;
  let n = 0;
  for (const d of dimensions) {
    if (d === "EF") ef += 1;
    else if (d === "IT") it += 1;
    else n += 1;
  }

  const max = Math.max(ef, it, n);
  const topEF = ef === max;
  const topIT = it === max;
  const topN = n === max;
  const topCount = (topEF ? 1 : 0) + (topIT ? 1 : 0) + (topN ? 1 : 0);

  if (topCount === 3) {
    return "supernova-pearl";
  }

  if (topCount === 1) {
    if (topEF) return "solar-flare-red";
    if (topIT) return "collapsed-dark-matter";
    return "aurora-ufo-green";
  }

  if (topEF && topIT) return "supernova-pearl";
  if (topEF && topN) return "deep-space-rose";
  if (topIT && topN) return "neutron-bright-purple";

  return "supernova-pearl";
}
