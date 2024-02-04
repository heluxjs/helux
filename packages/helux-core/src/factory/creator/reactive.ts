import { canUseDeep } from '@helux/utils';
import { FROM, IS_ATOM, REACTIVE_META_KEY, SHARED_KEY } from '../../consts';
import { getSharedKey } from '../../helpers/state';
import type { Dict } from '../../types/base';
import type { IReactiveMeta } from '../../types/inner';
import { IBuildReactiveOpts, newReactiveMeta } from '../common/ctor';
import { fakeReativeMeta } from '../common/fake';
import { getReactiveKey } from '../common/key';
import type { TInternal } from './buildInternal';
import { REACTIVE_DESC, REACTIVE_META, TRIGGERED_WATCH } from './current';

const { REACTIVE } = FROM;

/** key: sharedKey, value: top reactive meta */
const metas: Map<number, IReactiveMeta> = new Map();

function canFlush(meta?: IReactiveMeta): meta is IReactiveMeta {
  return !!(meta && !meta.expired && meta.modified);
}

/**
 * flush modified data by finish handler
 */
function flushModified(meta: IReactiveMeta) {
  const { sharedKey } = meta;
  // 标记过期，不能再被复用
  meta.expired = true;
  REACTIVE_META.del(meta.key);
  // 来自于 flush 记录的 desc 值，使用过一次就清除
  const desc = REACTIVE_DESC.current(sharedKey);
  REACTIVE_DESC.del(sharedKey);
  return meta.finish(null, { desc });
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
 * 刷新可能在活跃中的 reaactive 对象，提交后自动标记过期
 */
export function flushActive() {
  const meta = REACTIVE_META.current();
  if (meta.isTop) {
    innerFlush(meta.sharedKey, meta.desc);
  }
}

/**
 * 供内部调用的 flush 方法
 */
export function innerFlush(sharedKey: any, desc?: string) {
  const meta = metas.get(sharedKey);
  if (canFlush(meta)) {
    if (desc) {
      REACTIVE_DESC.set(sharedKey, desc);
    }
    // 提交变化数据
    flushModified(meta);
  }
}

/**
 * 标记响应对象已过期，再次获取时会自动刷新
 */
export function markExpired(sharedKey: number) {
  const meta = metas.get(sharedKey) || fakeReativeMeta;
  meta.expired = true;
}

/**
 * 在下一次事件循环里提交之前修改的状态，供内部发生状态变化时调用
 * 故调用此方法就会标记 reactive.modified = true
 */
export function nextTickFlush(sharedKey: number, desc?: string) {
  const meta = metas.get(sharedKey) || fakeReativeMeta;
  meta.modified = true;
  meta.nextTickFlush(desc);
}

function buildMeta(internal: TInternal, options: IBuildReactiveOpts) {
  const { from = REACTIVE } = options;
  const { finish, draftRoot } = internal.setStateFactory({ isReactive: true, from, handleCbReturn: false, enableDep: true });
  const latestMeta = newReactiveMeta(draftRoot, options, finish);
  latestMeta.key = getReactiveKey();
  latestMeta.sharedKey = internal.sharedKey;
  latestMeta.nextTickFlush = (desc?: string) => {
    const { expired, hasFlushTask } = latestMeta;
    if (!expired) {
      latestMeta.data = [desc];
    }
    if (!hasFlushTask) {
      latestMeta.hasFlushTask = true;
      // push flush cb to micro task
      Promise.resolve().then(() => {
        const [desc] = latestMeta.data;
        innerFlush(internal.sharedKey, desc);
      });
    }
  };
  return latestMeta;
}

/**
 * 全局独立使用或实例使用都共享同一个响应对象
 */
function getReactiveInfo(internal: TInternal, options: IBuildReactiveOpts, forAtom: boolean) {
  const { sharedKey } = internal;
  const { insKey = 0, from } = options;
  let meta = metas.get(sharedKey) || fakeReativeMeta;

  // 无顶层响应对象、或顶层响应对象已过期，则重建顶层 top reactive
  if (meta.expired) {
    meta = buildMeta(internal, { isTop: true, from });
    metas.set(sharedKey, meta);
    REACTIVE_META.set(meta.key, meta);
    meta.fnKey = TRIGGERED_WATCH.current();
  }

  // mark using
  REACTIVE_META.markUsing(meta.key);
  // 当前 reactive 操作来自于实例则替换为实例的 onRead，反之则置空 onRead
  meta.onRead = insKey ? options.onRead : undefined;
  meta.insKey = insKey;
  const { draft } = meta;
  return { val: forAtom ? draft.val : draft, meta };
}

/**
 * 创建响应式共享对象
 */
export function buildReactive(internal: TInternal, options: IBuildReactiveOpts) {
  // 提供 draftRoot、draft，和 mutate、aciont 回调里对齐，方便用户使用 atom 时少一层 .val 操作
  let draftRoot: any = {};
  let draft: any = {};
  const { rawState, deep, forAtom, isPrimitive, sharedKey } = internal;

  if (canUseDeep(deep)) {
    const innerData = {
      [SHARED_KEY]: sharedKey,
      [IS_ATOM]: forAtom,
    };
    const set = (forAtom: boolean, key: any, value: any) => {
      const { val } = getReactiveInfo(internal, options, forAtom);
      // handleOperate 里会自动触发 nextTickFlush
      val[key] = value;
      return true;
    };
    const get = (forAtom: boolean, key: any, innerData: Dict) => {
      const innerVal = innerData[key];
      if (innerVal !== undefined) {
        return innerVal;
      }
      const { val, meta } = getReactiveInfo(internal, options, forAtom);
      if (REACTIVE_META_KEY === key) {
        return meta;
      }

      return val[key];
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
    // TODO 非 Proxy 环境暂不支持 reactive
    draftRoot = rawState;
    draft = rawState.val;
  }

  return { draftRoot, draft };
}
