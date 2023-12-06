import { canUseDeep } from '@helux/utils';
import { createOb } from '../../helpers/obj';
import type { OnOperate } from '../../types/base';
import type { TInternal } from './buildInternal';
import { INS_ON_READ } from './current';

interface IReactive {
  timer: any;
  finish: any;
  draft: any;
  expired: boolean;
}

const reactives: Map<number, IReactive> = new Map();

/** 在下一次事件循环里提交之前修改的状态 */
export function flush(sharedKey: number) {
  const reactive = reactives.get(sharedKey);
  if (!reactive) {
    return;
  }
  reactive.timer && clearTimeout(reactive.timer);
  reactive.timer = setTimeout(() => {
    reactive.expired = true; // 标记过期
    reactive.finish();
  }, 0);
}

function getReactive(internal: TInternal) {
  let reactive = reactives.get(internal.sharedKey);
  // 无响应对象、或响应对象已过期
  if (!reactive || reactive.expired) {
    const ret = internal.setStateImpl(null, { enableDraftDep: true, isReactive: true });
    reactive = {
      timer: 0,
      finish: ret.finishMutate,
      draft: ret.draftRoot,
      expired: false,
    };
    reactives.set(internal.sharedKey, reactive);
  }
  return reactive;
}

function setValue(internal: TInternal, key: any, value: any) {
  const reactive = getReactive(internal);
  reactive.draft[key] = value;
  flush(internal.sharedKey);
}

/**
 * 创建全局使用的响应式共享对象
 */
export function buildReactive(internal: TInternal, onRead?: OnOperate) {
  let reactiveState: any = {};
  const { rawState, deep } = internal;

  if (canUseDeep(deep)) {
    reactiveState = createOb(rawState, {
      set: (target: any, key: any, value: any) => {
        setValue(internal, key, value);
        return true;
      },
      get: (target: any, key: any) => {
        INS_ON_READ.set(onRead);
        // 所有实例均共享同一个响应对象
        const reactive = getReactive(internal);
        return reactive.draft[key];
      },
    });
  } else {
    reactiveState = rawState;
  }
  return reactiveState;
}
