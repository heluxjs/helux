import { getInternal, recordMod } from '../../helpers/state';
import type { Dict, ICreateOptions } from '../../types';
import { markFnExpired } from '../common/fnScope';
import { clearInternal } from '../common/internal';
import { emitShareCreated } from '../common/plugin';
import { buildSharedState } from './buildShared';
import { mapSharedToInternal } from './mapShared';
import { watchAndCallMutateDict } from './mutateFn';
import { IInnerOptions, parseOptions } from './parse';
export { prepareDeepMutate } from './mutateDeep';
export { prepareNormalMutate } from './mutateNormal';

/**
 * 创建共享对象
 */
export function buildSharedObject<T = Dict>(innerOptions: IInnerOptions, createOptions?: ICreateOptions<T>) {
  const parsedOptions = parseOptions(innerOptions, createOptions);
  const sharedState = buildSharedState(parsedOptions);
  mapSharedToInternal(sharedState, parsedOptions);
  recordMod(sharedState, parsedOptions);
  markFnExpired();
  watchAndCallMutateDict({ target: sharedState, dict: parsedOptions.mutateFnDict });

  const internal = getInternal(sharedState);
  clearInternal(parsedOptions.moduleName, internal.loc);
  emitShareCreated(internal);
  return { sharedState, internal, parsedOptions };
}
