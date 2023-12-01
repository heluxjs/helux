import { delListItem, isFn, isSymbol, nodupPush, prefixValKey, warn } from '@helux/utils';
import { immut, limuUtils } from 'limu';
import { EXPIRE_MS, IS_DERIVED_ATOM, KEY_SPLITER, NOT_MOUNT, RENDER_END, RENDER_START } from '../consts';
import { genInsKey } from '../factory/common/key';
import { cutDepKeyByStop, recordArrKey } from '../factory/common/stopDep';
import type { InsCtxDef } from '../factory/creator/buildInternal';
import { mapGlobalId } from '../factory/creator/globalId';
import type { Dict, Ext, IFnCtx, IUseSharedStateOptions } from '../types/base';
import type { DepKeyInfo } from '../types/inner';
import * as fnDep from './fnDep';
import { clearDep } from './insDep';
import { createOb } from './obj';
import { getInternal } from './state';

const { isObject: isDict } = limuUtils;
const DICT = 'Object'; // 来自 limu 的字典类型表达
const OTHER = 'Other';

export function runInsUpdater(insCtx: InsCtxDef | undefined) {
  if (!insCtx) return;
  const { updater, mountStatus, createTime } = insCtx;
  if (mountStatus === NOT_MOUNT && Date.now() - createTime > EXPIRE_MS) {
    return clearDep(insCtx);
  }

  updater();
}

export function attachInsProxyState(insCtx: InsCtxDef) {
  const { internal, recordDep } = insCtx;
  const { rawState, isDeep, level1ArrKeys, sharedKey } = internal;

  const collectDep = (info: DepKeyInfo, parentType: string, value: any) => {
    if (!insCtx.canCollect) {
      // 无需收集依赖
      return;
    }
    if (Array.isArray(value)) {
      recordArrKey(level1ArrKeys, info.depKey);
    }
    recordDep(info, parentType);
  };

  if (isDeep) {
    insCtx.proxyState = immut(rawState, {
      onOperate: ({ isBuiltInFnKey, fullKeyPath, keyPath, parentType, value }) => {
        if (isBuiltInFnKey) return;
        const depKey = prefixValKey(fullKeyPath.join(KEY_SPLITER), sharedKey);
        collectDep({ depKey, keyPath: fullKeyPath, parentKeyPath: keyPath, sharedKey }, parentType, value);
      },
      compareVer: true,
    });
  } else {
    insCtx.proxyState = createOb(rawState, {
      set: () => {
        warn('changing shared state is invalid');
        return true;
      },
      get: (target: Dict, key: string) => {
        if (isSymbol(key)) {
          return target[key];
        }
        const depKey = prefixValKey(key, sharedKey);
        const value = target[key];
        const parentType = isDict(target) ? DICT : OTHER;
        collectDep({ depKey, keyPath: [key], sharedKey }, parentType, value);
        return value;
      },
    });
  }
}

export function buildInsCtx(options: Ext<IUseSharedStateOptions>): InsCtxDef {
  const { updater, sharedState, id = '', globalId = '', collectType = 'every', deps, pure = false } = options;
  const internal = getInternal(sharedState);
  if (!internal) {
    throw new Error('ERR_OBJ_NOT_SHARED: input object is not a result returned by share api');
  }

  const insKey = genInsKey();
  const { rawState, isDeep, ver, ruleConf, level1ArrKeys, forAtom } = internal;
  const { stopDepInfo } = ruleConf;
  const insCtx: InsCtxDef = {
    readMap: {},
    readMapPrev: {},
    readMapStrict: null,
    delReadMap: {},
    pure,
    depKeys: [],
    currentDepKeys: [],
    isDeep,
    insKey,
    internal,
    rawState,
    sharedState,
    proxyState: {},
    updater,
    mountStatus: NOT_MOUNT,
    renderStatus: RENDER_START,
    createTime: Date.now(),
    atomVal: null,
    ver,
    id,
    globalId,
    collectType,
    // 设定了 no，才关闭依赖收集功能，此时依赖靠 deps 函数提供
    canCollect: collectType !== 'no',
    isFirstRender: true,
    subscribe: (cb) => {
      // call insDep subscribe after snap changed
      cb();
    },
    /** 记录一些需复用的中间生成的数据 */
    extra: {},
    renderInfo: {
      sn: 0,
      getDeps: () => insCtx.currentDepKeys,
      // depKeys 的后续更新流程在 helpers/insDep.resetReadMap 和 updateDep 函数里，做了双保险备份
      getPrevDeps: () => insCtx.depKeys,
    },
    recordDep: (depKeyInfo: DepKeyInfo, parentType?: string) => {
      let depKey = depKeyInfo.depKey;
      // depKey 可能因为配置了 rules[]stopDep 的关系被 recordCb 改写
      cutDepKeyByStop(depKeyInfo, {
        stopDepInfo,
        level1ArrKeys,
        recordCb: (key) => {
          depKey = key;
        },
      });
      const { readMap, insKey, renderStatus, currentDepKeys, delReadMap } = insCtx;
      if (renderStatus === RENDER_END) {
        return;
      }

      // 还未被记录，也未被标记删除
      if (!readMap[depKey] && !delReadMap[depKey]) {
        // pure 模式下针对字典只记录最长路径依赖
        if (pure && parentType === DICT) {
          const parentKeyPath = depKeyInfo.parentKeyPath || [];
          const parentDepKey = prefixValKey(parentKeyPath.join(KEY_SPLITER), internal.sharedKey);
          if (readMap[parentDepKey]) {
            delete readMap[parentDepKey];
            delReadMap[parentDepKey] = 1;
            delListItem(currentDepKeys, parentDepKey);
          }
        }
        nodupPush(currentDepKeys, depKey);
        // 注意 depKey 对应的 insKey，和 insKey->insCtx.depKeys 记录是不对称的
        // 即 depKey a, a.b, a.b.c 都会记录 insKey 1
        // 但 insKey 1 在 pure 模式下 depKeys 就只有 a.b.c
        internal.recordDep(depKey, insKey);
        readMap[depKey] = 1;
      }

      // record watch dep
      // 支持 useWatch 的 deps 函数直接传入 useShared 返回的 state 作为依赖项传入
      fnDep.recordFnDepKeys([depKey], {});
    },
  };
  globalId && mapGlobalId(globalId, insKey);
  attachInsProxyState(insCtx);
  internal.mapInsCtx(insCtx, insKey);
  internal.recordId(id, insKey);

  // 首次渲染执行一次依赖项补充函数
  if (isFn(deps)) {
    // atom 自动拆箱
    const state = forAtom ? insCtx.proxyState.val : insCtx.proxyState;
    deps(state);
  }

  return insCtx;
}

export function attachInsDerivedResult(fnCtx: IFnCtx) {
  const { result, forAtom } = fnCtx;

  // MARK: 此计算结果不具备依赖收集特性，如需要此特性可使用 share接口的 mutate 配置可变派生结果
  // LABEL: proxyResult
  fnCtx.proxyResult = createOb(result, {
    set: () => {
      warn('changing derived result is invalid');
      return false;
    },
    get: (target: Dict, resultKey: string) => {
      if (IS_DERIVED_ATOM === resultKey) {
        return forAtom;
      }
      if (RENDER_START === fnCtx.renderStatus) {
        fnDep.ensureFnDepData(fnCtx);
      }
      return result[resultKey];
    },
  });
}
