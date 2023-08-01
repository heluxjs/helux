import { Dict, IFnParams, IsComputing } from '../types';
import { useComputedLogic } from './useComputed';

export function useComputedTask<R extends Dict = Dict>(
  computeFn: (taskParams: IFnParams) => {
    initial: R;
    task: () => Promise<R>;
  },
  enableRecordResultDep?: boolean,
): [R, IsComputing] {
  const resultPair = useComputedLogic({ fn: computeFn, enableRecordResultDep, careComputeStatus: true, asyncType: 'task' });
  return resultPair;
}
