import { delListItem, isFn, isSymbol, nodupPush, prefixValKey, warn } from '@helux/utils';
import { immut, limuUtils } from 'limu';
import { ARR, DICT, EXPIRE_MS, IS_DERIVED_ATOM, KEY_SPLITER, NOT_MOUNT, OTHER, RENDER_END, RENDER_START } from '../consts';
import { genInsKey } from '../factory/common/key';
import { cutDepKeyByStop, recordArrKey } from '../factory/common/stopDep';
import { chooseProxyVal, chooseVal, newOpParams } from '../factory/common/util';
import type { InsCtxDef } from '../factory/creator/buildInternal';
import { mapGlobalId } from '../factory/creator/globalId';
import type { Dict, Ext, IFnCtx, IUseSharedStateOptions } from '../types/base';
import type { DepKeyInfo } from '../types/inner';
import * as fnDep from './fnDep';
import { clearDep } from './insDep';
import { createOb } from './obj';
import { getInternal } from './state';

const { isObject: isDict } = limuUtils;

function collectDep(insCtx: InsCtxDef, info: DepKeyInfo, parentType: string, value: any) {
  if (!insCtx.canCollect) {
    // 无需收集依赖
    return;
  }
  const isValArr = Array.isArray(value);
  if (isValArr) {
    recordArrKey(insCtx.internal.level1ArrKeys, info.depKey);
  }
  insCtx.recordDep(info, parentType, isValArr);
}

export function runInsUpdater(insCtx: InsCtxDef | undefined) {
  if (!insCtx) return;
  const { updater, mountStatus, createTime } = insCtx;
  if (mountStatus === NOT_MOUNT && Date.now() - createTime > EXPIRE_MS) {
    return clearDep(insCtx);
  }
  updater();
}

export function attachInsProxyState(insCtx: InsCtxDef) {
  const { internal } = insCtx;
  const { rawState, isDeep, sharedKey, onRead } = internal;
  if (isDeep) {
    insCtx.proxyState = immut(rawState, {
      onOperate: (opParams) => {
        if (opParams.isBuiltInFnKey) return;
        const { fullKeyPath, keyPath, parentType, value, proxyValue } = opParams;
        // 触发用户定义的钩子函数
        const { proxyVal, rawVal } = chooseProxyVal(onRead(opParams), proxyValue, value);
        const depKey = prefixValKey(fullKeyPath.join(KEY_SPLITER), sharedKey);
        const depKeyInfo = { depKey, keyPath: fullKeyPath, parentKeyPath: keyPath, sharedKey };
        collectDep(insCtx, depKeyInfo, parentType, rawVal);
        return proxyVal;
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
        const value = target[key];
        if (isSymbol(key)) {
          return value;
        }

        const finalVal = chooseVal(onRead(newOpParams(key, value, false)), value);
        const depKey = prefixValKey(key, sharedKey);
        const parentType = isDict(target) ? DICT : OTHER;
        collectDep(insCtx, { depKey, keyPath: [key], sharedKey }, parentType, finalVal);
        return finalVal;
      },
    });
  }
}

export function buildInsCtx(options: Ext<IUseSharedStateOptions>): InsCtxDef {
  const { updater, sharedState, id = '', globalId = '', collectType = 'every', deps, pure = false, arrDep = true } = options;
  const arrIndexDep = !arrDep ? true : options.arrIndexDep ?? true;
  const internal = getInternal(sharedState);
  if (!internal) {
    throw new Error('ERR_OBJ_NOT_SHARED: input object is not a result returned by share api');
  }

  const insKey = genInsKey();
  const { rawState, isDeep, ver, ruleConf, level1ArrKeys, forAtom, sharedKey, sharedKeyStr, snap } = internal;
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
    rootVal: null,
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
    getDeps: () => insCtx.currentDepKeys,
    renderInfo: {
      sn: 0,
      snap,
      insKey,
      getDeps: () => insCtx.currentDepKeys.slice(),
      // depKeys 的后续更新流程在 helpers/insDep.resetReadMap 和 updateDep 函数里，做了双保险备份
      getPrevDeps: () => insCtx.depKeys.slice(),
    },
    recordDep: (depKeyInfo: DepKeyInfo, parentType?: string, isValArr?: boolean) => {
      let depKey = depKeyInfo.depKey;
      // depKey 可能因为配置了 rules[]stopDep 的关系被 recordCb 改写
      cutDepKeyByStop(depKeyInfo, {
        stopDepInfo,
        level1ArrKeys,
        recordCb: (key) => {
          depKey = key;
        },
      });
      const { renderStatus } = insCtx;
      if (renderStatus === RENDER_END) {
        return;
      }
      const { readMap, insKey, currentDepKeys, delReadMap } = insCtx;

      // record watch dep
      // 支持 useWatch 的 deps 函数直接传入 useShared 返回的 state 作为依赖项传入
      fnDep.recordFnDepKeys([depKey], {});
      const doRecord = () => {
        nodupPush(currentDepKeys, depKey);
        // 注意 depKey 对应的 insKeys，和 insKey->insCtx.depKeys 记录是不对称的
        // 即 depKey a, a.b, a.b.c 都会记录 insKey 1
        // 但 insKey 1 在 pure 模式下 depKeys 就只有 a.b.c
        internal.recordDep(depKey, insKey);
        readMap[depKey] = 1;
      };

      // 还未被记录，也未被标记删除
      if (!readMap[depKey] && !delReadMap[depKey]) {
        // pure 模式下针对字典只记录最长路径依赖
        if (pure && parentType === DICT) {
          const { parentKeyPath } = depKeyInfo;
          // 无 parentKeyPath 的话就是dict根对象自身，此时 parentDepKey 指向 sharedKey
          const isValidPath = parentKeyPath && parentKeyPath.length;
          const parentDepKey = isValidPath ? prefixValKey(parentKeyPath.join(KEY_SPLITER), sharedKey) : sharedKeyStr;
          if (readMap[parentDepKey]) {
            delete readMap[parentDepKey];
            delReadMap[parentDepKey] = 1;
            delListItem(currentDepKeys, parentDepKey);
          }
        }

        const isParentArr = parentType === ARR;
        if (isParentArr) {
          arrIndexDep && doRecord();
          return;
        }
        // 值是数组时，开启了 arrDep 才记录
        if (!isValArr || (!isParentArr && arrDep)) {
          doRecord();
        }
      }
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
