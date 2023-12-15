/**
 * 本模块用于辅助处理 mutate 函数可能遇到的死循环问题
 */
import { includeOne, nodupPush, noop, safeMapGet, tryAlert } from '@helux/utils';
import { fmtDepKeys } from '../../helpers/debug';
import type { IFnCtx } from '../../types/base';
import { TInternal } from './buildInternal';

type Log = { sn: number; descs: string[]; timer: any; errs: any[]; cycle: string[] };
const logMap = new Map<string, Log>();
const cbTypes = {
  WATCH: '1',
  MUTATE: '2',
} as const;
const cbTips = {
  [cbTypes.WATCH]: 'watch',
  [cbTypes.MUTATE]: 'mutate fn or task',
};
type CbType = (typeof cbTypes)[keyof typeof cbTypes];

function newLog(sn = 0): Log {
  return { sn, descs: [], errs: [], timer: null, cycle: [] };
}

export function dcErr(usefulName: string, descs: string[], runDesc: string) {
  const err = new Error(`DEAD_CYCLE: module(${usefulName}) found mutate fn(${runDesc}) in these dead cycle fns [${descs.join(',')}]`);
  err.cause = 'DeadCycle';
  // @ts-ignore
  err.data = descs;
  return err;
}

/**
 * hot reload 模式下，清理相关日志，让新配置的 mutate 函数也能够被检测到死循环依赖
 */
export function clearDcLog(usefulName: string) {
  logMap.delete(usefulName);
}

export function depKeyDcError(internal: TInternal, fnCtx: IFnCtx, depKeys: string[], cbType: CbType) {
  const tip = cbTips[cbType];
  const { desc, task, fn } = fnCtx.subFnInfo;
  const descStr = desc ? `(${desc})` : '';
  const dcInfo =
    `DEAD_CYCLE: found reactive object in ${tip}${descStr} cb`
    + ` is changing module(${internal.usefulName})'s keys(${fmtDepKeys(depKeys, false, '.')}) by its self, `
    + 'but some of these keys are also the watched dep keys, it will cause a infinity loop call!';

  const mutateFn = task || fn;
  const targetFn = mutateFn === noop ? fnCtx.fn : mutateFn;
  console.error(` ${dcInfo} open the stack to find the below fn: \n`, targetFn);
  return new Error(`[only-dev-mode alert] ${dcInfo}`);
}

/**
 * 探测 多个 mutate fn 之间有循环依赖存在的可能性，避免死循环卡死整个应用
 */
export function probeFnDeadCycle(internal: TInternal, sn: number, desc: string) {
  if (internal && desc) {
    const { usefulName } = internal;
    const log = safeMapGet(logMap, usefulName, newLog(sn));

    // 执行批次已变更，重置 log
    if (log.sn !== sn) {
      log.descs = [];
      log.errs = [];
    }

    const { descs } = log;
    // found dead cycle
    // fn task 同时存在且设定了 immediate=true 时，fn 和 task 都会执行，
    // 判断 descs.length > 1 避免此处出现误判
    if (descs.length > 1 && descs[0] === desc) {
      const listCopy = descs.slice();
      log.cycle = listCopy; // 记录死循环desc列表
      descs.length = 0;
      throw dcErr(usefulName, listCopy, desc);
    }
    nodupPush(descs, desc);
  }
}

/**
 * 发现类似
 * 1 watch(()=>{ reactive.a = 1 }, ()=>[reactive.a])
 * 2 matate(draft=>draft+=1)
 * 等场景的死循环
 */
export function probeDepKeyDeadCycle(internal: TInternal, fnCtx: IFnCtx, changedDepKeys: string[]): boolean {
  const { depKeys, subFnInfo } = fnCtx;
  let shortArr = fnCtx.depKeys;
  let longArr = changedDepKeys;
  if (depKeys.length > changedDepKeys.length) {
    shortArr = changedDepKeys;
    longArr = depKeys;
  }

  const foundDc = includeOne(shortArr, longArr);
  if (foundDc) {
    const cbType: CbType = subFnInfo.desc ? cbTypes.MUTATE : cbTypes.WATCH;
    tryAlert(depKeyDcError(internal, fnCtx, changedDepKeys, cbType), {
      logErr: false,
      throwErr: false,
      alertErr: internal.alertDeadCycleErr,
    });
  }
  return foundDc;
}

/**
 * 多个函数间是否已处于死循环状态
 */
export function inDeadCycle(usefulName: string, desc: string) {
  const log = logMap.get(usefulName);
  if (!log || !log.cycle.includes(desc)) {
    return { isIn: false, cycle: [] };
  }
  return { isIn: true, cycle: log.cycle };
}

/**
 * 分析错误日志
 */
export function analyzeErrLog(usefulName: string, err: any) {
  const log = logMap.get(usefulName);
  if (!log) return;
  const { timer, errs } = log;
  errs.push(err);

  timer && clearTimeout(timer);
  log.timer = setTimeout(() => {
    let targetErr: any = null;
    for (const err of errs) {
      if (!targetErr) {
        targetErr = err;
      } else if (err.data.length > targetErr.data.length) {
        targetErr = err;
      }
    }
    if (targetErr) {
      tryAlert(targetErr);
    }
    errs.length = 0;
  }, 0);
}
