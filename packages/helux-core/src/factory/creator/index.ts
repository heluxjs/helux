import { recordMod } from '../../helpers/state';
import type { ICreateOptions } from '../../types/base';
import { markFnExpired } from '../common/fnScope';
import { clearInternal } from '../common/internal';
import { emitShareCreated } from '../common/plugin';
import { buildSharedState } from './buildShared';
import { clearDcLog } from './deadCycle';
import { mapSharedToInternal } from './mapShared';
import { watchAndCallMutateDict } from './mutateFn';
import { IInnerOptions, parseOptions } from './parse';
import { buildReactive } from './reactive';
export { prepareDeepMutate } from './mutateDeep';
export { prepareDowngradeMutate as prepareNormalMutate } from './mutateDowngrade';

/**
 * 创建共享对象
 */
export function buildSharedObject<T = any>(innerOptions: IInnerOptions, createOptions?: ICreateOptions<T>) {
  const parsedOptions = parseOptions(innerOptions, createOptions);
  const { sharedRoot, sharedState } = buildSharedState(parsedOptions);
  const internal = mapSharedToInternal(sharedRoot, parsedOptions);

  recordMod(sharedRoot, parsedOptions);
  markFnExpired();
  watchAndCallMutateDict({ target: sharedRoot, dict: parsedOptions.mutateFnDict });

  // 创建顶层使用的响应式对象
  const { draft, draftRoot } = buildReactive(internal, []);
  internal.reactive = draft;
  internal.reactiveRoot = draftRoot;
  clearInternal(parsedOptions.moduleName, internal.loc);
  clearDcLog(internal.usefulName);
  emitShareCreated(internal);
  return { sharedRoot, sharedState, internal, parsedOptions };
}
