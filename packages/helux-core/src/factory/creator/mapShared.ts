import { canUseDeep } from '@helux/utils';
import { setInternal } from '../../helpers/state';
import type { IInnerSetStateOptions, InnerSetState, SetState, SetStateFactory, SharedState } from '../../types/base';
import { runPartialCb } from '../common/util';
import { buildInternal } from './buildInternal';
import { REACTIVE_DESC } from './current';
import { prepareDeepMutate } from './mutateDeep';
import { prepareDowngradeMutate } from './mutateDowngrade';
import { ParsedOptions, parseRules, pureSetOptions } from './parse';
import { flush } from './reactive';
import { createSyncerBuilder, createSyncFnBuilder } from './sync';

export function mapSharedToInternal(sharedState: SharedState, options: ParsedOptions) {
  const { deep, forAtom, sharedKey } = options;
  const ruleConf = parseRules(options);
  const isDeep = canUseDeep(deep);

  const setStateImpl = (options: IInnerSetStateOptions = {}) => {
    const mutateOptions = { ...options, forAtom, internal, sharedState };
    // deep 模式修改： setState(draft=>{draft.x.y=1})
    const { finishMutate, draftRoot, draftNode } = isDeep ? prepareDeepMutate(mutateOptions) : prepareDowngradeMutate(mutateOptions);
    // 后续流程会使用到 getPartial 的返回结果，注意非 deep 模式的 setState只支持一层依赖收集
    return {
      // 注意非 deep 模式的 finish(setState) 只支持一层依赖收集
      finish: (partialState: any, options: IInnerSetStateOptions = {}) => {
        const snap = internal.snap;
        if (partialState === snap) {
          return snap;
        }
        const partial = runPartialCb(forAtom, partialState, draftNode);
        finishMutate(partial, options);
        return internal.snap; // 此处注意 internal.snap 才是指向最新的快照
      },
      draftRoot,
      draftNode,
    };
  };
  // 内部专用，支持预埋一些参数，返回对象里的 finish 句柄支持扩展其他参数，支持在 finish之前做一些其他操作
  const setStateFactory: SetStateFactory = (options = {}) => {
    return setStateImpl(options);
  };
  // 内部专用，调用就触发修改
  const innerSetState: InnerSetState = (partialState, options = {}) => {
    return setStateImpl().finish(partialState, options);
  };
  // 提供给 useAtom() atom() 返回的 setState 使用
  const setState: SetState = (partialState, options) => {
    // ATTENTION LABEL( flush )
    // 调用 setState 主动把响应式对象可能存在的变更先提交
    // reactive.a = 66;
    // setState(draft=>draft.a+100); // flush后回调里可拿到draft.a最新值为66
    flush(sharedState, REACTIVE_DESC.current(sharedKey));
    const ret = setStateImpl();
    return ret.finish(partialState, pureSetOptions(options));
  };

  const internal = buildInternal(options, {
    sharedState,
    setState,
    setStateFactory,
    innerSetState,
    ruleConf,
    isDeep,
  });
  internal.sync = createSyncFnBuilder(internal);
  internal.syncer = createSyncerBuilder(internal);

  setInternal(sharedState, internal);
  return internal;
}
