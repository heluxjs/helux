import { createDraft, finishDraft, immut, IOperateParams } from 'limu';
import { HAS_SYMBOL, IS_ATOM, KEY_SPLITER } from '../consts';
import { getRenderSN } from '../factory/common/scope';
import { getArrKey, getMutateCtx, IMutateCtx, recordDataKeyForStop } from '../factory/common/util';
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
  ICreateOptions,
  ICreateOptionsType,
  IHeluxParams,
  IInnerCreateOptions,
  IInnerSetStateOptions,
  InsCtxMap,
  IRuleConf,
  ISetStateOptions,
  KeyBoolDict,
  KeyIdsDict,
  KeyInsKeysDict,
  NumStrSymbol,
  SetAtom,
  SetState,
  SharedState,
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

function getDepKeyByPath(fullKeyPath: string[], sharedKey: number) {
  return prefixValKey(fullKeyPath.join(KEY_SPLITER), sharedKey);
}

function handleOperate(opParams: IOperateParams, opts: { internal: TInternal; mutateCtx: IMutateCtx }) {
  const { isChange, fullKeyPath, keyPath, parentType } = opParams;
  const { internal, mutateCtx } = opts;
  const { arrKeyDict } = mutateCtx;
  if (!isChange) {
    if (parentType === 'Array') {
      arrKeyDict[getDepKeyByPath(keyPath, internal.sharedKey)] = 1;
    }
    return;
  }

  const { moduleName, sharedKey, createOptions, ruleConf } = internal;
  const writeKey = getDepKeyByPath(fullKeyPath, sharedKey);
  const { writeKeyPathInfo, ids, globalIds, writeKeys } = mutateCtx;
  const { idsDict, globalIdsDict, stopDepInfo } = ruleConf;

  writeKeyPathInfo[writeKey] = { sharedKey, moduleName, keyPath: fullKeyPath };

  // 设定了非精确更新策略时，提取出第一层更新路径即可
  if (!createOptions.exact) {
    const keyPrefix = prefixValKey('', sharedKey); // as namespace
    const level1Key = `${keyPrefix}${fullKeyPath[0]}`;
    writeKeys[level1Key] = 1;
    return;
  }
  // 用户设定了精确更新策略，则只查当前更新路径的视图

  const arrKey = getArrKey(writeKey, arrKeyDict);
  if (arrKey) {
    // 主动把数组key也记录下，因为数组对应视图通常都用 forEach 生成的
    // 然后遍历出来的孩子节点都会包一个 memo，所以需主动通知一下使用数组根节点的组件重渲染
    writeKeys[arrKey] = 1;
  }
  // 可能会缩短后再记录
  if (
    !recordDataKeyForStop(writeKey, stopDepInfo, (key) => {
      writeKeys[key] = 1;
    })
  ) {
    writeKeys[writeKey] = 1;
  }

  const putId = (keyIds: KeyIdsDict, ids: string[]) => {
    // find update ids configured in rules
    Object.keys(keyIds).forEach((confKey) => {
      // writeKey: 1/a|list|0|name
      // confKey: 1/a|list
      if (writeKey.startsWith(confKey)) {
        keyIds[confKey].forEach((id) => nodupPush(ids, id));
      }
    });
  };
  putId(idsDict, ids);
  putId(globalIdsDict, globalIds);
}

/**
 * 解析出 createShared 里配置的 rules
 */
function parseRules(heluxParams: IHeluxParams): IRuleConf {
  const { markedState, sharedKey, createOptions } = heluxParams;
  const { deep, rules } = createOptions;
  const idsDict: KeyIdsDict = {};
  const globalIdsDict: KeyIdsDict = {};
  const stopDepInfo: IRuleConf['stopDepInfo'] = { keys: [], isArrDict: {} };
  const isArrDict: KeyBoolDict = {}; // 临时记录是否是数组，后面步骤会转移到 stopDepInfo.isArrDict
  const isDeep = canUseDeep(deep);

  rules.forEach((rule) => {
    // when 函数执行完，会写入读取到的 key 列表
    const confKeys: string[] = [];
    const { when, ids = [], globalIds = [], stopDep = false } = rule;

    let state: any;
    let keyReaded = false;
    if (isDeep) {
      let pervKey = '';
      state = immut(markedState, {
        onOperate: ({ fullKeyPath, value, isBuiltInFnKey }) => {
          if (isBuiltInFnKey) return;
          // 只记录单一路径下读取的最长的那个key，
          // 即 a.b.c 行为会触发 ['a'] ['a','b'] ['a','b','c'] 3次 onOperate 操作
          // 但 confKeys 只记录['a','b','c'] 这一次生成的 key
          const confKey = getDepKeyByPath(fullKeyPath, sharedKey);
          if (pervKey && confKey.includes(pervKey)) {
            // 是一条路径中正在下钻的key，将之前的弹出
            confKeys.pop();
          }
          confKeys.push(confKey);
          isArrDict[confKey] = Array.isArray(value);
          pervKey = confKey;
          keyReaded = true;
        },
      });
    } else {
      state = createOb(markedState, {
        set: setNoop,
        get: (target: Dict, key: any) => {
          const confKey = getDepKeyByPath([key], sharedKey);
          confKeys.push(confKey);
          const value = target[key];
          isArrDict[confKey] = Array.isArray(value);
          keyReaded = true;
          return value;
        },
      });
    }

    const result = when(state);
    // record id, globalId, stopDep
    const setRuleConf = (confKey: string) => {
      const idList = safeGet(idsDict, confKey, [] as NumStrSymbol[]);
      ids.forEach((id) => nodupPush(idList, id));
      const globalIdList = safeGet(globalIdsDict, confKey, [] as NumStrSymbol[]);
      globalIds.forEach((id) => nodupPush(globalIdList, id));
      if (stopDep && isArrDict[confKey]) {
        nodupPush(stopDepInfo.keys, confKey);
        stopDepInfo.isArrDict[confKey] = isArrDict[confKey];
      }
    };
    confKeys.forEach(setRuleConf);

    if (
      keyReaded
      || result === state // 返回了state自身
      || (Array.isArray(result) && result.includes(state)) // 返回了数组，包含有state自身
    ) {
      setRuleConf(`${sharedKey}`);
    }
  });

  return { idsDict, globalIdsDict, stopDepInfo };
}

/** 干预 setState 调用结束后收集到的依赖项（新增或删除） */
function interveneDeps(isAdd: boolean, opts: IHanldeStateOptions) {
  const { extraDeps, excludeDeps } = opts;
  const fn = isAdd ? extraDeps : excludeDeps;
  if (isFn(fn)) {
    const {
      mutateCtx: { depKeys },
      internal: { rawState, sharedKey, isDeep },
    } = opts;
    let state: any;
    const record = (keyPath: string[]) => {
      const depKey = getDepKeyByPath(keyPath, sharedKey);
      isAdd ? nodupPush(depKeys, depKey) : delListItem(depKeys, depKey);
    };

    if (isDeep) {
      state = immut(rawState, {
        onOperate: ({ fullKeyPath, isBuiltInFnKey }) => !isBuiltInFnKey && record(fullKeyPath),
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

/**
 * 分析 createOptions，算出 helux 内部创建共享对象过程中需要的参数
 */
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
  const { enableReactive, deep, forAtom } = createOptions;
  const collectDep = (key: string) => {
    const depKey = prefixValKey(key, sharedKey);
    // using shared state in derived/watch callback
    fnDep.recordValKeyDep(depKey, { sharedKey });
  };

  if (canUseDeep(deep)) {
    sharedState = immut(markedState, {
      customKeys: [IS_ATOM as symbol],
      customGet: () => forAtom,
      onOperate: (params) => !params.isBuiltInFnKey && collectDep(params.fullKeyPath.join(KEY_SPLITER)),
    });
  } else {
    sharedState = createOb(markedState, {
      set: (target: Dict, key: any, val: any) => {
        // TODO: enableReactive 机制和现有流程不匹配，可能考虑移除
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
  const { forAtom, mutateCtx, internal, sharedState } = opts;
  const { ids, globalIds, depKeys, triggerReasons } = mutateCtx;
  const { key2InsKeys, id2InsKeys, insCtxMap, sharedKey } = internal;
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

  const sn = getRenderSN();
  // deduplicate
  allInsKeys = dedupList(allInsKeys);
  allFirstLevelFnKeys = dedupList(allFirstLevelFnKeys);
  allAsyncFnKeys = dedupList(allAsyncFnKeys);

  // start execute compute/watch fns
  allAsyncFnKeys.forEach((fnKey) => fnDep.markComputing(fnKey, runCountStats[fnKey]));
  allFirstLevelFnKeys.forEach((fnKey) => fnDep.runFn(fnKey, { sn, forAtom, updateReasons: triggerReasons }));

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

  const updateIns = (insCtxMap: InsCtxMap, insKey: number) => {
    const insCtx = insCtxMap.get(insKey) as InsCtxDef;
    if (insCtx) {
      insCtx.renderInfo.sn = sn;
      runInsUpdater(insCtx, state);
    }
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
  mutateCtx: IMutateCtx;
  forAtom: boolean;
  sharedState: SharedState;
  desc?: any;
  prevDesc?: any;
}

function handleState(opts: IHanldeStateOptions) {
  const { state, internal } = opts;
  const { rawState } = internal;
  Object.assign(rawState, state);
  if (internal.isDeep) {
    // now state is a structural sharing obj generated by limu
    internal.rawStateSnap = state;
  } else {
    if (internal.shouldSync) {
      Object.assign(rawState, state);
    }
    internal.rawStateSnap = { ...rawState };
  }
  interveneDeps(true, opts);
  interveneDeps(false, opts);
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
  const { rawState } = internal;

  const mutateCtx = getMutateCtx();
  const handleOpts = { state: {}, mutateCtx, ...opts };
  const draft = createDraft(rawState, {
    onOperate(opParams) {
      handleOperate(opParams, { internal, mutateCtx });
    },
  });

  return {
    draft,
    // customOptions 是为了方便 sharedState 链里的 mutate 回调里提供一个 setOptions 句柄让用户有机会定义 setStateOptions 控制一些额外的行为
    finishMutate(partial?: Dict, customOptions?: IInnerSetStateOptions) {
      const { writeKeys, writeKeyPathInfo } = mutateCtx;
      // 把深依赖和迁依赖收集到的keys合并起来
      if (isObj(partial)) {
        Object.keys(partial).forEach((key) => {
          draft[key] = partial[key]; // 触发 writeKeys 里记录当前变化key
        });
      }
      mutateCtx.depKeys = Object.keys(writeKeys);
      handleOpts.state = finishDraft(draft); // a structurally shared state generated by limu
      mutateCtx.triggerReasons = Object.values(writeKeyPathInfo);
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
  const { rawState, sharedKey, moduleName } = internal;
  const newPartial: Dict = {};
  const mayChangedKeys: string[] = [];

  const mutateCtx = getMutateCtx();
  const handleOpts = { state: {}, mutateCtx, ...opts };
  const handleValueChange = (key: string, value: any) => {
    handleOperate(genOpParams(key, value), { internal, mutateCtx });
  };

  // 为了和 deep 模式下返回的 setState 保持行为一致
  const mockDraft = createOb(rawState, {
    set: (target: Dict, key: any, value: any) => {
      newPartial[key] = value;
      handleValueChange(key, value);
      return true;
    },
    get: (target: Dict, key: any) => {
      const value = target[key];
      // 用户可能在非deep模式下直接修改深层次路径的值： state.a.b = 1
      // 但 get 只能拦截到第一层，故这记录到 mayChangedKeys 里
      if (isObj(value)) {
        mayChangedKeys.push(key);
      }
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

      const { depKeys, triggerReasons } = mutateCtx;
      Object.keys(newPartial).forEach((key) => {
        const depKey = prefixValKey(key, sharedKey);
        nodupPush(depKeys, depKey);
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
  const ruleConf = parseRules(heluxParams);
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
    ruleConf,
    isDeep,
    mutate,
    watch,
  });

  bindInternal(sharedState, internal);
}

/**
 * 创建共享对象
 */
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
