import { getFnCtx } from '../factory/common/fnScope';

/**
 * 标记函数正在计算过程中，用户需自己消费 useDerived 返回的 isComputing 值控制 ui 渲染
 */
export function markComputing(fnKey: string, runCount = 0) {
  const fnCtx = getFnCtx(fnKey);
  if (!fnCtx) return;
  if (fnCtx.showLoading) {
    fnCtx.setLoading(true);
    fnCtx.updater();
  }
  if (runCount) {
    fnCtx.remainRunCount += runCount;
  }
}
