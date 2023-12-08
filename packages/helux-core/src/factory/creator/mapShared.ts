import { canUseDeep } from '@helux/utils';
import { setInternal } from '../../helpers/state';
import type { IInnerSetStateOptions, InnerSetState, SetState, SharedState } from '../../types/base';
import { runPartialCb } from '../common/util';
import { buildInternal } from './buildInternal';
import { prepareDeepMutate } from './mutateDeep';
import { prepareNormalMutate } from './mutateNormal';
import { ParsedOptions, parseRules, parseSetOptions } from './parse';
import { createSyncerBuilder, createSyncFnBuilder } from './sync';

export function mapSharedToInternal(sharedState: SharedState, options: ParsedOptions) {
  const { deep, forAtom } = options;
  const ruleConf = parseRules(options);
  const isDeep = canUseDeep(deep);

  const setStateImpl = (partialState: any, options: IInnerSetStateOptions = {}) => {
    if (partialState === internal.snap) {
      // do nothing
      const obj = {};
      const fn = () => partialState;
      return { draftRoot: obj, draftNode: obj, getPartial: fn, finishMutate: fn };
    }

    const mutateOptions = { ...options, forAtom, internal, sharedState };
    // deep 模式修改： setState(draft=>{draft.x.y=1})
    const preparedInfo = isDeep ? prepareDeepMutate(mutateOptions) : prepareNormalMutate(mutateOptions);
    // 后续流程会使用到 getPartial 的返回结果，注意非 deep 模式的 setState只支持一层依赖收集
    const getPartial = () => runPartialCb(forAtom, partialState, preparedInfo.draftNode);
    return { ...preparedInfo, getPartial };
  };
  // for inner call
  const innerSetState: InnerSetState = (partialState, options) => {
    const ret = setStateImpl(partialState, options);
    return ret.finishMutate(ret.getPartial());
  };
  // setState definition
  const setState: SetState = (partialState, options) => {
    const ret = setStateImpl(partialState, parseSetOptions(options));
    return ret.finishMutate(ret.getPartial());
  };

  const internal = buildInternal(options, {
    sharedState,
    setState,
    setStateImpl,
    innerSetState,
    ruleConf,
    isDeep,
  });
  internal.sync = createSyncFnBuilder(internal);
  internal.syncer = createSyncerBuilder(internal);

  setInternal(sharedState, internal);
  return internal;
}
