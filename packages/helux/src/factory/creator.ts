import { IOperateParams, createDraft, finishDraft, immut } from 'limu';
import { KEY_SPLITER, IS_ATOM, HAS_SYMBOL } from '../consts';
import { getGlobalIdInsKeys, getGlobalInternal, getMarkAtomMap } from '../factory/root';
import * as fnDep from '../helpers/fndep';
import { runInsUpdater } from '../helpers/ins';
import { createHeluxObj, createOb, injectHeluxProto } from '../helpers/obj';
import { bindInternal, clearInternal, getInternal, getSharedKey, mapSharedState, markSharedKey, recordMod } from '../helpers/state';
import { dedupList, isFn, isObj, isSymbol, nodupPush, delListItem, has, prefixValKey, safeGet, warn, setNoop, canUseDeep, genOpParams } from '../utils';
import { buildInternal, InsCtxDef, TInternal } from './common/buildInternal';
import type {
  Dict, DictN, Fn, ICreateOptions, IHeluxParams, IInsCtx, ICreateOptionsType, TriggerReason, ISetStateOptions,
  SetAtom, SetState, IInnerCreateOptions, KeyIdsDict, NumStrSymbol, KeyInsKeysDict,
} from '../types';

/** 这个是给 helux-signal 使用的数据，目前暂时还用不上 */
let depStats: DictN<Array<string>> = {};

function mapDepStats(sharedKey: number) {
  const keys = safeGet(depStats, sharedKey, []);
  return keys;
}

function recordDep(sharedKey: number, valKey: string | symbol) {
  const keys = mapDepStats(sharedKey);
  nodupPush(keys, valKey);
}

function getDepKeyByPath(fullKeyPath: string[], sharedKey: number) {
  return prefixValKey(fullKeyPath.join(KEY_SPLITER), sharedKey);
}

function handleOperate(
  opParams: IOperateParams,
  opts: {
    internal: TInternal, writeKeyPathInfo: Dict<TriggerReason>, ids: string[], globalIds: string[],
    writeKeys: Dict, writeKey2Ids: KeyIdsDict, writeKey2GlobalIds: KeyIdsDict,
  },
) {
  const { isChange, fullKeyPath, keyPath, parentType } = opParams;
  const { writeKeyPathInfo, ids, globalIds, writeKeys, writeKey2Ids, writeKey2GlobalIds, internal } = opts;
  const { moduleName, sharedKey, createOptions } = internal;
  if (!isChange) return;

  const keyPrefix = prefixValKey('', sharedKey); // as namespace
  const curWriteKey = getDepKeyByPath(fullKeyPath, sharedKey);
  writeKeyPathInfo[curWriteKey] = { sharedKey, moduleName, keyPath: fullKeyPath };

  // 设定了非精确更新策略时，提取出第一层更新路径即可
  if (!createOptions.exact) {
    const level1Key = `${keyPrefix}${fullKeyPath[0]}`;
    writeKeys[level1Key] = 1;
    return;
  }

  // 用户设定了精确更新策略，则只查当前更新路径的视图
  const putId = (keyIds: KeyIdsDict, ids: string[]) => {
    // find update ids configured in rules
    Object.keys(keyIds).forEach((confWriteKey) => {
      // writeKey: 1/a|list|0|name
      // confWriteKey: 1/a|list
      if (writeKey.startsWith(confWriteKey)) {
        keyIds[confWriteKey].forEach(id => nodupPush(ids, id));
      }
    });
  };

  let writeKey = curWriteKey;
  if (parentType === 'Array') {
    writeKey = prefixValKey(keyPath.join(KEY_SPLITER), sharedKey);
  }
  writeKeys[writeKey] = 1;

  putId(writeKey2Ids, ids);
  putId(writeKey2GlobalIds, globalIds);
}

/**
 * 解析出 createShared 里配置的 rules
 */
function parseRules(heluxParams: IHeluxParams) {
  const { markedState, sharedKey, createOptions } = heluxParams;
  const { deep, rules } = createOptions;
  const writeKey2Ids: KeyIdsDict = {};
  const writeKey2GlobalIds: KeyIdsDict = {};
  const isDeep = canUseDeep(deep);

  rules.forEach(rule => {
    const writeKeys: string[] = [];
    const { when, ids = [], globalIds = [] } = rule;
    if (!ids.length && !globalIds.length) {
      return;
    }

    let state: any;
    let keyReaded = false;
    if (isDeep) {
      let pervKey = '';
      state = immut(markedState, {
        onOperate: ({ fullKeyPath }) => {
          // 只记录单一路径下读取的最长的那个key，
          // 即 a.b.c 行为会触发 ['a'] ['a','b'] ['a','b','c'] 3次 onOperate 操作
          // 但 writeKeys 只记录['a','b','c'] 这一次生成的 key
          const writeKey = getDepKeyByPath(fullKeyPath, sharedKey);
          if (pervKey && writeKey.includes(pervKey)) {
            // 是一条路径中正在下钻的key，将之前的弹出
            writeKeys.pop();
          }
          writeKeys.push(writeKey);
          pervKey = writeKey;
          keyReaded = true;
        },
      });
    } else {
      state = createOb(
        markedState,
        {
          set: setNoop,
          get: (target: Dict, key: any) => {
            const writeKey = getDepKeyByPath([key], sharedKey);
            writeKeys.push(writeKey);
            keyReaded = true;
            return target[key];
          },
        },
      );
    }

    const result = when(state);
    // record id and globalId
    const setId = (writeKey: string) => {
      const idList = safeGet(writeKey2Ids, writeKey, [] as NumStrSymbol[]);
      ids.forEach(id => nodupPush(idList, id));
      const globalIdList = safeGet(writeKey2GlobalIds, writeKey, [] as NumStrSymbol[]);
      globalIds.forEach(id => nodupPush(globalIdList, id));
    };
    writeKeys.forEach(setId);

    if (
      keyReaded
      || result === state // 返回了state自身
      || (Array.isArray(result) && result.includes(state)) // 返回了数组，包含有state自身
    ) {
      setId(`${sharedKey}`);
    }
  });

  return { writeKey2Ids, writeKey2GlobalIds };
}

/** 干预 setState 调用结束后收集到的依赖项（新增或删除） */
function interveneDeps(opts: { internal: TInternal, depKeys: string[], fn?: Fn, add: boolean }) {
  const { depKeys, fn, add, internal } = opts;
  if (isFn(fn)) {
    const { rawState, sharedKey, createOptions } = internal;
    const { deep } = createOptions;
    const isDeep = canUseDeep(deep);
    let state: any;
    const record = (keyPath: string[]) => {
      const depKey = getDepKeyByPath(keyPath, sharedKey);
      add ? nodupPush(depKeys, depKey) : delListItem(depKeys, depKey);
    };

    if (isDeep) {
      state = immut(rawState, {
        onOperate: ({ fullKeyPath }) => record(fullKeyPath),
      });
    } else {
      state = createOb(
        rawState,
        {
          set: setNoop,
          get: (target: Dict, key: any) => {
            record([key]);
            return target[key];
          },
        },
      );
    }

    fn(state);
  }
}

export function parseOptions(options?: ICreateOptionsType) {
  let enableReactive = false;
  let enableRecordDep = false;
  let copyObj = false;
  let enableSyncOriginal = true;
  let moduleName = '';
  let deep = true;
  let exact = true;
  let rules: ICreateOptions['rules'] = [];

  // for ts check, write 'typeof options' 3 times
  if (typeof options === 'boolean') {
    enableReactive = options;
  } else if (typeof options === 'string') {
    moduleName = options;
  } else if (options && typeof options === 'object') {
    enableReactive = options.enableReactive ?? false;
    enableRecordDep = options.enableRecordDep ?? false;
    copyObj = options.copyObj ?? false;
    enableSyncOriginal = options.enableSyncOriginal ?? true;
    moduleName = options.moduleName || '';
    deep = options.deep ?? true;
    exact = options.exact ?? true;
    rules = options.rules ?? [];
  }

  return { enableReactive, enableRecordDep, copyObj, enableSyncOriginal, moduleName, deep, exact, rules };
}

function parseRawState<T extends Dict = Dict>(stateOrStateFn: T | (() => T)) {
  let rawState = stateOrStateFn as T;
  if (isFn(stateOrStateFn)) {
    rawState = stateOrStateFn();
  }
  if (!isObj(rawState)) {
    throw new Error('ERR_NON_OBJ: pass an non-object to createShared!');
  }
  if (getSharedKey(rawState)) {
    throw new Error('ERR_ALREADY_SHARED: pass a shared object to createShared!');
  }

  return rawState;
}

function getHeluxParams(rawState: Dict, createOptions: IInnerCreateOptions): IHeluxParams {
  const { copyObj, enableSyncOriginal, moduleName } = createOptions;
  let markedState; // object marked shared key
  let shouldSync = false;
  if (copyObj) {
    shouldSync = enableSyncOriginal;
    markedState = createHeluxObj(rawState);
  } else {
    markedState = injectHeluxProto(rawState);
  }
  const sharedKey = markSharedKey(markedState);
  return { rawState, markedState, shouldSync, sharedKey, createOptions, moduleName: moduleName || `${sharedKey}` };
}

/**
 * 创建全局使用的共享对象，可提供给 useShared useDerived useWatch derived watch 函数使用
 */
function buildSharedState(heluxParams: IHeluxParams) {
  let sharedState: Dict = {};
  const { rawState, markedState, sharedKey, shouldSync, createOptions } = heluxParams;
  const { enableReactive, enableRecordDep, deep, forAtom } = createOptions;
  const collectDep = (key: string) => {
    const depKey = prefixValKey(key, sharedKey);
    if (enableRecordDep) {
      recordDep(sharedKey, depKey);
    }
    // using shared state in derived/watch callback
    fnDep.recordValKeyDep(depKey, { sharedKey });
  };

  if (canUseDeep(deep)) {
    sharedState = immut(markedState, {
      customKeys: [IS_ATOM as symbol],
      customGet: () => forAtom,
      onOperate: (params) => {
        collectDep(params.fullKeyPath.join(KEY_SPLITER));
      },
    });
  } else {
    sharedState = createOb(
      markedState, {
      set: (target: Dict, key: any, val: any) => {
        if (enableReactive) {
          markedState[key] = val;
          if (shouldSync) {
            rawState[key] = val;
          }

          // TODO: add nextTick mechanism to control update frequency?
          getInternal(markedState).setState({ [key]: val });
        } else {
          warn('changing shared state is invalid');
        }
        return true;
      },
      get: (target: Dict, key: any) => {
        if (key === IS_ATOM) {
          return forAtom;
        }
        if (isSymbol(key)) {
          return target[key];
        }
        collectDep(key);
        return target[key];
      },
    });
  }
  mapSharedState(sharedKey, sharedState);
  if (!HAS_SYMBOL) {
    getMarkAtomMap().set(sharedState, forAtom);
  }

  return sharedState;
}

function execDepFnAndInsUpdater(
  state: Dict,
  ctx: {
    forAtom: boolean, ids: string[], globalIds: string[], depKeys: string[], triggerReasons: TriggerReason[],
    key2InsKeys: Record<string, number[]>, id2InsKeys: Record<string, number[]>, internal: TInternal,
    insCtxMap: Map<number, IInsCtx>,
  },
) {
  const { forAtom, ids, globalIds, depKeys, triggerReasons, internal, key2InsKeys, id2InsKeys, insCtxMap } = ctx;
  internal.ver += 1;
  // find associate ins keys
  let allInsKeys: number[] = [];
  let globalInsKeys: number[] = [];
  // find associate derived/watch fn ctxs
  let allFirstLevelFnKeys: string[] = [];
  let allAsyncFnKeys: string[] = [];
  const runCountStats: Dict<number> = {};

  depKeys.forEach((key) => {
    allInsKeys = allInsKeys.concat(key2InsKeys[key] || []);
    const { firstLevelFnKeys, asyncFnKeys } = fnDep.getDepFnStats(key, runCountStats);
    allFirstLevelFnKeys = allFirstLevelFnKeys.concat(firstLevelFnKeys);
    allAsyncFnKeys = allAsyncFnKeys.concat(asyncFnKeys);
  });
  // find id's ins keys
  ids.forEach(id => {
    allInsKeys = allInsKeys.concat(id2InsKeys[id] || []);
  });
  // find globalId's ins keys
  globalIds.forEach(id => {
    getGlobalIdInsKeys(id).forEach(insKey => globalInsKeys.push(insKey));
  });

  // deduplicate
  allInsKeys = dedupList(allInsKeys);
  allFirstLevelFnKeys = dedupList(allFirstLevelFnKeys);
  allAsyncFnKeys = dedupList(allAsyncFnKeys);

  // start execute compute/watch fns
  allAsyncFnKeys.forEach((fnKey) => fnDep.markComputing(fnKey, runCountStats[fnKey]));
  allFirstLevelFnKeys.forEach((fnKey) => fnDep.runFn(fnKey, { forAtom, updateReasons: triggerReasons }));

  // start update
  allInsKeys.forEach((insKey) => {
    runInsUpdater(insCtxMap.get(insKey) as InsCtxDef, state);
  });
  // start update globalId ins
  if (globalInsKeys.length) {
    const globalInsCtxMap = getGlobalInternal().insCtxMap;
    globalInsKeys.forEach((insKey) => {
      runInsUpdater(globalInsCtxMap.get(insKey) as InsCtxDef, state);
    });
  }
};

interface IHanldeStateCtx extends ISetStateOptions {
  state: Dict;
  internal: TInternal;
  depKeys: string[];
  ids: string[];
  globalIds: string[];
  triggerReasons: TriggerReason[];
  forAtom: boolean;
}

function handleState(opts: IHanldeStateCtx) {
  const { state, depKeys, ids, globalIds, triggerReasons, extraDeps, excludeDeps, internal, forAtom } = opts;
  const { key2InsKeys, id2InsKeys, insCtxMap, rawState } = internal;
  Object.assign(rawState, state);
  if (internal.isDeep) { // now state is a structurally shared obj generated by limu
    internal.rawStateSnap = state;
  } else {
    if (internal.shouldSync) {
      Object.assign(rawState, state);
    }
    internal.rawStateSnap = { ...rawState };
  }
  interveneDeps({ internal, depKeys, add: true, fn: extraDeps });
  interveneDeps({ internal, depKeys, add: false, fn: excludeDeps });
  execDepFnAndInsUpdater(state, { forAtom, internal, ids, globalIds, depKeys, triggerReasons, key2InsKeys, id2InsKeys, insCtxMap });
}

interface IHandleDeepMutateOpts extends ISetStateOptions {
  internal: TInternal;
  forAtom: boolean;
}

/**
 * deep模式下，生成limu返回的草稿状态，用户可以对草稿做任意修改，且不会影响原状态
 */
export function handleDeepMutate(opts: IHandleDeepMutateOpts) {
  const { internal } = opts;
  const { writeKey2Ids, rawState, writeKey2GlobalIds } = internal;

  const depKeys: string[] = [];
  const triggerReasons: TriggerReason[] = [];
  const ids: string[] = [];
  const globalIds: string[] = [];
  const writeKeys: Dict = {};
  const writeKeyPathInfo: Dict<TriggerReason> = {};
  const handleOpts = { state: {}, depKeys, ids, globalIds, triggerReasons, ...opts };
  const draft = createDraft(rawState, {
    onOperate(opParams) {
      handleOperate(opParams, { internal, ids, globalIds, writeKeys, writeKeyPathInfo, writeKey2Ids, writeKey2GlobalIds });
    },
  });

  return {
    draft,
    finishMutate(partial?: Dict) {
      // 把深依赖和迁依赖收集到的keys合并起来
      if (isObj(partial)) {
        Object.keys(partial).forEach(key => {
          nodupPush(depKeys, key);
          draft[key] = partial[key];
        });
      }
      handleOpts.depKeys = Object.keys(writeKeys);
      handleOpts.state = finishDraft(draft); // a structurally shared state generated by limu
      handleOpts.triggerReasons = Object.values(writeKeyPathInfo);
      handleState(handleOpts);

      return opts.internal.rawStateSnap;
    },
  };
}

interface IHandleNormalMutateOpts extends ISetStateOptions {
  internal: TInternal;
  forAtom: boolean;
}

/**
 * 非deep模式下，只是用Proxy或defineProperty生成一个仅代理一层的超过对象
 * 此时如果修改2层路径以上的值会修改原对象
 */
export function handleNormalMutate(opts: IHandleNormalMutateOpts) {
  const { internal } = opts;
  const { rawState, sharedKey, moduleName, writeKey2Ids, writeKey2GlobalIds } = internal;
  const newPartial: Dict = {};
  const mayChangedKeys: string[] = [];

  const depKeys: string[] = [];
  const triggerReasons: TriggerReason[] = [];
  const ids: string[] = [];
  const globalIds: string[] = [];
  const writeKeys: Dict = {};
  const writeKeyPathInfo: Dict<TriggerReason> = {};
  const handleOpts = { state: {}, depKeys, ids, globalIds, triggerReasons, ...opts };
  const handleValueChange = (key: string, value: any) => {
    handleOperate(
      genOpParams(key, value),
      { internal, ids, globalIds, writeKeys, writeKeyPathInfo, writeKey2Ids, writeKey2GlobalIds },
    );
  };

  // 为了和 deep 模式下返回的 setState 保持行为一致
  const mockDraft = createOb(
    rawState,
    {
      set: (target: Dict, key: any, value: any) => {
        newPartial[key] = value;
        handleValueChange(key, value);
        return true;
      },
      get: (target: Dict, key: any) => {
        mayChangedKeys.push(key);
        return has(newPartial, key) ? newPartial[key] : target[key];
      },
    },
  );

  return {
    draft: mockDraft,
    finishMutate(partial?: Dict) {
      /**
       * 兼容非 deep 模式下用户的以下代码
       * ```txt
       * setState(state=>({a: state.a + 1}));
       * setState(state=>(state.a = state.a + 1));
       * setState(state=>{state.a = state.a + 1; return { b: state.a + 1 }});
       * ```
       */
      if (isObj(partial)) {
        Object.assign(newPartial, partial);
        Object.keys(partial).forEach((key) => handleValueChange(key, partial[key]));
      }
      /**
       * 让非 deep 模式下用户的以下代码，能够推导出 a 发生了改变
       * ```txt
       * setState(state=>(state.a.b = 1));
       * ```
       * 注意此处可能发生误判，例如下面写法，会猜测为 state.a state.b 均发生了改变
       * 为了能够正确触发渲染而妥协允许存在冗余渲染，这是在浅收集模式下使用 mutable 修改状态没办法避免的事情
       * ```txt
       * setState(state=>(state.a.b = state.b.n + 1 ));
       * ```
       */
      mayChangedKeys.forEach(key => {
        newPartial[key] = rawState[key];
        handleValueChange(key, newPartial[key]);
      });

      Object.keys(newPartial).forEach((key) => {
        const depKey = prefixValKey(key, sharedKey);
        depKeys.push(depKey);
        triggerReasons.push({ sharedKey, moduleName, keyPath: [depKey] });
      });
      handleOpts.state = newPartial;
      handleState(handleOpts);

      return internal.rawStateSnap;
    },
  }
}

function bindInternalToShared(sharedState: Dict, heluxParams: IHeluxParams) {
  const { createOptions } = heluxParams;
  const { deep, forAtom } = createOptions;
  const insCtxMap = new Map<number, InsCtxDef>();
  const key2InsKeys: KeyInsKeysDict = {};
  // id --> insKeys
  const id2InsKeys: KeyInsKeysDict = {};
  const { writeKey2Ids, writeKey2GlobalIds } = parseRules(heluxParams);
  const isDeep = canUseDeep(deep);

  // setState implementation
  const setState: SetState = (partialState, options = {}) => {
    if (partialState === internal.rawStateSnap) {
      // do nothing
      return partialState;
    }
    let ctx;
    let returnedPartial;
    // deep 模式修改： setState(draft=>{draft.x.y=1})
    if (isFn(partialState) && isDeep) {
      // now partialState is a draft recipe callback
      ctx = handleDeepMutate({ forAtom, internal, ...options });
      // returnedPartial 是为了对齐非deep模式的 setState，这个只支持一层依赖收集
      returnedPartial = partialState(ctx.draft);
    } else {
      ctx = handleNormalMutate({ forAtom, internal });
      returnedPartial = isFn(partialState) ? partialState(ctx.draft) : partialState;
    }

    return ctx.finishMutate(returnedPartial);
  };
  // setAtom implementation
  const setAtom: SetAtom = (atomVal, options) => {
    const atomState = !isFn(atomVal) ? { val: atomVal } : atomVal;
    return setState(atomState, options).val;
  };

  const internal = buildInternal(heluxParams, {
    setState,
    setAtom,
    insCtxMap,
    key2InsKeys,
    id2InsKeys,
    writeKey2Ids,
    writeKey2GlobalIds,
    isDeep,
  });

  bindInternal(sharedState, internal);
}

export function setShared(sharedList: Dict[]) {
  sharedList.forEach((shared) => mapDepStats(getSharedKey(shared)));
}

export function getDepStats() {
  const curDepStats = depStats;
  depStats = {};
  return curDepStats;
}

export function buildSharedObject<T extends Dict = Dict>(stateOrStateFn: T | (() => T), options: IInnerCreateOptions) {
  const rawState = parseRawState(stateOrStateFn);
  const heluxParams = getHeluxParams(rawState, options);
  const sharedState = buildSharedState(heluxParams);
  clearInternal(options.moduleName);
  bindInternalToShared(sharedState, heluxParams);
  recordMod(sharedState, options);
  fnDep.markExpired();

  const internal = getInternal(sharedState);
  return { sharedState, internal };
}
