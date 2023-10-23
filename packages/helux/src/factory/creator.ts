import { createDraft, finishDraft, immut, IOperateParams } from 'limu';
import { HAS_SYMBOL, IS_ATOM, KEY_SPLITER } from '../consts';
import { getRenderSN } from '../factory/common/util';
import { getGlobalIdInsKeys, getGlobalInternal, getMarkAtomMap } from '../factory/root';
import * as fnDep from '../helpers/fndep';
import { runInsUpdater } from '../helpers/ins';
import { createHeluxObj, createOb, injectHeluxProto } from '../helpers/obj';
import {
  bindInternal,
  clearInternal,
  getInternal,
  getSharedKey,
  getWatchers,
  mapSharedState,
  markSharedKey,
  recordMod,
  setWatcher,
} from '../helpers/state';
import type {
  AsyncSetState,
  Dict,
  DictN,
  Fn,
  ICreateOptions,
  ICreateOptionsType,
  IHeluxParams,
  IInnerCreateOptions,
  IInnerSetStateOptions,
  InsCtxMap,
  ISetStateOptions,
  KeyIdsDict,
  KeyInsKeysDict,
  NumStrSymbol,
  SetAtom,
  SetState,
  SharedState,
  TriggerReason,
} from '../types';
import {
  canUseDeep,
  dedupList,
  delListItem,
  genOpParams,
  has,
  isFn,
  isObj,
  isSymbol,
  nodupPush,
  noop,
  prefixValKey,
  safeGet,
  setNoop,
  warn,
} from '../utils';
import { buildInternal, InsCtxDef, TInternal } from './common/buildInternal';

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
    internal: TInternal;
    writeKeyPathInfo: Dict<TriggerReason>;
    ids: string[];
    globalIds: string[];
    writeKeys: Dict;
    writeKey2Ids: KeyIdsDict;
    writeKey2GlobalIds: KeyIdsDict;
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
        keyIds[confWriteKey].forEach((id) => nodupPush(ids, id));
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

  rules.forEach((rule) => {
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
      state = createOb(markedState, {
        set: setNoop,
        get: (target: Dict, key: any) => {
          const writeKey = getDepKeyByPath([key], sharedKey);
          writeKeys.push(writeKey);
          keyReaded = true;
          return target[key];
        },
      });
    }

    const result = when(state);
    // record id and globalId
    const setId = (writeKey: string) => {
      const idList = safeGet(writeKey2Ids, writeKey, [] as NumStrSymbol[]);
      ids.forEach((id) => nodupPush(idList, id));
      const globalIdList = safeGet(writeKey2GlobalIds, writeKey, [] as NumStrSymbol[]);
      globalIds.forEach((id) => nodupPush(globalIdList, id));
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
function interveneDeps(opts: { internal: TInternal; depKeys: string[]; fn?: Fn; add: boolean }) {
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
      state = createOb(rawState, {
        set: setNoop,
        get: (target: Dict, key: any) => {
          record([key]);
          return target[key];
        },
      });
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
  let watch: ICreateOptions['watch'] = [];
  let mutate: ICreateOptions['mutate'] = noop;

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
    rules = options.rules || [];
    watch = options.watch || [];
    mutate = options.mutate || noop;
  }

  return { enableReactive, enableRecordDep, copyObj, enableSyncOriginal, moduleName, deep, exact, rules, watch, mutate };
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
    sharedState = createOb(markedState, {
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

function execDepFnAndInsUpdater(state: Dict, opts: IHanldeStateOptions) {
  const { forAtom, ids, globalIds, depKeys, triggerReasons, internal, sharedState } = opts;
  const { key2InsKeys, id2InsKeys, insCtxMap, sharedKey } = internal;
  console.log('depKeys', depKeys);
  internal.ver += 1;
  // find associate ins keys
  let allInsKeys: number[] = [];
  let globalInsKeys: number[] = [];
  // find associate derived/watch fn ctxs
  let allFirstLevelFnKeys: string[] = [];
  let allAsyncFnKeys: string[] = [];
  const runCountStats: Dict<number> = {};

  const analyzeDepKey = (key: string) => {
    allInsKeys = allInsKeys.concat(key2InsKeys[key] || []);
    const { firstLevelFnKeys, asyncFnKeys } = fnDep.getDepFnStats(key, runCountStats);
    allFirstLevelFnKeys = allFirstLevelFnKeys.concat(firstLevelFnKeys);
    allAsyncFnKeys = allAsyncFnKeys.concat(asyncFnKeys);
  };
  depKeys.forEach(analyzeDepKey);
  // 直接设定 watchList 的 watch 函数，观察的共享对象本身的变化，这里以 sharedKey 为依赖去取查出来
  analyzeDepKey(`${sharedKey}`);
  // find id's ins keys
  ids.forEach((id) => {
    allInsKeys = allInsKeys.concat(id2InsKeys[id] || []);
  });
  // find globalId's ins keys
  globalIds.forEach((id) => {
    getGlobalIdInsKeys(id).forEach((insKey) => globalInsKeys.push(insKey));
  });

  // deduplicate
  allInsKeys = dedupList(allInsKeys);
  allFirstLevelFnKeys = dedupList(allFirstLevelFnKeys);
  allAsyncFnKeys = dedupList(allAsyncFnKeys);

  // start execute compute/watch fns
  allAsyncFnKeys.forEach((fnKey) => fnDep.markComputing(fnKey, runCountStats[fnKey]));
  allFirstLevelFnKeys.forEach((fnKey) => fnDep.runFn(fnKey, { forAtom, updateReasons: triggerReasons }));

  // start trigger watchers mutate cb
  const watchers = getWatchers(sharedState);
  if (watchers.length) {
    const { desc = null, prevDesc = null } = opts;
    watchers.forEach((watcherState) => {
      const { mutate, watch, setStateImpl } = getInternal(watcherState);
      const { draft, finishMutate } = setStateImpl(noop);
      const customOptions: IInnerSetStateOptions = { desc };
      const setOptions = (options: ISetStateOptions) => {
        const { desc = null, ...rest } = options;
        Object.assign(customOptions, { ...rest, prevDesc: desc });
      };
      const params = { draft, watch, desc, prevDesc, setOptions };
      // TODO, pass uncaught err to global err handler
      Promise.resolve(mutate(params)).then((newPartial) => {
        finishMutate(newPartial, customOptions);
      });
    });
  }

  const renderSN = getRenderSN();
  const updateIns = (insCtxMap: InsCtxMap, insKey: number) => {
    const insCtx = insCtxMap.get(insKey) as InsCtxDef;
    insCtx.renderSN = renderSN;
    runInsUpdater(insCtx, state);
  };
  // start update
  allInsKeys.forEach((insKey) => updateIns(insCtxMap, insKey));
  // start update globalId ins
  if (globalInsKeys.length) {
    const globalInsCtxMap = getGlobalInternal().insCtxMap;
    globalInsKeys.forEach((insKey) => updateIns(globalInsCtxMap, insKey));
  }
}

interface IHanldeStateOptions extends ISetStateOptions {
  state: Dict;
  internal: TInternal;
  depKeys: string[];
  ids: string[];
  globalIds: string[];
  triggerReasons: TriggerReason[];
  forAtom: boolean;
  sharedState: SharedState;
  desc?: any;
  prevDesc?: any;
}

function handleState(opts: IHanldeStateOptions) {
  const { state, internal, extraDeps, excludeDeps, depKeys } = opts;
  const { rawState } = internal;
  Object.assign(rawState, state);
  if (internal.isDeep) {
    // now state is a structurally shared obj generated by limu
    internal.rawStateSnap = state;
  } else {
    if (internal.shouldSync) {
      Object.assign(rawState, state);
    }
    internal.rawStateSnap = { ...rawState };
  }
  interveneDeps({ internal, depKeys, add: true, fn: extraDeps });
  interveneDeps({ internal, depKeys, add: false, fn: excludeDeps });
  execDepFnAndInsUpdater(state, opts);
}

interface IHandleDeepMutateOpts extends ISetStateOptions {
  internal: TInternal;
  forAtom: boolean;
  sharedState: SharedState;
  desc?: any;
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
    // customOptions 是为了方便 sharedState 链里的 mutate 回调里提供一个 setOptions 句柄让用户有机会定义 setStateOptions 控制一些额外的行为
    finishMutate(partial?: Dict, customOptions?: IInnerSetStateOptions) {
      // 把深依赖和迁依赖收集到的keys合并起来
      if (isObj(partial)) {
        Object.keys(partial).forEach((key) => {
          nodupPush(depKeys, key);
          draft[key] = partial[key];
        });
      }
      handleOpts.depKeys = Object.keys(writeKeys);
      handleOpts.state = finishDraft(draft); // a structurally shared state generated by limu
      handleOpts.triggerReasons = Object.values(writeKeyPathInfo);
      Object.assign(handleOpts, customOptions);
      handleState(handleOpts);

      return opts.internal.rawStateSnap;
    },
  };
}

interface IHandleNormalMutateOpts extends ISetStateOptions {
  internal: TInternal;
  forAtom: boolean;
  sharedState: SharedState;
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
    handleOperate(genOpParams(key, value), { internal, ids, globalIds, writeKeys, writeKeyPathInfo, writeKey2Ids, writeKey2GlobalIds });
  };

  // 为了和 deep 模式下返回的 setState 保持行为一致
  const mockDraft = createOb(rawState, {
    set: (target: Dict, key: any, value: any) => {
      newPartial[key] = value;
      handleValueChange(key, value);
      return true;
    },
    get: (target: Dict, key: any) => {
      mayChangedKeys.push(key);
      return has(newPartial, key) ? newPartial[key] : target[key];
    },
  });

  return {
    draft: mockDraft,
    finishMutate(partial?: Dict, customOptions?: IInnerSetStateOptions) {
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
      mayChangedKeys.forEach((key) => {
        newPartial[key] = rawState[key];
        handleValueChange(key, newPartial[key]);
      });

      Object.keys(newPartial).forEach((key) => {
        const depKey = prefixValKey(key, sharedKey);
        depKeys.push(depKey);
        triggerReasons.push({ sharedKey, moduleName, keyPath: [depKey] });
      });
      handleOpts.state = newPartial;
      Object.assign(handleOpts, customOptions);
      handleState(handleOpts);

      return internal.rawStateSnap;
    },
  };
}

function bindInternalToShared(sharedState: SharedState, heluxParams: IHeluxParams) {
  const { createOptions } = heluxParams;
  const { deep, forAtom, mutate, watch } = createOptions;
  const insCtxMap = new Map<number, InsCtxDef>();
  const key2InsKeys: KeyInsKeysDict = {};
  // id --> insKeys
  const id2InsKeys: KeyInsKeysDict = {};
  const { writeKey2Ids, writeKey2GlobalIds } = parseRules(heluxParams);
  const isDeep = canUseDeep(deep);

  const setStateImpl = (partialState: any, options: ISetStateOptions = {}) => {
    if (partialState === internal.rawStateSnap) {
      // do nothing
      return { draft: {}, getPartial: () => partialState, finishMutate: () => partialState };
    }

    const mutateOptions = { ...options, forAtom, internal, sharedState };
    // deep 模式修改： setState(draft=>{draft.x.y=1})
    if (isFn(partialState) && isDeep) {
      // now partialState is a draft recipe callback
      const handleCtx = handleDeepMutate(mutateOptions);
      // 后续流程会使用到 getPartial 的返回结果是为了对齐非deep模式的 setState，此时只支持一层依赖收集
      const getPartial = () => partialState(handleCtx.draft);
      return { ...handleCtx, getPartial };
    }

    const handleCtx = handleNormalMutate(mutateOptions);
    const getPartial = () => (isFn(partialState) ? partialState(handleCtx.draft) : partialState);
    return { ...handleCtx, getPartial };
  };
  // setState definition
  const setState: SetState = (partialState, options) => {
    const ret = setStateImpl(partialState, options);
    return ret.finishMutate(ret.getPartial());
  };
  // async setState definition
  const asyncSetState: AsyncSetState = async (partialState, options = {}) => {
    const ret = setStateImpl(partialState, options);
    const partialVar = await Promise.resolve(ret.getPartial());
    return ret.finishMutate(partialVar);
  };
  // setAtom implementation
  const setAtom: SetAtom = (atomVal, options) => {
    const atomState = !isFn(atomVal) ? { val: atomVal } : atomVal;
    return setState(atomState, options).val;
  };

  const internal = buildInternal(heluxParams, {
    setState,
    asyncSetState,
    setAtom,
    setStateImpl,
    insCtxMap,
    key2InsKeys,
    id2InsKeys,
    writeKey2Ids,
    writeKey2GlobalIds,
    isDeep,
    mutate,
    watch,
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
  setWatcher(sharedState, options.watch);

  const internal = getInternal(sharedState);
  return { sharedState, internal };
}
