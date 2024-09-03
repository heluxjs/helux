import { isFn, isObj } from '@helux/utils';
import { createDraft, finishDraft } from 'limu';
import type { CoreApiCtx } from '../types/api-ctx';
import type { PartialStateCb, PlainObject } from '../types/base';

export function useMutable<T extends object = PlainObject>(apiCtx: CoreApiCtx, initialState: T | (() => T)) {
  const handleState = (partialStateOrCb: Partial<T> | PartialStateCb<T>, prevState: T) => {
    let final = null;
    if (isFn(partialStateOrCb)) {
      // 不自动撤销结束后的草稿 proxy，使用户闭包了子节点的使用场景不报错，但是此节点在结束草稿后只能读取不能修改（修改是无效的）
      const draft = createDraft(prevState, { autoRevoke: false });
      const mayPartial = partialStateOrCb(draft);
      final = finishDraft(draft);
      if (isObj(mayPartial)) {
        Object.assign(final, mayPartial); // call assign is ok here, cause final is already a new state
      }
    } else if (isObj(partialStateOrCb)) {
      final = { ...prevState, ...partialStateOrCb };
    }
    return final;
  };

  return apiCtx.hookImpl.useObjectLogic(initialState, handleState, true);
}
