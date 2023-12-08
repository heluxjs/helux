import { canUseDeep } from '@helux/utils';
import { SHARED_KEY } from '../../consts';
import { createOb } from '../../helpers/obj';
import { getSharedKey } from '../../helpers/state';
import type { IInnerSetStateOptions, OnOperate } from '../../types/base';
import type { TInternal } from './buildInternal';
import { INS_ON_READ, REACTIVE_DESC } from './current';

interface IReactive {
  timer: any;
  finish: (val: any, options: IInnerSetStateOptions) => any;
  draft: any;
  modified: boolean;
  expired: boolean;
  sharedKey: number;
}

/** key: sharedKey, value: reactive object */
const reactives: Map<number, IReactive> = new Map();

function innerFlush(reactive: IReactive) {
  const { sharedKey } = reactive;
  reactive.expired = true; // 标记过期，不能再被复用
  reactive.finish(null, { from: 'Reactive', desc: REACTIVE_DESC.current(sharedKey) });
  REACTIVE_DESC.del(sharedKey);
}

function canFlush(reactive?: IReactive): reactive is IReactive {
  return !!(reactive && !reactive.expired && reactive.modified);
}

function getKey(shareState: any) {
  // 支持对 draftRoot 直接调用 flush
  let sharedKey = shareState && shareState[SHARED_KEY];
  if (!sharedKey) {
    sharedKey = getSharedKey(shareState);
  }
  return sharedKey;
}

export function markExpired(sharedKey: number) {
  const result = reactives.get(sharedKey);
  if (result) {
    result.expired = true;
  }
}

/**
 * 记录修改描述，让 devtool 可观测到类似 Api_mutate@Reactive/changeA 的描述
 */
export function reactiveDesc(shareState: any, desc?: string) {
  const sharedKey = getKey(shareState);
  desc && REACTIVE_DESC.set(sharedKey, desc);
  return sharedKey;
}

/**
 * 人工触发提交响应式对象的变更数据, sharedState 可以是 draftRoot
 */
export function flush(shareState: any, desc?: string) {
  const sharedKey = reactiveDesc(shareState, desc);
  const reactive = reactives.get(sharedKey);
  if (canFlush(reactive)) {
    // 把定时器的任务清理掉
    clearTimeout(reactive.timer);
    // 提交变化数据
    innerFlush(reactive);
  }
}

/**
 * 在下一次事件循环里提交之前修改的状态，供内部发生状态变化时调用
 */
export function nextTickFlush(sharedKey: number) {
  const reactive = reactives.get(sharedKey);
  if (!reactive) {
    return;
  }
  // TODO  discussion, add cb to microTask with Promise.resolve ?
  reactive.timer && clearTimeout(reactive.timer);
  reactive.modified = true;
  reactive.timer = setTimeout(() => {
    // 人工提前 flush 已清除任务，这里判断一下是为了双保险机制
    canFlush(reactive) && innerFlush(reactive);
  }, 0);
}

/**
 * 全局独立使用或实例使用都共享同一个响应对象
 */
function getReactiveVal(internal: TInternal, atomVal: boolean) {
  const { sharedKey, setStateImpl } = internal;
  let reactive = reactives.get(sharedKey);
  // 无响应对象、或响应对象已过期
  if (!reactive || reactive.expired) {
    const ret = setStateImpl(null, { enableDraftDep: true, isReactive: true });
    reactive = {
      timer: 0,
      finish: ret.finishMutate,
      draft: ret.draftRoot,
      expired: false,
      modified: false,
      sharedKey,
    };
    reactives.set(sharedKey, reactive);
  }
  const { draft } = reactive;
  return atomVal ? draft.val : draft;
}

/**
 * 创建全局使用的响应式共享对象
 */
export function buildReactive(internal: TInternal, onRead?: OnOperate) {
  // 提供 draftRoot draft，和 mutate 回调里对齐，方便用户使用 atom 时少一层 .val 操作
  let draftRoot: any = {};
  let draft: any = {};
  const { rawState, deep, forAtom, isPrimitive, sharedKey } = internal;

  if (canUseDeep(deep)) {
    const set = (atomVal: boolean, key: any, value: any) => {
      const draftVal = getReactiveVal(internal, atomVal);
      // handleOperate 里会自动触发 nextTickFlush
      draftVal[key] = value;
      return true;
    };
    const get = (atomVal: boolean, key: any) => {
      if (key === SHARED_KEY) {
        return sharedKey;
      }
      INS_ON_READ.set(sharedKey, onRead);
      const draftVal = getReactiveVal(internal, atomVal);
      return draftVal[key];
    };

    draftRoot = createOb(rawState, {
      set: (t: any, key: any, value: any) => set(false, key, value),
      get: (t: any, key: any) => get(false, key),
    });
    draft = draftRoot;
    if (forAtom) {
      draft = isPrimitive
        ? rawState.val
        : createOb(rawState, {
            set: (t: any, key: any, value: any) => set(true, key, value),
            get: (t: any, key: any) => get(true, key),
          });
    }
  } else {
    draftRoot = rawState;
    draft = rawState.val;
  }
  return { draftRoot, draft };
}
