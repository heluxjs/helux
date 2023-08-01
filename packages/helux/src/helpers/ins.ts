import { immut } from 'limu';
import { EXPIRE_MS, KEY_SPLITER, NOT_MOUNT, RENDER_END, RENDER_START, SHARED_KEY } from '../consts';
import type { InsCtxDef } from '../factory/common/buildInternal';
import { getHeluxRoot } from '../factory/root';
import * as fnDep from '../helpers/fndep';
import { getInternal } from '../helpers/state';
import type { Dict, IFnCtx } from '../types';
import { isSymbol, prefixValKey, warn } from '../utils';
import { clearDep } from './insdep';
import { createOb } from './obj';

function getScope() {
  return getHeluxRoot().help.insDep;
}

const scope = getScope();

export function attachInsProxyState(insCtx: InsCtxDef, enableReactive: boolean) {
  const { internal } = insCtx;
  const { sharedKey, rawState, isDeep } = insCtx.internal;

  const collectDep = (key: string) => {
    const depKey = prefixValKey(key, sharedKey);
    insCtx.readMap[depKey] = 1;
    if (insCtx.renderStatus !== RENDER_END) {
      internal.recordDep(depKey, insCtx.insKey);
    }
    // record computed/watch dep
    fnDep.recordValKeyDep(depKey);
  };

  if (isDeep) {
    insCtx.proxyState = immut(rawState, {
      onOperate: (params) => {
        collectDep(params.fullKeyPath.join(KEY_SPLITER));
      },
      compareVer: true,
      extraProps: { [SHARED_KEY]: sharedKey },
    });
  } else {
    insCtx.proxyState = createOb(
      rawState,
      // setter
      (target: Dict, key: string, val: any) => {
        // @ts-ignore
        target[key] = val;
        if (enableReactive) {
          internal.setState({ [key]: val });
        }
        return true;
      },
      // getter
      (target: Dict, key: string) => {
        if (isSymbol(key)) {
          return target[key];
        }
        collectDep(key);
        return target[key];
      },
    );
  }
}

export function getInsKey() {
  let keySeed = scope.keySeed;
  keySeed = keySeed === Number.MAX_SAFE_INTEGER ? 1 : keySeed + 1;
  scope.keySeed = keySeed;
  return keySeed;
}

export function runInsUpdater(insCtx: InsCtxDef | undefined, partialState: Dict) {
  if (!insCtx) return;
  const { setState, mountStatus, createTime } = insCtx;
  if (mountStatus === NOT_MOUNT && Date.now() - createTime > EXPIRE_MS) {
    return clearDep(insCtx);
  }

  setState(partialState);
}

export function buildInsCtx(options: any): InsCtxDef {
  const { setState, sharedState, enableReactive } = options;
  const insKey = getInsKey();
  const internal = getInternal(sharedState);
  if (!internal) {
    throw new Error('ERR_OBJ_NOT_SHARED: input object is not a result returned by createShared');
  }

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
    subscribe: (cb) => {
      // console.log('call insDep subscribe, snap changed', cb);
      cb();
    },
  };
  attachInsProxyState(insCtx, enableReactive);
  internal.mapInsCtx(insKey, insCtx);
  return insCtx;
}

export function attachInsComputedResult(fnCtx: IFnCtx) {
  const { result } = fnCtx;

  // TODO: 或许 4.0 版本可参考 buildInsCtx，实现计算结果的深依赖收集，这里需要仔细思考下
  // 已计算结果每次都是全新生成的，如何实现部分节点更新和计算理念本身有点冲突
  fnCtx.proxyResult = createOb(
    result,
    // setter
    () => {
      warn('changing computed result is invalid');
      return false;
    },
    // getter
    (target: Dict, resultKey: string) => {
      if (RENDER_START === fnCtx.renderStatus) {
        fnDep.revertDep(fnCtx);
        fnCtx.isResultReaded = true;
        fnCtx.isResultReadedOnce = true;
      }

      return result[resultKey];
    },
  );
}
