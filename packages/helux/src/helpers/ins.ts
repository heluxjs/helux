import { immut } from 'limu';
import { EXPIRE_MS, KEY_SPLITER, NOT_MOUNT, RENDER_END, RENDER_START, WAY } from '../consts';
import type { InsCtxDef } from '../factory/common/buildInternal';
import { getInsKey } from '../factory/common/scope';
import { recordDataKeyForStop } from '../factory/common/util';
import { mapGlobalId } from '../factory/root';
import * as fnDep from '../helpers/fndep';
import { getInternal } from '../helpers/state';
import type { Dict, Ext, IFnCtx, IUseSharedOptions } from '../types';
import { isFn, isSymbol, prefixValKey, warn } from '../utils';
import { clearDep } from './insdep';
import { createOb } from './obj';

export function runInsUpdater(insCtx: InsCtxDef | undefined, partialState: Dict) {
  if (!insCtx) return;
  const { setState, mountStatus, createTime } = insCtx;
  if (mountStatus === NOT_MOUNT && Date.now() - createTime > EXPIRE_MS) {
    return clearDep(insCtx);
  }

  setState(partialState);
}

export function attachInsProxyState(insCtx: InsCtxDef, enableReactive?: boolean) {
  const { internal, way } = insCtx;
  const { sharedKey, rawState, isDeep, ruleConf } = insCtx.internal;

  const collectDep = (key: string) => {
    if (
      !insCtx.canCollect // 无需收集依赖
      || (way === WAY.FIRST_RENDER && !insCtx.isFirstRender) // 仅第一轮渲染收集依赖
    ) {
      return;
    }

    // depKey 可能因为配置了 rules[]stopDep 的关系被改写
    let depKey = prefixValKey(key, sharedKey);
    recordDataKeyForStop(depKey, ruleConf.stopDepInfo, (key) => {
      depKey = key;
    });

    if (insCtx.readMap[depKey] !== 1) {
      insCtx.readMap[depKey] = 1;
      if (insCtx.renderStatus !== RENDER_END) {
        internal.recordDep(depKey, insCtx.insKey);
      }
      // record derive/watch dep
      fnDep.recordValKeyDep(depKey);
    }
  };

  if (isDeep) {
    insCtx.proxyState = immut(rawState, {
      onOperate: (params) => {
        if (!params.isBuiltInFnKey) {
          collectDep(params.fullKeyPath.join(KEY_SPLITER));
        }
      },
      compareVer: true,
    });
  } else {
    insCtx.proxyState = createOb(rawState, {
      set: (target: Dict, key: string, val: any) => {
        // @ts-ignore
        target[key] = val;
        if (enableReactive) {
          internal.setState({ [key]: val });
        }
        return true;
      },
      get: (target: Dict, key: string) => {
        if (isSymbol(key)) {
          return target[key];
        }
        collectDep(key);
        return target[key];
      },
    });
  }
}

export function buildInsCtx(options: Ext<IUseSharedOptions>): InsCtxDef {
  const { setState, sharedState, enableReactive, id = '', globalId = '', staticDeps, way = WAY.EVERY_RENDER } = options;
  const internal = getInternal(sharedState);
  if (!internal) {
    throw new Error('ERR_OBJ_NOT_SHARED: input object is not a result returned by createShared');
  }
  const insKey = getInsKey();

  const { rawState, isDeep, ver } = internal;
  const insCtx: InsCtxDef = {
    readMap: {},
    readMapPrev: {},
    readMapStrict: null,
    isDeep,
    insKey,
    internal,
    rawState,
    sharedState,
    proxyState: {},
    setState,
    mountStatus: NOT_MOUNT,
    renderStatus: RENDER_START,
    createTime: Date.now(),
    ver,
    id,
    globalId,
    way,
    canCollect: true,
    hasStaticDeps: false,
    isFirstRender: true,
    subscribe: (cb) => {
      // call insDep subscribe after snap changed
      cb();
    },
    renderInfo: {
      sn: 0,
      getDeps: () => Object.keys(insCtx.readMap),
    },
  };
  globalId && mapGlobalId(globalId, insKey);
  attachInsProxyState(insCtx, enableReactive);
  internal.mapInsCtx(insCtx, insKey);
  internal.recordId(id, insKey);
  if (isFn(staticDeps)) {
    staticDeps(insCtx.proxyState);
    insCtx.canCollect = false; // 让后续的收集行为无效
    insCtx.hasStaticDeps = true;
  }
  return insCtx;
}

export function attachInsDerivedResult(fnCtx: IFnCtx) {
  const { result } = fnCtx;

  // MARK: 此计算结果不具备依赖收集特性，如需要此特性可使用 share接口 的 watch 加 mutate 配置完成
  fnCtx.proxyResult = createOb(result, {
    set: () => {
      warn('changing derived result is invalid');
      return false;
    },
    get: (target: Dict, resultKey: string) => {
      if (RENDER_START === fnCtx.renderStatus) {
        fnDep.revertDep(fnCtx);
        fnCtx.isResultReaded = true;
        fnCtx.isResultReadedOnce = true;
      }
      return result[resultKey];
    },
  });
}
