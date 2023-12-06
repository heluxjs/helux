import { getInternal, recordMod } from '../../helpers/state';
import type { Dict, ICreateOptions } from '../../types/base';
import { markFnExpired } from '../common/fnScope';
import { clearInternal } from '../common/internal';
import { emitShareCreated } from '../common/plugin';
import { buildReactive } from './buildReactive';
import { buildSharedState } from './buildShared';
import { clearDcLog } from './deadCycle';
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
  // 创建顶层使用的响应式对象
  internal.reactive = buildReactive(internal);
  clearInternal(parsedOptions.moduleName, internal.loc);
  clearDcLog(internal.usefulName);
  emitShareCreated(internal);
  return { sharedState, internal, parsedOptions };
}
