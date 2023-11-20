import { canUseDeep, isFn } from '@helux/utils';
import { setInternal } from '../../helpers/state';
import type { AsyncSetState, IInnerSetStateOptions, InnerSetState, SetAtom, SetState, SharedState } from '../../types/base';
import { runPartialCb, wrapPartial } from '../common/util';
import { buildInternal } from './buildInternal';
import { prepareDeepMutate } from './mutateDeep';
import { prepareNormalMutate } from './mutateNormal';
import { ParsedOptions, parseRules, parseSetOptions } from './parse';
import { createSyncerBuilder, createSyncFnBuilder } from './sync';

export function mapSharedToInternal(sharedState: SharedState, options: ParsedOptions) {
  const { rawState, sharedKey, deep, forAtom } = options;
  const ruleConf = parseRules(options);
  const isDeep = canUseDeep(deep);

  const setStateImpl = (partialState: any, options: IInnerSetStateOptions = {}) => {
    if (partialState === internal.snap) {
      // do nothing
      return { draft: {}, getPartial: () => partialState, finishMutate: () => partialState };
    }

    const mutateOptions = { ...options, forAtom, internal, sharedState };
    // deep 模式修改： setState(draft=>{draft.x.y=1})
    if (isFn(partialState) && isDeep) {
      // now partialState is a draft recipe callback
      const handleCtx = prepareDeepMutate(mutateOptions);
      // 后续流程会使用到 getPartial 的返回结果，这样做是为了对齐非 deep 模式的 setState，此时只支持一层依赖收集
      const getPartial = () => wrapPartial(forAtom, partialState(handleCtx.draft));
      return { ...handleCtx, getPartial };
    }

    const handleCtx = prepareNormalMutate(mutateOptions);
    const getPartial = () => runPartialCb(forAtom, partialState, handleCtx.draft);
    return { ...handleCtx, getPartial };
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
  // async setState definition
  const asyncSetState: AsyncSetState = async (partialState, options) => {
    const ret = setStateImpl(partialState, parseSetOptions(options));
    const partialVar = await Promise.resolve(ret.getPartial());
    return ret.finishMutate(partialVar);
  };
  // setAtom implementation，内部调用依然是 setState，独立出来是为了方便 internal 里标记合适的类型
  const setAtom: SetAtom = (atomVal, options) => {
    setState(atomVal, parseSetOptions<any>(options));
  };
  const sync = createSyncFnBuilder(sharedKey, rawState, innerSetState);
  const syncer = createSyncerBuilder(sharedKey, rawState, innerSetState);
  const setDraft = forAtom ? setAtom : setState;

  const internal = buildInternal(options, {
    sharedState,
    setState,
    asyncSetState,
    setAtom,
    setDraft,
    setStateImpl,
    innerSetState,
    ruleConf,
    isDeep,
    syncer,
    sync,
  });

  setInternal(sharedState, internal);
}
