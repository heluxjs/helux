import { canUseDeep, noop } from '@helux/utils';
import { setInternal } from '../../helpers/state';
import type {
  IInnerSetStateOptions,
  InnerSetState,
  ISetFactoryOpts,
  ISetStateOptions,
  SetDraft,
  SetState,
  SetStateFactory,
  SharedState,
} from '../../types/base';
import { runPartialCb } from '../common/util';
import { STATE_TYPE } from '../../consts';
import { buildInternal } from './buildInternal';
import { REACTIVE_DESC } from './current';
import { prepareDeepMutate } from './mutateDeep';
import { prepareDowngradeMutate } from './mutateDowngrade';
import { ParsedOptions, parseRules, pureSetOptions } from './parse';
import { flush } from './reactive';
import { createSyncerBuilder, createSyncFnBuilder } from './sync';

/** 因外部用不到，这些类型可不用创建 syncer，节省触发的 immut 调用，以便节省内存空间 */
const noSyncerTypes: string[] = [STATE_TYPE.GLOGAL_EMPTY, STATE_TYPE.GLOGAL_LOADING, STATE_TYPE.PRIVATE_LOADING];
const fakeBuilder = () => noop;

export function mapSharedToInternal(sharedRoot: SharedState, sharedState: SharedState, options: ParsedOptions) {
  const { deep, forAtom, sharedKey } = options;
  const ruleConf = parseRules(options);
  const isDeep = canUseDeep(deep);

  const setStateImpl = (setFactoryOpts: ISetFactoryOpts = {}) => {
    const mutateOptions = { internal, setFactoryOpts };
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
  // 内部专用，支持预埋一些参数，返回对象里的 finish 句柄支持扩展其他参数，支持在 finish 之前做一些其他操作
  const setStateFactory: SetStateFactory = (options = {}) => {
    return setStateImpl(options);
  };
  // 内部专用，调用就触发修改
  const innerSetState: InnerSetState = (partialState, options = {}) => {
    return setStateImpl().finish(partialState, options);
  };
  const callSetState = (partialState: any, optArr: [boolean, boolean, ISetStateOptions | undefined]) => {
    const [handleCbReturn, enableDep, setOptions] = optArr;
    // ATTENTION LABEL( flush )
    // 调用 setState 主动把响应式对象可能存在的变更先提交
    // reactive.a = 66;
    // setState(draft=>draft.a+100); // flush 后回调里可拿到 draft.a 最新值为 66
    flush(sharedRoot, REACTIVE_DESC.current(sharedKey));
    const ret = setStateImpl({ handleCbReturn, enableDep });
    return ret.finish(partialState, pureSetOptions(setOptions));
  };
  // 提供给 atom share sharex atomx 返回的 setState 使用
  const setState: SetState = (partialState, options) => callSetState(partialState, [true, true, options]);
  // 提供给 atom share sharex atomx 返回的 setDrart 使用
  const setDraft: SetDraft = (partialState, options) => callSetState(partialState, [false, true, options]);
  // 提供给 useAtom useAtomX 返回的 setState 使用
  const insSetState: SetState = (partialState, options) => callSetState(partialState, [true, false, options]);
  // 提供给 useAtom 返回的 renderInfo.setDrart 和 useAtomX 返回的 setDrart 使用
  const insSetDraft: SetDraft = (partialState, options) => callSetState(partialState, [false, false, options]);

  const internal = buildInternal(options, {
    sharedRoot,
    sharedState,
    setState,
    setDraft,
    insSetState,
    insSetDraft,
    setStateFactory,
    innerSetState,
    ruleConf,
    isDeep,
  });
  internal.sync = noSyncerTypes.includes(internal.stateType) ? fakeBuilder : createSyncFnBuilder(internal);
  internal.syncer = createSyncerBuilder(internal);

  setInternal(sharedRoot, internal);
  return internal;
}
