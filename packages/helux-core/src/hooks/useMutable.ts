import { isFn, isPlainObj } from '@helux/utils';
import { createDraft, finishDraft } from 'limu';
import type { CoreApiCtx } from '../types/api-ctx';
import type { PartialStateCb, PlainObject } from '../types/base';

function useMutableLogic<T extends object = PlainObject>(apiCtx: CoreApiCtx, initialState: T | (() => T), acceptResult?: boolean) {
  const handleState = (partialStateOrCb: Partial<T> | PartialStateCb<T>, prevState: T) => {
    let final = null;
    if (isFn(partialStateOrCb)) {
      // 不自动撤销结束后的草稿 proxy，让用户闭包了子节点的使用场景不报错，但是此节点在结束草稿后只能读取不能修改（修改是无效的）
      const draft = createDraft(prevState, { autoRevoke: false });
      const mayPartial = partialStateOrCb(draft);
      final = finishDraft(draft);
      if (acceptResult && isPlainObj(mayPartial)) {
        Object.assign(final, mayPartial); // call assign is ok here, cause final is already a new state
      }
    } else if (isPlainObj(partialStateOrCb)) {
      final = { ...prevState, ...partialStateOrCb };
    }
    return final;
  };

  return apiCtx.hookImpl.useObjectLogic(initialState, handleState, true);
}


export function useMutable<T extends object = PlainObject>(apiCtx: CoreApiCtx, initialState: T | (() => T)) {
  return useMutableLogic(apiCtx, initialState);
}

/**
 * use mutable that accept callback returned result
 */
export function useMutableAR<T extends object = PlainObject>(apiCtx: CoreApiCtx, initialState: T | (() => T)) {
  return useMutableLogic(apiCtx, initialState, true);
}
