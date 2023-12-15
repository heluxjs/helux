import { canUseDeep } from '@helux/utils';
import { FROM, IS_ATOM, REACTIVE_META_KEY, SHARED_KEY } from '../../consts';
import { getSharedKey } from '../../helpers/state';
import type { Dict, From, OnOperate } from '../../types/base';
import type { IReactive, IReactiveMeta } from '../../types/inner';
import { getReactiveKey } from '../common/key';
import type { TInternal } from './buildInternal';
import { REACTIVE_DESC, REACTIVE_META } from './current';

/** key: sharedKey, value: reactive object */
const reactives: Map<number, IReactive> = new Map();

function canFlush(reactive?: IReactive): reactive is IReactive {
  return !!(reactive && !reactive.expired && reactive.modified);
}

/**
 * flush modified data by finish handler
 */
function flushModified(reactive: IReactive) {
  const { sharedKey } = reactive;
  // 标记过期，不能再被复用
  reactive.expired = true;
  // 来自于 flush 记录的 desc 值，使用过一次就清除
  const desc = REACTIVE_DESC.current(sharedKey);
  REACTIVE_DESC.del(sharedKey);
  return reactive.finish(null, { from: FROM.REACTIVE, desc });
}

/**
 * 记录修改描述，让 devtool 可观测到类似 Api_mutate@Reactive/changeA 的描述
 */
export function reactiveDesc(sharedState: any, desc?: string) {
  const sharedKey = getSharedKey(sharedState);
  desc && REACTIVE_DESC.set(sharedKey, desc);
  return sharedKey;
}

/**
 * 人工触发提交响应式对象的变更数据, sharedState 可以是 draftRoot
 */
export function flush(sharedState: any, desc?: string) {
  const sharedKey = getSharedKey(sharedState);
  innerFlush(sharedKey, desc);
}

/**
 * 供内部调用的 flush 方法
 */
export function innerFlush(sharedKey: any, desc?: string) {
  const reactive = reactives.get(sharedKey);
  if (canFlush(reactive)) {
    if (desc) {
      REACTIVE_DESC.set(sharedKey, desc);
    }
    // 提交变化数据
    flushModified(reactive);
  }
}

/**
 * 标记响应对象已过期，再次获取时会自动刷新
 */
export function markExpired(sharedKey: number) {
  const reactive = reactives.get(sharedKey);
  if (reactive) {
    reactive.expired = true;
  }
}

/**
 * 在下一次事件循环里提交之前修改的状态，供内部发生状态变化时调用
 * 故调用此方法就会标记 reactive.modified = true
 */
export function nextTickFlush(sharedKey: number, desc?: string) {
  const reactive = reactives.get(sharedKey);
  if (reactive) {
    reactive.modified = true;
    reactive.nextTickFlush(desc);
  }
}

/**
 * 全局独立使用或实例使用都共享同一个响应对象
 */
function getReactiveVal(internal: TInternal, forAtom: boolean) {
  const { sharedKey } = internal;
  let reactive = reactives.get(sharedKey);
  // 无响应对象、或响应对象已过期
  if (!reactive || reactive.expired) {
    const { finish, draftRoot } = internal.setStateFactory({ isReactive: true, from: FROM.REACTIVE });
    const latestReactive: IReactive = {
      finish,
      draft: draftRoot,
      expired: false,
      modified: false,
      sharedKey,
      data: [null],
      hasFlushTask: false,
      nextTickFlush: (desc?: string) => {
        const { expired, hasFlushTask } = latestReactive;
        if (!expired) {
          latestReactive.data = [desc];
        }
        if (!hasFlushTask) {
          latestReactive.hasFlushTask = true;
          // push flush cb to micro task
          Promise.resolve().then(() => {
            const [desc] = latestReactive.data;
            innerFlush(sharedKey, desc);
          });
        }
      },
    };
    reactive = latestReactive;
    reactives.set(sharedKey, latestReactive);
  }
  const { draft } = reactive;
  return forAtom ? draft.val : draft;
}

/**
 * 创建全局使用的响应式共享对象
 */
export function buildReactive(internal: TInternal, fnDepKeys: string[], options?: { desc?: string; onRead?: OnOperate; from?: From }) {
  // 提供 draftRoot、draft，和 mutate、aciont 回调里对齐，方便用户使用 atom 时少一层 .val 操作
  let draftRoot: any = {};
  let draft: any = {};
  const { rawState, deep, forAtom, isPrimitive, sharedKey, moduleName } = internal;
  const { desc, onRead, from = FROM.REACTIVE } = options || {};

  const rKey = getReactiveKey();
  const meta: IReactiveMeta = { isReactive: true, moduleName, key: rKey, desc: desc || '', sharedKey, writeKeys: [], onRead, from };
  if (canUseDeep(deep)) {
    const innerData = {
      [REACTIVE_META_KEY]: meta,
      [SHARED_KEY]: sharedKey,
      [IS_ATOM]: forAtom,
    };
    const set = (forAtom: boolean, key: any, value: any) => {
      REACTIVE_META.markUsing(rKey);
      const draftVal = getReactiveVal(internal, forAtom);
      // handleOperate 里会自动触发 nextTickFlush
      draftVal[key] = value;
      return true;
    };
    const get = (forAtom: boolean, key: any, innerData: Dict) => {
      REACTIVE_META.markUsing(rKey);
      const val = innerData[key];
      if (val !== undefined) {
        return val;
      }

      const draftVal = getReactiveVal(internal, forAtom);
      return draftVal[key];
    };

    draftRoot = new Proxy(rawState, {
      set: (t: any, key: any, value: any) => set(false, key, value),
      get: (t: any, key: any) => get(false, key, innerData),
    });
    draft = draftRoot;

    // 如果是 atom，draft 指向拆箱后的对象
    if (forAtom) {
      const subInnerData = { ...innerData, [IS_ATOM]: false };
      draft = isPrimitive
        ? rawState.val
        : new Proxy(rawState.val, {
            set: (t: any, key: any, value: any) => set(true, key, value),
            get: (t: any, key: any) => get(true, key, subInnerData),
          });
    }
  } else {
    // 非 Proxy 环境暂不支持 reactive
    draftRoot = rawState;
    draft = rawState.val;
  }
  // 提供给回调使用的 reactive 对象，动态生成的映射关系会在回调结束时被删除
  REACTIVE_META.set(meta.key, meta);

  return { draftRoot, draft, meta };
}
