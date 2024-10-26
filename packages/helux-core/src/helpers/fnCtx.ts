import { delListItem, includeOne, matchDictKey, nodupPush } from '@helux/utils';
import { RUN_AT_SERVER } from '../consts';
import { newFnCtx } from '../factory/common/ctor';
import { getCtxMap, getFnCtx, getFnKey, markFnKey } from '../factory/common/fnScope';
import { getFnScope } from '../factory/common/speedup';
import { getDepKeyByPath } from '../factory/common/util';
import type { Dict, Fn, IFnCtx, ScopeType } from '../types/base';
import { delFnDep, delHistoryUnmoutFnCtx } from './fnDep';

export function buildFnCtx(specificProps?: Partial<IFnCtx>): IFnCtx {
  const base: IFnCtx = newFnCtx();
  return Object.assign(base, specificProps || {});
}

export function getCurrentFnDepKeys() {
  const fnScope = getFnScope();
  const { runningFnKey } = fnScope;
  const fnCtx = getFnCtx(runningFnKey);
  if (fnCtx) {
    return fnCtx.depKeys.slice();
  }
  return fnCtx;
}

export function markFnEnd() {
  const fnScope = getFnScope();
  const { runningFnKey } = fnScope;
  if (!runningFnKey) return [];

  // 针对 derive watch 函数，fnCtx.depKeys 只记录最长路径
  const fnCtx = getFnCtx(runningFnKey);
  let targetKeys: string[] = [];
  if (fnCtx) {
    const { depKeys: afterRunDepKeys, fixedDepKeys, delPathAoa, runningSharedKey } = fnScope;
    const { depKeys } = fnCtx;

    const dict: Dict<number> = {};
    afterRunDepKeys.forEach((k) => (dict[k] = 1));
    afterRunDepKeys.forEach((depKey) => {
      const matched = matchDictKey(dict, depKey);
      // 匹配到的子串不是 depKey 自身，就丢弃该子串
      // 随着子串不停地被丢弃，最长路径的多个 depKey 就保留下来了
      if (matched && matched !== depKey) {
        delete dict[matched];
      }
    });
    fixedDepKeys.forEach((k) => (dict[k] = 1));
    const validDepKeys = Object.keys(dict);
    validDepKeys.forEach((depKey) => nodupPush(depKeys, depKey));

    // 移除认为是冗余的依赖
    delPathAoa.forEach((pathArr) => {
      const len = pathArr.length;
      for (let i = 1; i <= len; i++) {
        const toDel = getDepKeyByPath(pathArr.slice(0, i), runningSharedKey);
        delListItem(depKeys, toDel);
      }
    });
    targetKeys = depKeys.slice(); // 返回收集到依赖，辅助判断死循环之用
  }

  fnScope.runningFnKey = '';
  fnScope.depKeys = [];
  fnScope.fixedDepKeys = [];
  fnScope.delPathAoa = [];
  fnScope.runningSharedKey = 0;
  return targetKeys;
}

export function markFnStart(fnKey: string, sharedKey: number) {
  const fnScope = getFnScope();
  fnScope.runningFnKey = fnKey;
  fnScope.runningSharedKey = sharedKey;
  fnScope.isIgnore = false;
}

export function registerFn(fn: Fn, options: { specificProps: Partial<IFnCtx> & { scopeType: ScopeType }; fnCtxBase?: IFnCtx }) {
  const { specificProps, fnCtxBase } = options;
  const { scopeType } = specificProps;
  const fnKey = markFnKey(fn, scopeType);
  const props = { fn, fnKey, ...specificProps };
  // 如 fnCtxBase 存在则 fnCtx 指向用户透传的 fnCtxBase
  const fnCtx = fnCtxBase ? Object.assign(fnCtxBase, props) : buildFnCtx(props);

  // static 调用派生时始终记录 fnCtx
  // hook 调用派生时仅在非服务器端执行才记录 fnCtx ，避免内存泄露
  if (scopeType === 'static' || !RUN_AT_SERVER) {
    // debugger;
    getCtxMap(scopeType).set(fnKey, fnCtx);
  }

  return fnCtx;
}

export function delFn(fn: Fn) {
  const fnKey = getFnKey(fn);
  if (!fnKey) return;

  const fnCtx = getFnCtx(fnKey);
  fnCtx && delFnCtx(fnCtx);
}

export function delFnCtx(fnCtx: IFnCtx) {
  const { FNKEY_HOOK_CTX_MAP, UNMOUNT_INFO_MAP } = getFnScope();
  const { fnKey } = fnCtx;
  delFnDep(fnCtx);
  // 删除延迟的 watch 函数，严格模式下的下一次挂载无需再执行此函数
  fnCtx.extra.deferedWatch = null;
  // 删除当前fnKey 与 hookFnCtx 的映射关系
  FNKEY_HOOK_CTX_MAP.delete(fnKey);

  if (UNMOUNT_INFO_MAP.get(fnKey)?.c === 2) {
    UNMOUNT_INFO_MAP.delete(fnKey);
  }
  delHistoryUnmoutFnCtx();
}

export function shouldShowComputing(fnCtx: IFnCtx) {
  const { DEPKEY_COMPUTING_FNKEYS_MAP } = getFnScope();
  const { prevLevelFnKeys, depKeys } = fnCtx;
  let ret = false;
  for (const depKey of depKeys) {
    const fnKeys = DEPKEY_COMPUTING_FNKEYS_MAP.get(depKey) || [];
    // 正在计算的函数中有，包含有 prevLevelFnKeys 任意一项，需要显示计算中
    if (includeOne(fnKeys, prevLevelFnKeys)) {
      ret = true;
      break;
    }
  }
  return ret;
}
