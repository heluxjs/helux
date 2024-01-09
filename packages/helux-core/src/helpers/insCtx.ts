import { delListItem, enureReturnArr, isFn, isSymbol, nodupPush, prefixValKey, warn } from '@helux/utils';
import { immut } from 'limu';
import { DICT, EXPIRE_MS, IS_DERIVED_ATOM, NOT_MOUNT, OTHER, RENDER_END, RENDER_START } from '../consts';
import { newOpParams } from '../factory/common/ctor';
import { hasRunningFn } from '../factory/common/fnScope';
import { genInsKey } from '../factory/common/key';
import { cutDepKeyByStop, recordArrKey } from '../factory/common/stopDep';
import { callOnRead, getDepKeyByPath, isArrLike, isArrLikeVal, isDict } from '../factory/common/util';
import type { InsCtxDef } from '../factory/creator/buildInternal';
import { handleCustomKey, handleHeluxKey } from '../factory/creator/buildShared';
import { mapGlobalId } from '../factory/creator/globalId';
import { buildReactive } from '../factory/creator/reactive';
import type { Dict, Ext, IFnCtx, IInnerUseSharedOptions, OnOperate } from '../types/base';
import type { DepKeyInfo } from '../types/inner';
import * as fnDep from './fnDep';
import { clearDep } from './insDep';
import { createOb } from './obj';
import { getInternal } from './state';

/**
 * 开始收集依赖
 */
function collectDep(insCtx: InsCtxDef, info: DepKeyInfo, options: { parentType: string; rawVal: any }) {
  if (!insCtx.canCollect) {
    // 无需收集依赖
    return;
  }
  const { parentType, rawVal } = options;
  const isValArrLike = isArrLikeVal(rawVal);
  if (isValArrLike) {
    recordArrKey(insCtx.internal.level1ArrKeys, info.depKey);
  }
  insCtx.recordDep(info, parentType, isValArrLike);
}

/**
 * 获取当前实例收集到依赖项（包含固定住的依赖）
 */
function getInsDeps(insCtx: InsCtxDef, isCurrent: boolean) {
  const { depKeys, currentDepKeys, fixedDepKeys } = insCtx;
  const dynamic = isCurrent ? currentDepKeys : depKeys;
  return dynamic.concat(fixedDepKeys);
}

export function runInsUpdater(insCtx: InsCtxDef | undefined) {
  if (!insCtx) return;
  const { updater, mountStatus, createTime } = insCtx;
  if (mountStatus === NOT_MOUNT) {
    if (Date.now() - createTime > EXPIRE_MS) {
      clearDep(insCtx);
    } else {
      insCtx.needEFUpdate = true;
    }
    return;
  }

  updater();
}

/**
 * 为实例创建代理对象并追加到 insCtx 上
 */
export function attachInsProxyState(insCtx: InsCtxDef) {
  const { internal, isReactive, insKey } = insCtx;
  const { rawState, isDeep, sharedKey, onRead, forAtom } = internal;
  if (isDeep) {
    const onOperate: OnOperate = (opParams) => {
      const { isBuiltInFnKey, key } = opParams;
      if (isBuiltInFnKey) return;
      if (isSymbol(key)) {
        return handleCustomKey(opParams, forAtom, sharedKey);
      }

      const { fullKeyPath, keyPath, parentType } = opParams;
      const rawVal = callOnRead(opParams, onRead);
      const depKey = getDepKeyByPath(fullKeyPath, sharedKey);
      const depKeyInfo = { depKey, keyPath: fullKeyPath, parentKeyPath: keyPath, sharedKey };
      collectDep(insCtx, depKeyInfo, { parentType, rawVal });
    };

    if (isReactive) {
      // 组件实例使用 useReactive(state) 返回的 reactive 对象时，会在 creator/operateState 里操作实例自己的 onOperate 句柄
      const { draft, draftRoot } = buildReactive(internal, { onRead: onOperate, insKey });
      insCtx.proxyState = draftRoot;
      insCtx.proxyStateVal = draft;
    } else {
      // 非 reactive 对象，外部 prepareTuple 里会自动拆箱，这里只需创建根代理对象即可
      // 对于 immut 对象来说，只会触发读操作
      insCtx.proxyState = immut(rawState, { onOperate, compareVer: true });
    }
  } else {
    // TODO
    // 如支持非 Proxy 环境，还有以下两点要做，但很可能这些代码会删掉，考虑让用户去使用 @helux/mini
    // 1 待 toShallowCopy 抽象完毕后，统一调用 toShallowCopy
    // 2 非 Proxy环境，对于数组 push pop 等操作，提供 markChanged 接口让 helux 感知到变化
    insCtx.proxyState = createOb(rawState, {
      set: () => {
        warn('changing shared state is invalid');
        return true;
      },
      get: (target: Dict, key: string) => {
        const value = target[key];
        if (isSymbol(key)) {
          return handleHeluxKey(true, forAtom, sharedKey, key, value);
        }
        const rawVal = callOnRead(newOpParams(key, value, { isChanged: false, parentKeyPath: [] }), onRead);
        const depKey = prefixValKey(key, sharedKey);
        const parentType = isDict(target) ? DICT : OTHER;
        collectDep(insCtx, { depKey, keyPath: [key], sharedKey }, { parentType, rawVal });
        return rawVal;
      },
    });
  }
}

/**
 * 为组件构建 insCtx
 */
export function buildInsCtx(options: Ext<IInnerUseSharedOptions>): InsCtxDef {
  const {
    updater,
    sharedState,
    id = '',
    globalId = '',
    collectType = 'every',
    deps,
    pure = true,
    arrDep = true,
    isReactive = false,
  } = options;
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
    delReadMap: {},
    pure,
    depKeys: [],
    fixedDepKeys: [],
    currentDepKeys: [],
    isDeep,
    isReactive,
    insKey,
    internal,
    rawState,
    sharedState,
    sharedKey,
    proxyState: {},
    proxyStateVal: {},
    updater,
    mountStatus: NOT_MOUNT,
    renderStatus: RENDER_START,
    needEFUpdate: false,
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
    /** 记录一些需复用的中间生成数据 */
    extra: {},
    getDeps: () => getInsDeps(insCtx, true),
    renderInfo: {
      isAtom: forAtom,
      setDraft: internal.insSetDraft,
      time: Date.now(),
      sn: 0,
      snap,
      insKey,
      getDeps: () => getInsDeps(insCtx, true),
      // depKeys 的后续更新流程在 helpers/insDep.resetReadMap 和 updateDep 函数里，做了双保险备份
      getPrevDeps: () => getInsDeps(insCtx, false),
    },
    recordDep: (depKeyInfo: DepKeyInfo, parentType?: string, isValArrLike?: boolean) => {
      let depKey = depKeyInfo.depKey;
      // depKey 可能因为配置了 rules[]stopDep 的关系被 recordCb 改写
      cutDepKeyByStop(depKeyInfo, {
        stopDepInfo,
        level1ArrKeys,
        recordCb: (key) => {
          depKey = key;
        },
      });
      const { renderStatus, fixedDepKeys } = insCtx;
      if (renderStatus === RENDER_END) {
        return;
      }
      const { readMap, insKey, currentDepKeys, delReadMap } = insCtx;

      // record watch dep
      // 支持 useWatch 的 deps 函数直接传入 useAtom 返回的 state 作为依赖项传入
      fnDep.recordFnDepKeys([depKey], {});
      // 在 useWatch deps 中执行，记为固定依赖
      if (hasRunningFn()) {
        delListItem(currentDepKeys, depKey);
        nodupPush(insCtx.fixedDepKeys, depKey);
      }

      const doRecord = () => {
        readMap[depKey] = 1;
        // 注意 depKey 对应的 insKeys，和 insKey->insCtx.depKeys 记录是不对称的
        // 即 depKey a, a.b, a.b.c 都会记录 insKey 1
        // 但 insKey 1 在 pure 模式下 depKeys 就只有 a.b.c
        internal.recordDep(depKey, insKey);
        // 未在固定列表时才记录
        if (!fixedDepKeys.includes(depKey)) {
          nodupPush(currentDepKeys, depKey);
        }
      };

      // 还未被记录，也未被标记删除
      if (!readMap[depKey] && !delReadMap[depKey]) {
        const { parentKeyPath } = depKeyInfo;

        // pure 模式下针对字典只记录最长路径依赖
        if (pure && parentType === DICT && parentKeyPath) {
          // 无 parentKeyPath 的话就是 dict 根对象自身，此时 parentDepKey 指向 sharedKey
          const parentDepKey = parentKeyPath.length ? getDepKeyByPath(parentKeyPath, sharedKey) : sharedKeyStr;
          // 删除父路径记录
          if (readMap[parentDepKey]) {
            delete readMap[parentDepKey];
            delReadMap[parentDepKey] = 1;
            delListItem(currentDepKeys, parentDepKey);
          }
        }

        const isParentArrLike = isArrLike(parentType);
        // 类数组记录下标规则依赖 arrIndexDep 值
        if (isParentArrLike) {
          arrIndexDep && doRecord();
          return;
        }
        if (
          !isValArrLike
          || (!isParentArrLike && arrDep) // 值是数组或 Map 时，开启了 arrDep 才记录
        ) {
          doRecord();
        }
      }
    },
  };
  globalId && mapGlobalId(globalId, insKey);
  attachInsProxyState(insCtx);
  internal.mapInsCtx(insCtx, insKey);
  internal.recordId(id, insKey);

  // 首次渲染执行一次依赖项补充函数，并记录为固定依赖项
  if (isFn(deps)) {
    // atom 自动拆箱
    const rootVal = forAtom ? insCtx.proxyState.val : insCtx.proxyState;
    const list = enureReturnArr(deps, rootVal);
    // 获得已收集到依赖并转为固定依赖
    const fixedDepKeys = insCtx.getDeps().slice();
    // 补上可能存在的根值依赖本身
    if (list.includes(rootVal)) {
      fixedDepKeys.push(internal.rootValKey);
    }
    // 存储到 insCtx
    insCtx.fixedDepKeys = fixedDepKeys;
  }

  return insCtx;
}

/**
 * 为组件创建全量导出结果代理对象
 */
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
